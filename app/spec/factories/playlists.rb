# == Schema Information
#
# Table name: playlists
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  track_ids   :integer          default([]), is an Array
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  top_genres  :string(255)      default([]), is an Array
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :playlist do
    name "MyString"
    description "MyText"
    track_ids { ([FactoryGirl.create(:track), FactoryGirl.create(:track)]).map(&:id) }
    association :user, factory: :user
  end
end
