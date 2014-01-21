require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page", :js => true do
    @track1 = FactoryGirl.create(:track)
    @track2 =  FactoryGirl.create(:track)

    before { 
      visit root_path()
    }

    it "should have display all of the tracks" do
      t = Track.all
      page.should have_css("div.track", :count => t.count)
      Rails.logger.info(t.count)
    end

    describe "should have a youtube player" do

      it "has the youtube 'player' div" do
        page.should have_css("div#player")
      end

    end

    describe "should have a soundcloud " do
      it "api key" do
        page.should have_css("div#soundcloud_key")
      end
    end

  end



end
