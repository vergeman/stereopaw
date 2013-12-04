# == Schema Information
#
# Table name: tracks
#
#  id          :integer          not null, primary key
#  artist      :string(255)
#  title       :string(255)
#  profile_url :string(255)
#  page_url    :string(255)
#  duration    :decimal(, )
#  timestamp   :decimal(, )
#  timeformat  :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

require 'spec_helper'

#Track Model
#test validations, instance methods 
describe Track do

  context "the Track attributes" do

    before(:each) do
      @track = Track.new()
    end
    
    it "has the title attr" do
      @track.attributes.has_key?("title")
    end

    it "has the artist attr" do
      @track.attributes.has_key?("artist")
    end

    it "has the profile_url attr" do
      @track.attributes.has_key?("profile_url")
    end
    it "has the duration attr" do
      @track.attributes.has_key?("duration")
    end

    it "has the timestamp attr" do
      @track.attributes.has_key?("timestamp")
    end

    it "has the timeformat attr" do
      @track.attributes.has_key?("timeformat")
    end

    it "has the page_url attr" do
      @track.attributes.has_key?("page_url")
    end


  end

  describe "Track Validations" do
    before(:each) do 
      @track = FactoryGirl.create(:track)
    end

    context "Factory Test" do
      it "has a valid factory" do
        @track.should be_valid
      end
    end

    #PRESENCE
    context "Presence Validations" do

      it "cannot have a blank page_url" do
        @track.page_url = nil
        @track.should_not be_valid
      end

      it "cannot have a blank profile_url" do
        @track.profile_url = nil
        @track.should_not be_valid
      end

      it "cannot have a blank title" do
        @track.title = nil
        @track.should_not be_valid        
      end

      it "cannot have a blank artist" do
        @track.artist = nil
        @track.should_not be_valid        
      end

    end

    #URL Format
    context "page_url & profile_url URL type Validations" do

      it "page_url must be of url type" do
        @track.page_url = "https://www.google.com/dfdkf"
        @track.should be_valid
      end

      it "page_url must only be of url type" do
        @track.page_url = "asdfasd"
        @track.should_not be_valid
      end

      it "profile_url must be of url type" do
        @track.profile_url = "https://www.google.com/dfdkf?dfd=etes&dfd=dfd"
        @track.should be_valid
      end

      it "profile_url must only be of url type" do
        @track.profile_url = "aalkenfek"
        @track.should_not be_valid
      end
    end

  end




end
