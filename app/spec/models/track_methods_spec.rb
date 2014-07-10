require 'spec_helper'

describe Track do

  context "Track methods" do

    before(:each) do
      @user = User.new(:email => "test@testopresto.com")
      @track = @user.tracks.build
    end

    describe "calculate_age method" do
      it "can calculate_age in minutes" do
        @track.created_at = Time.now - 10.minutes
        @track.calculate_age.should eq "10m"
      end

      it "can calculate_age in hours" do
        @track.created_at = Time.now - 61.minutes
        @track.calculate_age.should eq "1h"
      end

      it "can calculate_age display months" do
        time = Time.new(2014, 1, 31) - 1.months
        @track.created_at = time
        @track.calculate_age.should eq (time).strftime("%b %-d")
      end
    end

    describe "played" do
      it "increments plays attribute" do
        count = @track.plays
        @track.played
        (count + 1).should eq @track.plays
      end
    end

  end

  describe "reported" do

    before(:each) do
      @user = FactoryGirl.create(:user)
      #reminder: we treat all submissions as spam by default 
      #until checked by akismet, so set to false as if it passed
      @track = FactoryGirl.create(:track, 
                                  :spam => false, :user => @user)
    end


    it "increments spamscore attribute" do
      spamscore = @track.spamscore
      @track.reported(@user)
      @track.spamscore.should eq (spamscore + 1)
    end


    it "toggles spam to true if spamscore exceeds 3" do        
      (0..2).each do 
        @track.reported(@user)
      end
      @track.spam.should eq true
    end

    it "adds the track to the user's reported list" do
      @track.reported(@user)
      @user.reported_list.include?(@track.id).should eq true
    end

  end



  describe "popular and new lists" do

    before(:each) do
      @user = FactoryGirl.create(:user, :reported_list => [])
      @tracks = Array.new

      (0..9).each do
        @tracks.push( FactoryGirl.create(:track,
                                         :spam => false,
                                         :user => @user))
      end
      @tracks = @tracks.reverse
    end

    describe "get_popular method" do

      it "when logged in reported results are excluded" do
        @user.update_attributes(:reported_list =>
                                @user.reported_list.push(@tracks[0].id))
        tracks = Track.get_popular(0, @user)
        @tracks.shift
        expect(tracks).to eq @tracks
      end

      it "when logged out there is no exclusion done" do
        tracks = Track.get_popular(0, nil)
        expect(tracks).to eq @tracks
      end

    end

    describe "get_latest" do

      it "when logged in reported results are excluded" do
        @user.update_attributes(:reported_list =>
                                @user.reported_list.push(@tracks[0].id))
        tracks = Track.get_latest(0, @user)
        @tracks.shift
        expect(tracks).to eq @tracks
      end

      it "when logged out there is no exclusion done" do
        tracks = Track.get_latest(0, nil)
        expect(tracks).to eq @tracks
      end

    end

  end
end
