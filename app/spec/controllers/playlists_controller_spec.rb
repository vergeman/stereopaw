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

      it "responds with all playlists of user + with a track preview listing of the most played " do
        @user.playlists = @user.playlists.map(&:with_track_preview)
        expect(response.body).to eq(@user.playlists.to_json(:methods => [:track_previews], except: [:user_id]))
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
        obj = tracks.to_json(except: [:submit_id, :updated_at, :shareable])
        expect(response.body).to eq(obj)
      end

    end


    describe "GET #show w/ playlist errors" do

      #non-existent playlist
      it "responds with an 'invalid playlist' error if requesting a playlist that does not exist" do
        get :show, :format => 'json', 
        :user_id => @user.id, :id => @playlist.id + 100000
        expect(response.body).to eq({:errors => "invalid playlist"}.to_json)
      end

    end

  end

  #modal based, requires auth
  describe "#CREATE / #UPDATE / #PATCH / #DELETE" do

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

      it "DELETE #destroy has a a 401 response" do
        delete :destroy, :format => 'json', 
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
          playlist = @user.playlists.last.with_track_preview
          expect(response.body).to eq(playlist.to_json(except: [:user_id], methods: [:track_previews]) )
        end


        it "POST #create: invalid playlist responds with json error obj" do
          @playlist.name = nil
          post :create, :format => 'json', 
          :user_id => @user.id, :playlist => @playlist.attributes
          expect(response.body).to have_content("errors")
        end

      end

      #DESTROY=====
      describe "DELETE #destroy" do
        before do
          @playlist = FactoryGirl.create(:playlist, 
                                         :name => "b" * 100,
                                         :user_id => @user.id)
        end

        it "has a 200 response" do
          delete :destroy, :format => 'json', 
          :user_id => @user.id, :id => @playlist.id
          expect(response.status).to eq(200)
        end

        it "successfully deletes a playlist" do
          count = Playlist.all.count
          delete :destroy, :format => 'json', 
          :user_id => @user.id, :id => @playlist.id
          expect(Playlist.all.count).to eq(count-1)
          expect(Playlist.find_by_id(@playlist.id)).to be_nil
        end

        it "responds with a 'success' message" do
          delete :destroy, :format => 'json', 
          :user_id => @user.id, :id => @playlist.id
          expect(response.body).to eq({:success => "playlist destroyed"}.to_json)
        end

        it "if delete non-existent track, responds with error" do
          delete :destroy, :format => 'json', 
          :user_id => @user.id, :id => (@playlist.id + 100)
          expect(response.body).to eq({:errors => "invalid playlist"}.to_json)
        end

        it "if destroy results in an error" do
          Playlist.any_instance.stub(:destroy).and_return(false)
          delete :destroy, :format => 'json', 
          :user_id => @user.id, :id => (@playlist.id)
          expect(response.body).to eq({:errors => "error destroying playlist"}.to_json)
        end
        

      end

      #PATCH=======================
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


        it "sucessful request responds with playlist when adding track " do
          @track3 = FactoryGirl.create(:track)
          @p.track_ids.push(@track3.id) #for scoped uniquness
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :playlist => @p.attributes

          expect(response.body).to eq(@user.playlists.last.with_track_preview.to_json(:methods => [:track_previews], except: [:user_id]))
        end

        it "sucessful request responds with playlist when changing name and description of playlist," \
        "which occurs when sending only those params over (playlist[name], playlist[description] " do
          @p.name = "CHANGED NAME"
          @p.description = "CHANGED DESCRIPTION"
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, 
          :playlist => {:name => @p.name, :description => @p.description}
          expect(response.body).to eq(@user.playlists.last.with_track_preview.to_json(:methods => [:track_previews], except: [:user_id]))
        end


        it "sucessful request of track param responds with playlist " do
          @track4 = FactoryGirl.create(:track)
          @p.track_ids = @p.track_ids.push(@track4.id)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, :playlist => {:track_ids => @p.track_ids}
          expect(response.body).to eq(@user.playlists.last.with_track_preview.to_json(:methods => [:track_previews], except: [:user_id]))
        end


        it "playlist adding non-existent track is invalid " do
          @track4 = FactoryGirl.create(:track)
          @p.track_ids = @p.track_ids.push(@track4.id + 1000000)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, :playlist => {:track_ids => @p.track_ids}
          expect(response.body).to have_content("errors")
        end

        it "request with invalid track param responds with error " do
          @track4 = FactoryGirl.create(:track)
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, :playlist => {:track_ids => [-1]}
          expect(response.body).to have_content("errors")
        end

        it "request with invalid track param responds with error " do
          @track4 = FactoryGirl.create(:track)
          @p.track_ids = @p.track_ids.push("alpha")
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id, :playlist => {:track_ids => @p.track_ids}
          expect(response.body).to have_content("errors")
        end


        it "invalid playlist responds with json error obj" do
          @p.name = nil
          @p.user_id = @user

          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id,
          :playlist => @p.attributes
          expect(response.body).to have_content("errors")
        end

        it "responds with error message if attempt to update invalid playlist" do
          @p.user_id = @user
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id+100,
          :playlist => @p.attributes

          expect(response.body).to eq({:errors => "invalid playlist"}.to_json)
        end

                
        it "removal of all track_ids results in an empty playlist" do
          @p.track_ids = nil
          patch :update, :format => 'json', 
          :user_id => @user.id, :id => @p.id,
          :playlist => @p.attributes

          expect(response.body).to eq(Playlist.find(@p).with_track_preview.to_json(:methods => [:track_previews]) )
        end

      end
    end


  end



  


end
