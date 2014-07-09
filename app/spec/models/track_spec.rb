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
#  shareable   :boolean
#  service     :string(255)
#  artwork_url :string(255)
#  user_id     :integer
#  genres      :string(255)      default([]), is an Array
#  plays       :integer          default(0)
#  submit_id   :integer
#  spam        :boolean          default(TRUE)
#  spamscore   :integer          default(0)
#
# Indexes
#
#  index_tracks_on_genres  (genres)
#

require 'spec_helper'

#Track Model
#test validations, instance methods 
describe Track do

  context "the Track attributes" do

    before(:each) do      
      @user = User.new(:email => "test@test.com")
      @track = @user.tracks.build()
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

    it "has the shareable attr" do
      @track.attributes.has_key?("shareable").should eq true
    end

    it "has the service attr" do
      @track.attributes.has_key?("service").should eq true
    end

    it "has the artwork_url attr" do
      @track.attributes.has_key?("artwork_url").should eq true
    end

    it "has an user_id attr" do
      @track.attributes.has_key?("user_id").should eq true
    end

    it "has a genres attr" do
      #ps: this is an array
      @track.attributes.has_key?("genres").should eq true
    end

    it "has a plays attr" do
      @track.attributes.has_key?("plays").should eq true
    end

    it "has a submit_id attr" do
      @track.attributes.has_key?("submit_id").should eq true
    end
    
    it "has a spam attr" do
      @track.attributes.has_key?("spam").should eq true
    end

    it "has a spamscore attr" do
      @track.attributes.has_key?("spamscore").should eq true
    end

  end

  describe "Track Validations" do

    before(:each) do 
      @track = FactoryGirl.build(:track)
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

      it "cannot have a blank shareable" do
        @track.shareable = nil
        @track.should_not be_valid        
      end

      it "cannot have a blank service" do
        @track.service = nil
        @track.should_not be_valid        
      end

      it "cannot have a blank artwork_url" do
        @track.artwork_url = nil
        @track.should_not be_valid        
      end

      it "a blank submit_id will default to user_id" do
        @track.submit_id = nil
        @track.valid?
        @track.user_id.should eq(@track.submit_id)
      end


    end

    #URL Format
    context "page_url | profile_url | artwork_url URI type Validations" do

      it "page_url must be of uri type" do
        @track.page_url = "//www.google.com/dfdkf"
        @track.should be_valid
      end

      it "page_url must only be of uri type" do
        @track.page_url = "asdfasd"
        @track.should_not be_valid
      end

      it "profile_url must be of uri type" do
        @track.profile_url = "//www.google.com/dfdkf?dfd=etes&dfd=dfd"
        @track.should be_valid
      end

      it "profile_url must only be of uri type" do
        @track.profile_url = "aalkenfek"
        @track.should_not be_valid
      end

      it "artwork_url must be of uri type" do
        @track.artwork_url = "//www.google.com/dfdkf?dfd=etes&dfd=dfd"
        @track.should be_valid
      end

      it "artwork_url must only be of uri type" do
        @track.artwork_url = "aalkenfek"
        @track.should_not be_valid
      end
    end

    context "spam" do
      it "should default to true" do
        @track.spam.should eq true
      end

      it "can only be an integer value" do
        @track.spamscore = "hello"
        @track.should_not be_valid
      end

      it "can only be a positive integer count value" do
        @track.spamscore = 1001
        @track.should be_valid
      end

      it "cannot be a negative value" do
        @track.spamscore = -1
        @track.should_not be_valid
      end

      it "can only be an integer value" do
        @track.spamscore = 1.123
        @track.should_not be_valid
      end

    end

    context "plays" do
      it "can only be an integer count value" do
        @track.plays = "hello"
        @track.should_not be_valid
      end

      it "can only be a positive integer count value" do
        @track.plays = 1001
        @track.should be_valid
      end

      it "cannot be a negative value" do
        @track.plays = -1
        @track.should_not be_valid
      end

      it "can only be an integer value" do
        @track.plays = 1.123
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
        @track.duration = "342000000.34"
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

      it "timeformat values (min/sec/hr) shoult not be >= 60" do
        @track.timeformat = "61:60:52"
        @track.should_not be_valid
      end

      it "timeformat values should contain valid leading characters" do
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
