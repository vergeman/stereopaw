require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe PlaylistsController do

  before {
    @track = FactoryGirl.create(:track)
    @track2 = FactoryGirl.create(:track)
    @playlist = FactoryGirl.create(:playlist, 
                                   :track_ids => [@track.id, @track2.id])
    @user = @playlist.user
  }

  describe "non-auth routes" do

    #json routes
    describe "GET #index" do
      before {
        get :index, :format => 'json', 
        :user_id => @user.id
      }

      it "has a a 200 response" do
        expect(response.status).to eq(200)
      end

      it "responds with all playlists of user" do
        expect(response.body).to eq(@user.playlists.to_json)
      end

    end

    #a single playlist w/ all tracks rendered json?
    describe "GET #show" do    
      before {
        get :show, :format => 'json', 
        :user_id => @user.id, :id => @playlist.id
      }

      it "has a 200 response" do
        expect(response.status).to eq(200)
      end

      it "responds with a json obj: playlists and track data" do
        tracks = Track.find(@playlist.track_ids)
        obj = {:playlist => @playlist, :tracks => tracks}.to_json
        expect(response.body).to eq(obj)
      end

    end

    #generated from modal, not necessary
    #pending "GET #new" do
    #end
    #pending "GET #edit" do
    #end

  end

  #modal based, requires auth
  describe "POST #create" do


    describe "when logged out" do

      before {
        Warden.test_reset!
        logout(:user)
        sign_out(@user)
        controller.stub(:user_signed_in?).and_return(false)        

        post :create, :format => 'json', 
        :user_id => @user.id, :playlist => @playlist
      }
      
      it "has a a 401 response" do
        expect(response.status).to eq(401)
      end


    end


    describe "when logged in " do
      before {
        Warden.test_reset!
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
        @playlist = FactoryGirl.build(:playlist)
        @playlist.user = @user
      }

      it "has a 200 response" do
        post :create, :format => 'json', 
        :user_id => @user.id, :playlist => @playlist.attributes

        expect(response.status).to eq(200)
      end

      it "sucessful request responds with playlist " do
        @playlist.name = @playlist.name + "123" #for scoped uniquness
        post :create, :format => 'json', 
        :user_id => @user.id, :playlist => @playlist.attributes
        expect(response.body).to eq(@user.playlists.last.to_json)
      end


      it "invalid playlist responds with json error obj" do
        @playlist.name = nil
        post :create, :format => 'json', 
        :user_id => @user.id, :playlist => @playlist.attributes
        expect(response.body).to have_content("errors")
      end
      
    end




  end

  pending "PATCH #update" do
  end

  pending "PUT #update" do
  end

  pending "DELETE #destroy" do
  end


  


end
