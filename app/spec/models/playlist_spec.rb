# == Schema Information
#
# Table name: playlists
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  track_ids   :integer          default([])
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

require 'spec_helper'

describe Playlist do

  describe "has attribute" do

    before(:each) do
      @playlist = FactoryGirl.build(:playlist)
    end

    it "name" do
      @playlist.attributes.has_key?("name").should eq true
    end

    it "description" do
      @playlist.attributes.has_key?("description").should eq true
    end

    it "user_id" do
      @playlist.attributes.has_key?("user_id").should eq true
    end

    it "track_ids" do
      @playlist.attributes.has_key?("track_ids").should eq true
    end

    it "track_ids as an array" do
      @playlist.track_ids.is_a?(Array).should eq true
    end

  end


  describe "has validations" do

    before(:each) do
      @playlist = FactoryGirl.build(:playlist)
    end

    context "Factory Test" do
      it "has a valid factory" do
        @playlist.should be_valid
      end
    end

    #PRESENCE (no blank)
    describe "of presence:" do
      it "where it must have a name" do
        @playlist.name = ""
        @playlist.should_not be_valid
      end

      it "where it must have a user_id" do
        @playlist.user_id = ""
        @playlist.should_not be_valid
      end

    end

    #MAX LENGTH
    describe "of length:" do
      it "where name is less than 100" do
        @playlist.name = "a"*101
        @playlist.should_not be_valid
      end

      it "where description is less than 1000" do
        @playlist.description = "a"*1001
        @playlist.should_not be_valid
      end

    end

  end

end
