require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe "TrackEdit" do

  before {
    Warden.test_reset!
    @track = FactoryGirl.create(:track)
    @user = @track.user
    visit "/meow#edit_track/#{@user.id}/#{@track.id}" 
    #issue with hash urls
  }


  describe "displays", :js => true do

    pending "the following form fields" do

      page.should have_field("input#track_title")
      page.should have_field("input#track_artist")
      page.should have_field("input#track_genres")
      page.should have_field("input#track_timeformat")
      page.should have_field("input#track_comment")
      page.should have_field("input#track_submit")
      page.should have_field("input#track_submit")
      page.should have_css(".cancel")
    end
  end


  describe "when logged out" do

    pending "something" do
      #assert(false)
    end

  end


  describe "when logged in" do
    pending"something" do 
      assert(false)
    end
  end

end
