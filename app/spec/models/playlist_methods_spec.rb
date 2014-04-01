require 'spec_helper'

describe Playlist do

  before(:each) do
    @track = FactoryGirl.create(:track, :genres => ["Indie", "Test"])
    @track2 = FactoryGirl.create(:track, :genres => ["Indie", "Test", "dubstep"])
    @track3 = FactoryGirl.create(:track, :genres => ["Indie", "Test", "Trip Hop", "dubstep"])

    @playlist = FactoryGirl.create(:playlist, :track_ids => [@track.id, @track2.id, @track3.id])

  end

  describe "calc_top_genres" do

    it "saves array of top 3 genres in a playlist" do
      @playlist.calc_top_genres
      expect(@playlist.top_genres).to eq(["Indie", "Test", "Dubstep"])
    end
  end
end
