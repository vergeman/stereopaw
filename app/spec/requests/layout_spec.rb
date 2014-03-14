require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page" do

    before {
      visit meow_path()
    }

    describe 'Layout' do

      it "should have a nav element in body" do
        page.should have_css("body > nav")
      end

      #--main--#
      it "should have a content#wrap" do
        page.should have_css("div#content-wrap")
      end

      it "should have a footer" do
        page.should have_css("footer")
      end
      

      #--player--#
      
      it "should have a div#player" do
        page.should have_css("div#player")
      end

    end

  end
end
