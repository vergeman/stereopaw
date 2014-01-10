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
#  comment     :text
#  track_id    :string(255)
#

require 'spec_helper'

#Track Model
#test validations, instance methods 
describe Track do

  context "the Track attributes" do

    before(:each) do
      @track = Track.new()
    end

    it "has the track_id attr" do
      @track.attributes.has_key?("track_id").should eq true
    end

    it "has the title attr" do
      @track.attributes.has_key?("title").should eq true
    end

    it "has the artist attr" do
      @track.attributes.has_key?("artist").should eq true
    end

    it "has the profile_url attr" do
      @track.attributes.has_key?("profile_url").should eq true
    end
    it "has the duration attr" do
      @track.attributes.has_key?("duration").should eq true
    end

    it "has the timestamp attr" do
      @track.attributes.has_key?("timestamp").should eq true
    end

    it "has the timeformat attr" do
      @track.attributes.has_key?("timeformat").should eq true
    end

    it "has the page_url attr" do
      @track.attributes.has_key?("page_url").should eq true
    end

    it "has the comment attr" do
      @track.attributes.has_key?("comment").should eq true
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


    #COMMENT
    context "Comment Validation" do
      it "cannot be longer than 1000 characters" do
        @track.comment = "a" * 1001
        @track.should_not be_valid
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

    #  duration    :decimal(, )
    #  timestamp   :decimal(, )

    context "duration / timestamp format" do
      it "has a valid numerical duration value [3434 or 343.343]" do
        @track.duration = "sdkfj"
        @track.should_not be_valid
      end

      it "duration only accepts numeric values" do
        @track.duration = "342.34"
        @track.should be_valid
      end

      it "has a valid timestamp value [12312312 or 123123.01]" do
        @track.timestamp = "nzln"
        @track.should_not be_valid
      end

      it "timestamp only accepts numeric values" do
        @track.timestamp = "123"
        @track.should be_valid
      end

    end

    #  timeformat  :string(255)
    #valid ex [0:23, 1:23, 59:59, 100:12:32]
    context "timeformat validations" do
      it "21242 integer is not a valid format" do
        @track.timeformat = "212412"
        @track.should_not be_valid
      end

      it "has a valid timeformat [0:42]" do
        @track.timeformat = "0:42"
        @track.should be_valid
      end

      it "[:42] does not have a leading colon" do
        @track.timeformat = ":23"
        @track.should_not be_valid
      end

      it "has a valid timeformat [3:23], [1:23:12]" do
        @track.timeformat = "3:42"
        @track.should be_valid
      end

      it "has a valid timeformat [1:23:12]" do
        @track.timeformat = "1:23:45"
        @track.should be_valid
      end

      it "has a valid timeformat [71:23:45]" do
        @track.timeformat = "71:23:45"
        @track.should be_valid
      end

      it "has a valid timeformat [1:23:12]" do
        @track.timeformat = "71:23:45"
        @track.should be_valid
      end

      it "timeformat values (min/sec/hr) shoult not be >= 60" do
        @track.timeformat = "61:60:52"
        @track.should_not be_valid
      end

      it "timeformat values shoult contain valid leading characters" do
        @track.timeformat = ":23:23"
        @track.should_not be_valid
      end

      it "timeformat values shoult contain valid characters" do
        @track.timeformat = "2z4:23:23"
        @track.should_not be_valid
      end

    end


  end




end
