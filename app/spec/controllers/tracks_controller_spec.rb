require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe TracksController do

#          user_tracks GET    /users/:user_id/tracks(.:format)          tracks#index
#                         POST   /users/:user_id/tracks(.:format)          tracks#create
#         edit_user_track GET    /users/:user_id/tracks/:id/edit(.:format) tracks#edit
#              user_track GET    /users/:user_id/tracks/:id(.:format)      tracks#show
#                         PATCH  /users/:user_id/tracks/:id(.:format)      tracks#update
#                         PUT    /users/:user_id/tracks/:id(.:format)      tracks#update
#                         DELETE /users/:user_id/tracks/:id(.:format)      tracks#destroy
#                    user GET    /users/:id(.:format)                      users#show
#              tracks_new GET    /tracks/new(.:format)                     tracks#new
#                     new GET    /new(.:format)                            tracks#latest
#                 popular GET    /popular(.:format)                        tracks#popular
#                  tracks GET    /tracks(.:format)                         tracks#mytracks


  describe "GET #new" do

    describe "when logged out" do
      before { 
        @request.env["devise.mapping"] = Devise.mappings[:user]
        @user = FactoryGirl.create(:user)
        sign_out(@user)
      }

      it "responds with a 302 redirect to login" do        
        get :new, :format => :html
        response.should redirect_to '/users/sign_in'
      end
    end      


    describe "when logged in" do

      before {
        Warden.test_reset!
        @user = FactoryGirl.create(:user)
        login_as(@user, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
      }

      #post login
      it "responds successfully with an HTTP 200 status code" do
        login_as(@user, :scope => :user)
        get :new, :track => {:testparam => "Hello"}
        expect(response.status).to eq(200)
      end

      it "renders the new template" do
        get :new, :track => {:testparam => "Hello"}
        expect(response).to render_template("new")
      end

      it "redirects if there are no parameters" do
        get :new
        expect(response.status).to eq(302)
      end

    end


  end


  describe "GET #index" do

    #API
    describe "GET user_tracks as json" do


      before do
        @user = FactoryGirl.create(:user)
        login_as(@user, :scope => :user)
        get :index, :user_id => @user.id, :user => @user, :format => :json
        @parse_json = JSON.parse(response.body)
      end

      it "responds with a json object" do
        response.header['Content-Type'].should include 'application/json'
      end

      it "responds with an array" do
        expect(@parse_json.class).to eq(Array)
      end

      it "reponds with an array of all Tracks, sorted by created_at DESCENDING" do
        #note escaped
        tracks = @user.tracks
        expect(@parse_json.to_json).to eq( tracks.order("created_at DESC").to_json )
      end

    end

  end


  describe "GET #show" do

    before do
      @track = FactoryGirl.create(:track)
      @user = @track.user
    end

    it "responds successfully with an HTTP 302 redirect code" do
      get :show, :user_id => @user.id, :id => @track.id
      expect(response.status).to eq(200)
    end

    it "renders the appropriate track page" do 
      get :show, :user_id => @user.id, :id => @track.id
      response.should render_template(:show)
    end

  end



end
