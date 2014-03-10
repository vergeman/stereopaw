require 'spec_helper'


describe "Root Page" do

  describe "Visits '/' page" do

    before { visit root_path() }

    describe "Content Section", :js => true do

      it "should have display of all the popular tracks" do        
        t = Track.all.order("created_at ASC").limit(20)
        page.should have_css("div.track", :count => t.count)
      end

    end


  end

end
