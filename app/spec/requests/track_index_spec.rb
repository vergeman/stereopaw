require 'spec_helper'

describe "TrackIndex" do

  describe "Visits Track#Index page " do
    @track1 = FactoryGirl.create(:track)
    @track2 =  FactoryGirl.create(:track)

    before { 
      visit tracks_path()
    }

    it "should have display all of the tracks" do
      t = Track.all
      page.should have_css("div.track", :count => t.count)
    end

  end

  pending "must be logged in"
  pending "displays user index"

end
