# == Schema Information
#
# Table name: tracks
#
#  id          :integer          not null, primary key
#  artist      :string(255)
#  title       :string(255)
#  profile_url :string(255)
#  page_url    :string(255)
#  duration    :decimal(, )
#  timestamp   :decimal(, )
#  timeformat  :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  comment     :text
#  track_id    :string(255)
#  shareable   :boolean
#  service     :string(255)
#  artwork_url :string(255)
#  user_id     :integer
#  genres      :string(255)      default([])
#  plays       :integer
#
# Indexes
#
#  index_tracks_on_genres  (genres)
#

class Track < ActiveRecord::Base
  belongs_to :user

  validates :artist, :title, :page_url, :profile_url, :shareable, :service, :artwork_url, :user_id, presence: true

  validates :profile_url, :page_url, :artwork_url, url: true #/validators/UrlValidator

  validates :duration, :timestamp, numericality: true
  validates :plays, numericality: { only_integer: true, :greater_than_or_equal_to => 0 }

  validates_format_of :timeformat, :with => /\A([^0:\D][0-9]*:)?([1-5]?[0-9]:)([0-5][0-9])\Z/

  validates :comment, length: { maximum: 1000 }
  after_initialize :default_values

  def default_values
    self.timestamp ||= 0
    self.duration ||= 0
  end

  def played
    self.update_attributes(:plays => self.plays + 1)
    return self
  end
  
  def played_json
    return {:track => {:id => self.id, :plays => self.plays} }
  end

  def calculate_age
    diff = (Time.now - self.created_at)

    if (diff / 1.minutes) < 60
      return (diff / 1.minutes).round.to_s + "m"
    elsif (diff / 1.hours) <= 24
      return (diff / 1.hours).round.to_s + "h"
    else
      return self.created_at.strftime("%b %-d")
    end

  end

end
