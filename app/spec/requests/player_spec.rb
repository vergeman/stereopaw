require 'spec_helper'

describe "Player" do

  before {
    visit root_path()
  }
  
  describe "with controls:" do

    it "has a controls div" do
      page.should have_css("div#player > #controls")
    end

    it "has a play button" do
      page.should have_css("div#player > #controls > #play-play")
      page.should have_css("#play-play > i.fi-play")
    end

    it "has a next button" do
      page.should have_css("div#player #controls > #play-next")
      page.should have_css("#play-next > i.fi-next")
    end

    it "has a prev button" do
      page.should have_css("div#player #controls > #play-prev")
      page.should have_css("#play-prev > i.fi-previous")
    end
  end

  describe "has track information" do
    
    it "has track-meta div" do
      page.should have_css("div#player > div#track-meta")
    end

    it "has a track artist and title" do
      page.should have_css("div#player > div#track-meta > div#track-info")
    end
    
    it "has a time slider" do
      page.should have_css("div#track-position > div#track-timeslider")
    end

    it "has a start time" do
      page.should have_css("div#track-position > div#track-starttime")
    end

    it "has an end time" do
      page.should have_css("div#track-position > div#track-endtime")
    end
  end

  



end
