require 'spec_helper'

describe Track do

  context "Track methods" do

    before(:each) do
      @user = User.new(:email => "test@testopresto.com")
      @track = @user.tracks.build
    end

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


end
