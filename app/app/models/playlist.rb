# == Schema Information
#
# Table name: playlists
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  track_ids   :integer          default([])
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  top_genres  :string(255)      default([])
#

class Playlist < ActiveRecord::Base
  attr_accessor :track_previews

  include PgSearch
  pg_search_scope :search_by_descriptions, :against => [:name, :description]

  before_save :integerize_track_ids, :calc_top_genres

  belongs_to :user

  validates :name, :user_id, presence: true
  validates :name, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }
  validate  :validate_track_ids
  validate  :validate_tracks_exist

  validates_uniqueness_of :name, scope: :user_id, message: "already exists"


#
## Controller Wraps
#
  #SHOW
  def self.show_playlist_tracks(params)

    return self.load_playlist do
      @playlist = Playlist.find(params[:id])

      @tracks = Track.where(id: @playlist.track_ids)
      return @tracks

    end

  end

  #CREATE
  def self.create_playlist(params, current_user)
    @playlist = current_user.playlists
      .build( self.new_params(params) )

    if @playlist.save
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      return @playlist.with_track_preview
    else
      return {:errors => @playlist.errors.messages}
    end
  end

  #UPDATE
  def self.update_playlist(params, current_user)

    try_load = self.load_playlist do
      @playlist = current_user.playlists.find(params[:id])
    end

    if try_load.is_a?(Hash) && try_load[:errors]
      return try_load
    end

    #type of update is dealt with in track_params
    if @playlist
        .update_attributes( self.track_params(params, @playlist) )

      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      return @playlist.with_track_preview
    else
      return {:errors => @playlist.errors.messages}
    end
  end


  def self.track_params(params, playlist)
    #case of just adding a track id to params
    if params[:track] && playlist

      return {
        :track_ids => 
        playlist.track_ids + [ params[:track] ] 
      }

    else
      #case where track_ids are being removed, or playlist's
      #meta data is being changed
      return self._parse_track_id_params(params)
    end
  end


  #case where remove track_id or update playlist meta data
  #this is UGLY but pg array saving behavior is really strange
  def self._parse_track_id_params(params)

    #track removal
    if params[:playlist].has_key?(:track_ids)
      #if: they've deleted the last remaining track in a playlist
      #else: track_ids are updated (deleted any old track)
      _params = self.new_params(params)

      if params[:playlist][:track_ids].nil?
        _params[:track_ids] = []
      else
        _params[:track_ids] = Array.new(params[:playlist][:track_ids])
      end
      return _params
    end

    #otherwise other playlist stuff updated (i.e. name, description)
    return self.new_params(params)
  end


  #playlist helper for params
  def self.new_params(params)
    params.require(:playlist).permit(:name,
                                     :description,
                                     :track_ids) if params[:playlist]
  end


  #DESTROY
  def self.destroy_playlist(params, current_user)

    try_load = self.load_playlist do
      @playlist = current_user.playlists.find(params[:id])
    end
    
    if try_load.is_a?(Hash) && try_load[:errors]
      return try_load
    end

    if @playlist.destroy
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      return {:success => "playlist destroyed"}
    else
      return {:errors => "error destroying playlist"}
    end

  end


#
## Controller - Model error catching
#
  def self.load_playlist
    begin
      yield if block_given?
    rescue ActiveRecord::RecordNotFound
      return {:errors => "invalid playlist"}
    end
  end


#
## MODEL METHODS
#
  #override to hide data
  def as_json(options={})
    options[:except] ||= [:user_id, :pg_search_rank]
    super
  end


  #generates array of track_previews
  def with_track_preview(options = {})
    options = {sort_order: "plays DESC", count: 3, query: false}
      .merge(options)

    if options[:query]

      #take most relevant first, then order
      @track_previews = Track.where(id: self.track_ids)
        .search_by_meta(options[:query]).limit(options[:count])
        .order(options[:sort_order])
        .as_json(except: [:submit_id, :user_id, :updated_at, :shareable, :pg_search_rank])

    else
      #order by plays first, then limit
      @track_previews = Track.where(id: self.track_ids)
        .order(options[:sort_order]).limit(options[:count])
        .as_json(except: [:submit_id, :user_id, :updated_at, :shareable, :pg_search_rank])
    end

    #make sure to return playlist obj
    return self
  end


  #calculates and returns lists of top genres within a playlist
  def calc_top_genres
    top_genres = {}
    genres = Track.where(id: self.track_ids).map(&:genres)
    genres.each do |g|
      g.each do |_g|
        top_genres.has_key?(_g) ? top_genres[_g]+=1 : top_genres[_g] = 1 
      end
    end
    self.top_genres = top_genres.sort_by{|k,v| v}.reverse.map{|g| g[0]}[0..2]
  end

  def integerize_track_ids
    self.track_ids = self.track_ids.map(&:to_i)
  end

#
## VALIDATIONS
#
  #track_id validation: array type + track_id values are integers
  def validate_track_ids
    if self.track_ids.is_a?(Array)
      if self.track_ids.detect { |t|  t.to_s !~ /\A\d+\Z/ }
        errors.add(:track_ids, "invalid track data")
      end
    end
  end
  
  def validate_tracks_exist
    begin
      track_ids.each do |t|
        Track.find(t)
      end
    rescue ActiveRecord::RecordNotFound
      errors.add(:track_ids, "track not found")
    end
  end

end
