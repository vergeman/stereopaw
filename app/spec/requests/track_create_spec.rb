require 'spec_helper'

describe "TrackCreate" do

  before { visit new_track_path }
  let (:submit) { "Create Track" }
  
  describe  "with invalid info" do
    it "should not create a track" do
      expect { click_button submit }.not_to change(Track, :count)
    end

    it "should re-render new" do
      page.should have_selector("input#track_submit")
    end
  end


  describe "valid info test" do

    before do
      fill_in "Artist",         with: "DJ User"
      fill_in "Title",        with: "iamamtitle"
      fill_in "track_profile_url",     with: "http://www.google.com"
      fill_in "track_page_url", with: "http://www.google.com"
      fill_in "track_timeformat", with: "9:42"      
      fill_in "track_comment", with: "I am a Test comment"
      check "track_timeformat_optional"
    end


    it "should create a Track" do
      expect { click_button submit }.to change(Track, :count).by(1)
    end

    it "should redirect to the Track/:id" do
      click_button submit
      t = Track.all.sort_by(&:created_at).last
      current_path.should eq track_path(t)
    end

    it "should have the fields that were submitted" do
      click_button submit
      page.should have_content("DJ User")
      page.should have_content("iamamtitle")
      page.should have_content("http://www.google.com")
      page.should have_content("http://www.google.com")
      page.should have_content("9:42")
      page.should have_content("I am a Test comment")

    end    

  end




end

