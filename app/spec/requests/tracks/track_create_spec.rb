require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe "TrackCreate" do

  before { 
    Warden.test_reset!
    @user = FactoryGirl.create(:user)
    login_as(@user, :scope => :user)
    visit tracks_new_path(:track => 
                          {
                            :artist => "Artist",
                            :title => "Title",
                            :profile_url => "http://www.google.com",
                            :timeformat => "1:23",
                            :shareable => "true",
                            :service => "youtube",
                            :genres => "alternative",
                            :artwork_url => "http://www.youtube.com/vi/images/0.jpg"
                          }
                          )
  }

  let (:submit) { "input#track_submit" }
  
  describe  "with invalid info" do
    it "should not create a track" do
      expect { find(submit).click }.not_to change(Track, :count)
    end

    it "should re-render new" do
      page.should have_selector("input#track_submit")
    end
  end


  describe "valid info test" do
    before do

      fill_in "track_comment", with: "I am a Test comment"

      #now track is valid
      find(:xpath, "//input[@id='track_page_url']").set "http://www.google.com"

    end


    it "should create a Track" do
      expect { find(submit).click }.to change(Track, :count).by(1)
    end

    it "should redirect to the track/submit/:id" do
      find( submit ).click
      t = Track.all.sort_by(&:created_at).last
      current_path.should eq tracks_submit_path(t)
    end

    it "should have the fields that were submitted" do
      find(submit).click
      page.should have_content("Artist")
      page.should have_content("Title")
      page.should have_content("1:23")
      page.should have_content("\"alternative\"")
      page.should have_content("I am a Test comment")
    end    

  end




end

