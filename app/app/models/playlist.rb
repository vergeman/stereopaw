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
  before_save :integerize_track_ids, :calc_top_genres

  belongs_to :user

  validates :name, :user_id, presence: true
  validates :name, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }
  validate  :validate_track_ids
  validate  :validate_tracks_exist

  validates_uniqueness_of :name, scope: :user_id, message: "already exists"

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
