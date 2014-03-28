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
  belongs_to :user

  validates :name, :user_id, presence: true
  validates :name, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }

  validates_uniqueness_of :name, scope: :user_id, message: "already exists"
end
