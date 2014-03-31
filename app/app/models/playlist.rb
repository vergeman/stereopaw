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
#

class Playlist < ActiveRecord::Base
  before_save :integerize_track_ids

  belongs_to :user

  validates :name, :user_id, presence: true
  validates :name, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }
  validate :track_ids, :validate_track_ids
  validate :track_ids, :validate_tracks_exist

  validates_uniqueness_of :name, scope: :user_id, message: "already exists"

  def integerize_track_ids
    self.track_ids = self.track_ids.map(&:to_i)
  end

  #track_id validation: array type + track_id values are integers
  def validate_track_ids
    if track_ids.is_a?(Array)
      if track_ids.detect { |t|  t.to_s !~ /\A\d+\Z/ }
        errors.add(:track_ids, "invalid track data")
      end
    end
  end

  def validate_tracks_exist
    begin
      @tracks = Track.find(track_ids)
    rescue ActiveRecord::RecordNotFound
      errors.add(:track_ids, "track not found")
    end
  end

end
