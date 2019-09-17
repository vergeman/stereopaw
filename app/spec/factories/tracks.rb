# == Schema Information
#
# Table name: tracks
#
#  id          :integer          not null, primary key
#  artist      :string
#  title       :string
#  profile_url :string
#  page_url    :string
#  duration    :decimal(, )
#  timestamp   :decimal(, )
#  timeformat  :string
#  created_at  :datetime
#  updated_at  :datetime
#  comment     :text
#  track_id    :string
#  shareable   :boolean
#  service     :string
#  artwork_url :string
#  user_id     :integer
#  genres      :string           default([]), is an Array
#  plays       :integer          default(0)
#  submit_id   :integer
#  spam        :boolean          default(TRUE)
#  spamscore   :integer          default(0)
#  copy        :boolean          default(FALSE)
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
    profile_url "//www.mixcloud.com/satoshifumi/"
    page_url "//www.mixcloud.com/satoshifumi/satoshi-fumi-mixtape-in-nov-2013/"
    duration "1000000"
    timestamp "12323"
    timeformat "0:30"
    comment "I am a test comment"
    shareable "true"
    service "youtube"
    artwork_url "//www.youtube.com/0.jpg"
    track_id "123456789"
    genres ["rock"]
    plays "1"
    spam true
    spamscore "0"
    copy false
    association :user, factory: :user
    submit_id { "#{user_id}" }   
  end
end
