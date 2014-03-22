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

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :track do
    artist "MyArtist"
    title "MyTitle"
    profile_url "http://www.mixcloud.com/satoshifumi/"
    page_url "http://www.mixcloud.com/satoshifumi/satoshi-fumi-mixtape-in-nov-2013/"
    duration "9.99"
    timestamp "1232123"
    timeformat "0:30"
    comment "I am a test comment"
    shareable "true"
    service "youtube"
    artwork_url "http://www.youtube.com/0.jpg"
    track_id "123456789"
    genres ["rock"]
    plays "1"
    association :user, factory: :user
  end
end
