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

    describe "reported" do
      it "increments spamscore attribute" do
        spamscore = @track.spamscore
        @track.reported
        @track.spamscore.should eq (spamscore + 1)
      end

      it "toggled spam to true if spamscore exceeds 3" do
        [0..3].each do 
          @track.reported
        end
        @track.spam.should eq true
      end

    end


  end


end
