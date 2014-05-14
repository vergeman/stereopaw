require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe SearchController do

  before do
      @exceptions = [:submit_id, :user_id, :updated_at, :shareable, :pg_search_rank]
  end

  describe "GET #show" do

    before do
      Warden.test_reset!
      logout(:user)
      @track = FactoryGirl.create(:track, spam: false)
    end


    it "has a 200 response" do
      get :show, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(200)
    end


    it "responds with a json obj: collection of track data that matches the query 'youtube'" do
      get :show, :format => 'json', :q => "youtube", :page => 0
      expect(response.body).to eq([@track].to_json(:except => @exceptions))
    end

    it "responds with a json obj: collection of track data that matches the query 'youtube' even without page as parameter" do
      get :show, :format => 'json', :q => "youtube"
      expect(response.body).to eq([@track].to_json(:except => @exceptions))
    end

    it "responds with an empty result set with empty query" do
      get :show, :format => 'json', :q => ""
      expect(response.body).to eq([].to_json(:except => @exceptions))
    end

  end


  describe "GET #genre" do

    before do
      Warden.test_reset!
      logout(:user)
      @track = FactoryGirl.create(:track, spam: false)
    end

    it "has a 200 response" do
      get :genres, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(200)
    end


    it "responds with a json obj: collection of tracks that match genre rock" do
      get :genres, :format => 'json', :q => "rock", :page => 0
      @tracks = Track.search_by_genre("rock")
      expect(response.body).to eq(@tracks.to_json(except: @exceptions))
    end


  end


  describe "GET search - [mytracks, playlists] : logged out" do

    before do
      Warden.test_reset!
      logout(:user)
    end

    it "mytracks has a 401 unauthorized response" do
      get :mytracks, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(401)
    end

    it "playlists has a 401 unauthorized response" do
      get :playlists, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(401)
    end

  end


  describe "GET search - [mytracks, playlists] : logged in" do

    before do
      Warden.test_reset!
      @track2 = FactoryGirl.create(:track, spam: false)
      @track3 = FactoryGirl.create(:track, spam: false)
      @user = @track2.user
      login_as(@user, :scope => :user)
      controller.stub(:authenticate_user!).and_return(true)
      controller.stub(:current_user).and_return(@user)
    end

    describe "mytracks" do

      it "has a 200 response" do
        get :mytracks, :format => 'json', :q => "Query", :page => 0
        expect(response.status).to eq(200)
      end

      it "responds with a json obj: collection of track data *of the user* that matches the query 'youtube'" do
        get :mytracks, :format => 'json', :q => "youtube", :page => 0
        expect(response.body).to eq([@track2].to_json(except: @exceptions) )
      end

    end

    describe "playlists" do

      before do
        @playlist = FactoryGirl.create(:playlist, :user => @user,
                                       :description => "youtube playlist")
        @track4 = Track.find(@playlist.track_ids)[0]
        @track5 = Track.find(@playlist.track_ids)[1]
      end

      it "has a 200 response" do
        get :playlists, :format => 'json', :q => "Query", :page => 0
        expect(response.status).to eq(200)
      end


      it "responds with a json obj: collection of playlist and track data *of the user* that matches the query 'youtube'" do
        get :playlists, :format => 'json', :q => "youtube", :page => 0
        #manually cleaning out pg_search - ugly but whatever
        my_response = JSON.parse(response.body)
        track_previews = my_response.first['track_previews']
        track_previews = track_previews.collect{|t| t.except('pg_search_rank')}
        my_response.first['track_previews'] = track_previews

        my_expect = [@playlist.with_track_preview].to_json(methods: [:track_previews])

        expect(my_response.to_json).to eq(my_expect)
      end


    end
      

    
  end
  
end

