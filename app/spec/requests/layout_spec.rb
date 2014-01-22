require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page" do

    before {
      visit root_path()
    }

    describe 'Layout' do
      
      it "should have a div#main" do
        page.should have_css("div#main")
      end

      it "should have a div#sidebar in #main" do
        page.should have_css("div#main > div#sidebar")
      end

      it "should have a nav element in #sidebar#main" do
        page.should have_css("div#main > div#sidebar > nav")
      end

      it "should have a div#player in #sidebar#main" do
        #for youtube
        page.should have_css("div#main > div#sidebar > div#player")
      end

      it "should have a div#content in #main" do
        page.should have_css("div#main > div#content")
      end

      it "should have a footer" do
        page.should have_css("footer")
      end
      

    end


    describe "should have a soundcloud key" do

      it "has an api key" do
        page.should have_css("div#soundcloud_key")
      end

    end


  end
end
