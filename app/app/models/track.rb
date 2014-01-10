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
#

class Track < ActiveRecord::Base
  attr_accessor :timeformat_optional

  validates :artist, :title, :page_url, :profile_url, presence: true
  validates :profile_url, :page_url, url: true #/validators/UrlValidator
  validates :duration, :timestamp, numericality: true
  validates_format_of :timeformat, :with => /\A([^0:\D][0-9]*:)?([1-5]?[0-9]:)([0-5][0-9])\Z/
  validates :comment, length: { maximum: 1000 }
  after_initialize :default_values

  def default_values
    self.timestamp ||= 0
    self.duration ||= 0
  end
end
