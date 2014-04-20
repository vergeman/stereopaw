require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe SearchController do

  before {
    Warden.test_reset!
    logout(:user)
    @track = FactoryGirl.create(:track)
    PgSearch::Multisearch.rebuild(Track)
  }


  describe "GET #show" do

    it "has a 200 response" do
      get :show, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(200)
    end


    it "responds with a json obj: collection of track data that matches the query 'youtube'" do
      get :show, :format => 'json', :q => "youtube", :page => 0
      expect(response.body).to eq([@track].to_json)
    end


  end

  describe "GET #mytracks logged out" do

    before do
      Warden.test_reset!
      logout(:user)
    end

    it "has a 401 unauthorized response" do
      get :mytracks, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(401)
    end

  end

  describe "GET #mytracks" do

    before do
      Warden.test_reset!
      @track2 = FactoryGirl.create(:track)
      @track3 = FactoryGirl.create(:track)
      @user = @track2.user
      login_as(@user, :scope => :user)
      controller.stub(:authenticate_user!).and_return(true)
      controller.stub(:current_user).and_return(@user)
      PgSearch::Multisearch.rebuild(Track)
    end

    it "has a 200 response" do
      get :mytracks, :format => 'json', :q => "Query", :page => 0
      expect(response.status).to eq(200)
    end


    it "responds with a json obj: collection of track data *of the user* that matches the query 'youtube'" do
      get :mytracks, :format => 'json', :q => "youtube", :page => 0
      expect(response.body).to eq([@track2].to_json)
    end


  end
end
