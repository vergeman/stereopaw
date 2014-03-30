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
        #obj = {:playlist => @playlist, :tracks => tracks}.to_json
        obj = tracks.to_json
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
  describe "#CREATE / #UPDATE" do

    describe "when logged out" do

      before {
        Warden.test_reset!
        logout(:user)
        sign_out(@user)
        controller.stub(:user_signed_in?).and_return(false)        
      }
      
      it "POST #create has a a 401 response" do
        post :create, :format => 'json', 
        :user_id => @user.id, :playlist => @playlist
        expect(response.status).to eq(401)
      end

      it "PATCH #update has a a 401 response" do
        patch :update, :format => 'json', 
        :user_id => @user.id, :id => @playlist.id
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

      describe "POST #create" do

        it "POST #create: has a 200 response" do
          post :create, :format => 'json', 
          :user_id => @user.id, :playlist => @playlist.attributes
          expect(response.status).to eq(200)
        end

        it "POST #create: sucessful request responds with playlist " do
          @playlist.name = @playlist.name + "123" #for scoped uniquness
          post :create, :format => 'json', 
          :user_id => @user.id, :playlist => @playlist.attributes
          expect(response.body).to eq(@user.playlists.last.to_json)
        end


        it "POST #create: invalid playlist responds with json error obj" do
          @playlist.name = nil
          post :create, :format => 'json', 
          :user_id => @user.id, :playlist => @playlist.attributes
          expect(response.body).to have_content("errors")
        end

      end

      #=======================
      describe "PATCH #update" do 
        before do
          @p = FactoryGirl.create(:playlist, :name => "b" * 100, 
                                  :user_id => @user.id)
        end

        it "PATCH #update: has a 200 response" do
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :playlist => @p.attributes

          expect(response.status).to eq(200)
        end


        it "sucessful request responds with playlist " do
          @track3 = FactoryGirl.create(:track)
          @p.track_ids.push(@track3.id) #for scoped uniquness
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :playlist => @p.attributes

          expect(response.body).to eq(@user.playlists.last.to_json)
        end


        it "sucessful request of track param responds with playlist " do
          @track4 = FactoryGirl.create(:track)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :track => @track4.id
          expect(response.body).to eq(@user.playlists.last.to_json)
        end

        it "request with invalid track param responds with error " do
          @track4 = FactoryGirl.create(:track)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :track => -1
          expect(response.body).to eq({:errors => {:track_ids => ["invalid track"]}}.to_json )
        end

        it "request with invalid track param responds with error " do
          @track4 = FactoryGirl.create(:track)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :track => "alpha"
          expect(response.body).to eq({:errors => {:track_ids => ["invalid track"]}}.to_json )
        end


        it "invalid playlist responds with json error obj" do
          @p.name = nil
          @p.user_id = @user

          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id,
          :playlist => @p.attributes

          expect(response.body).to have_content("errors")
        end
        
      end
    end


  end


  pending "PUT #update" do
  end

  pending "DELETE #destroy" do
  end


  


end
