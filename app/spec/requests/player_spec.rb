require 'spec_helper'

describe "Player" do

  before {
    visit meow_path()
  }
  
  describe "with controls:" do

    it "has a player-controls div" do
      page.should have_css("div#player > #player-controls")
    end

    it "has a play button" do
      page.should have_css("div#player > #player-controls > #play-play")
      page.should have_css("#play-play > i.fi-play")
    end

    it "has a next button" do
      page.should have_css("div#player > #player-controls > #play-next")
      page.should have_css("#play-next > i.fi-next")
    end

    it "has a prev button" do
      page.should have_css("div#player > #player-controls > #play-prev")
      page.should have_css("#play-prev > i.fi-previous")
    end
  end

  describe "has track information" do
    
    it "has track-meta div" do
      page.should have_css("div#player > div#player-track-meta")
    end

    it "has a track artist and title" do
      page.should have_css("div#player > div#player-track-meta > div#track-info")
    end
    
    it "has a time slider" do
      page.should have_css("div#player > div.progress > span.meter > div.slider")
    end

    it "has an elapsed time" do
      page.should have_css("div#player-track-meta > div#track-time > span#elapsed")
    end

    it "has an duration time" do
      page.should have_css("div#player-track-meta > div#track-time > span#duration")
    end
  end

  



end
