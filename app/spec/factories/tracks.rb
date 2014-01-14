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
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :track do
    artist "MyString"
    title "MyString"
    profile_url "http://www.mixcloud.com/satoshifumi/"
    duration "9.99"
    timestamp "1232123"
    timeformat "0:30"
    page_url "http://www.mixcloud.com/satoshifumi/satoshi-fumi-mixtape-in-nov-2013/"
    comment "I am a test comment"
    shareable "true"
  end
end
