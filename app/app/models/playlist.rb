# == Schema Information
#
# Table name: playlists
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  track_ids   :integer          default([]), is an Array
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  top_genres  :string           default([]), is an Array
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
      Track.find(track_ids)
      #track_ids.each do |t|
      #  Track.find(t)
      #end
    rescue ActiveRecord::RecordNotFound
      errors.add(:track_ids, "track not found")
    end
  end

end
