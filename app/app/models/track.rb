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
#

class Track < ActiveRecord::Base
  validates :artist, :title, :page_url, :profile_url, presence: true
  validates :profile_url, :page_url, url: true #/validators/UrlValidator


end
