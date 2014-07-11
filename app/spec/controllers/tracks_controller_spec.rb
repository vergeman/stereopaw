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


  describe "GET latest" do
    before do 
      @track1 = FactoryGirl.create(:track, spam: false)
      @track2 = FactoryGirl.create(:track, spam: false)
    end
    it "responds successfully with an HTTP 200 status code" do
      get :latest, :format => :json
      expect(response.status).to eq(200)
    end

    it "responds with tracks sorted DESC by created_at" do
      get :latest, :format => :json, :page => 0
      expect(response.body).to eq(Track.all.order("created_at DESC").limit(10).to_json(:except => [:submit_id, :updated_at, :shareable, :spamscore]) )
    end
    
    
  end



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

  describe "GET #show" do

    before do
      @track = FactoryGirl.create(:track, spam: false)
      @user = @track.user
    end

    it "responds successfully with an HTTP 200 code" do
      get :show, :user_id => @user.id, :id => @track.id
      expect(response.status).to eq(200)
    end

    it "renders the appropriate track page" do 
      get :show, :user_id => @user.id, :id => @track.id
      response.should render_template(:show)
    end

    it "json request renders a json response of a track object" do
      get :show, :format => 'json', :user_id => @user.id, :id => @track.id
      expect(response.body).to eq(@track.to_json(:except => [:submit_id, :updated_at, :shareable, :spamscore]))
    end

  end


#
#POST COPY
#

describe "POST #copy" do

    describe "when not logged in" do

      before do
        Warden.test_reset!
        @user = FactoryGirl.create(:user)
        @track = FactoryGirl.create(:track, spam: false)
        controller.stub(:authenticate_user!).and_return(false)
        sign_out @user
      end

      it "responds with a 200 request" do
        post :add, :id => @track.id
        expect(response.status).to eq(200)
      end

      it "but responds with a unauthorized message " do
        post :add, :id => @track.id
        expect(response.body).to eq({:reported => "please login"}.to_json)
      end

    end

    describe "when logged in" do

      before do
        Warden.test_reset!
        @user = FactoryGirl.create(:user)
        @user2 = FactoryGirl.create(:user)
        @track = FactoryGirl.create(:track, user: @user, spam: false)
        login_as(@user2, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user2)
      end

      it "responds with a 200" do
        post :add, :id => @track.id
        expect(response.status).to eq (200)
      end

      it "responds with the copied track, reset" do
        post :add, :id => @track.id
        @track.copy = true
        @track.user = @user2
        @track.plays = 0
        @track.id = @user2.tracks.last.id
        @track.created_at = (JSON.parse response.body)["created_at"]
        expect(response.body).to eq(@track.to_json)
      end

      it "a non-existent track reponds with an error message" do
        post :add, :id => @track.id + 901902
        expect(response.body).to eq({:errors => "invalid track"}.to_json)
      end

      it "the track does not appear in the new listing" do
        post :add, :id => @track.id
        @track.id = @user2.tracks.last.id
        get :latest, :page => '0', :format => :json
        expect(response.body).not_to have_content(@track.id)
      end

      it "the track does not appear in the popular listing" do
        post :add, :id => @track.id
        @track.id = @user2.tracks.last.id
        get :popular, :page => '0', :format => :json
        expect(response.body).not_to have_content(@track.id)
      end

    end

  end

#
#POST REPORT
#

  describe "POST #report" do

    describe "when not logged in" do

      before do
        Warden.test_reset!
        controller.stub(:authenticate_user!).and_return(false)
        sign_out :user
        @track = FactoryGirl.create(:track, spam: false)
      end

      it "responds with a 200 request" do
        post :report, :id => @track.id
        expect(response.status).to eq(200)
      end

      it "but responds with a unauthorized message " do
        post :report, :id => @track.id
        expect(response.body).to eq({:reported => "please login"}.to_json)
      end

    end

    describe "when logged in: " do

      before do
        Warden.test_reset!
        @user = FactoryGirl.create(:user)
        @track = FactoryGirl.create(:track, user: @user, spam: false)
        login_as(@user, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
      end

      it "responds with a 200" do
        post :report, :id => @track.id
        expect(response.status).to eq (200)
      end

      it "responds with a reported success message" do
        post :report, :id => @track.id
        expect(response.body).to eq({:success => "track reported"}.to_json)
      end

      it "increments the track's spam score " do
        post :report, :id => @track.id
        (@track.spamscore + 1).should eq Track.find(@track).spamscore        
      end     

      it "adds the track id to the users reported_list " do
        post :report, :id => @track.id
        @user.reported_list.include?(@track.id).should eq true
      end
    end

  end


#
#POST /PLAY
#
  describe "POST #play" do

    before do
      @track = FactoryGirl.create(:track, spam: false)
    end

    it "responds successfully with 200 request" do
      post :play, :track => {:id => @track.id }
      expect(response.status).to eq(200)
    end

    describe "handles track plays and" do

      it "responds with 'invalid track' in case of invalid track" do
        post :play, :track => {:id => "adlkfajd" }
        @parsed_json = JSON.parse(response.body)
        expect(@parsed_json.to_json).to eq ({:errors => "invalid track"}.to_json)
      end


      it "valid track should increment track models plays count" do
        post :play, :track => {:id => @track.id}
        (@track.plays + 1).should eq Track.find(@track).plays
      end

      it "valid track response should be an incremented plays count" do
        post :play, :track => {:id => @track.id}
        JSON.parse(response.body)['track']['plays'].should eq (@track.plays + 1)
      end      

    end

  end


  describe "PATCH #edit" do
    #THESE ARE JUST JSON / CONTROLLER
    describe "when not logged in" do

      before do
        Warden.test_reset!
        logout(:user)
        controller.stub(:authenticate_user!).and_return(false)
        controller.stub(:user_signed_in?).and_return(false)
        @track = FactoryGirl.create(:track, spam: false)
      end

      it "responds with a 200" do
        patch :update, :user_id => "100", :id => "10"
        expect(response.status).to eq(200)
      end

      it "but has a json header indicating ajax redirect" do
        patch :update, :user_id => "100", :id => @track.id
        expect(response.headers).to have_content "AJAX-STATUS"
        expect(response.headers).to have_content "302"
      end
      
      it "but has a json response with redirect to login" do
        patch :update, :user_id => "100", :id => @track.id
        expect(response.body).to have_content "location"
        expect(response.body).to have_content "/login"
      end
      
    end


    describe "when logged in" do

      before do
        Warden.test_reset!
        @track = FactoryGirl.create(:track, spam: false)
        @user = @track.user
        login_as(@user, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
      end


      it "responds successfully with html response 200 " do
        patch :update, :user_id => @user.id, :id => @track.id, :track => @track.attributes
        expect(response.status).to eq(200)
      end

      it "patch updates should have updated attributes" do
        @track.title = "changed title"
        patch :update, :user_id => @user.id, :id => @track.id, :track => @track.attributes

        Track.find(@track.id).title.should eq("changed title")
      end

      it "patch updates should return error if not owned user" do
        patch :update, :user_id => @user.id, :id => 1, :track => @track.attributes
        expect(response.body).to eq({errors: "invalid track"}.to_json)
      end

      it "responds with a json response of 'success' & track_id" do
        patch :update, :user_id => @user.id, :id => @track.id, :track => @track.attributes
        expect(response.body).to eq({success: @track.id}.to_json)
      end

      it "a failed update returns error message" do
        @track[:title] = nil
        @track.save
        patch :update, :user_id => @user.id, :id => @track.id, :track => @track.attributes
        expect(response.body).to eq({:errors => @track.errors.messages}.to_json)
      end

    end

  end


  describe "DELETE #edit" do

    describe "when logged OUT" do

      before do
        Warden.test_reset!
        logout(:user)
        controller.stub(:authenticate_user!).and_return(false)
        controller.stub(:user_signed_in?).and_return(false)
        @track = FactoryGirl.create(:track, spam: false)
      end

      it "responds with a 200" do
        delete :destroy, :user_id => "100", :id => "10"
        expect(response.status).to eq(200)
      end

      it "but has a json header indicating ajax redirect" do
        delete :destroy, :user_id => "100", :id => @track.id
        expect(response.headers).to have_content "AJAX-STATUS"
        expect(response.headers).to have_content "302"
      end
      
      it "but has a json response with redirect to login" do
        delete :destroy, :user_id => "100", :id => @track.id
        expect(response.body).to have_content "location"
        expect(response.body).to have_content "/login"
      end
    end



    describe "when logged in " do

      before do
        Warden.test_reset!
        @track = FactoryGirl.create(:track, spam: false)
        @user = @track.user
        login_as(@user, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
      end
      it "responds with a 200" do
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        expect(response.status).to eq (200)
      end

      it "a destroy should render success response" do
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        expect(response.body).to eq({:success => @track.id}.to_json)
      end

      it "a 'destroy' does not actually remove from the database" do
        count = Track.all.count
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        Track.all.count.should eq(count)
        Track.find_by_id(@track.id).should_not eq(nil)
      end


      it "a 'destroy' does disassociate the user" do
        count = Track.all.count
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        Track.all.count.should eq(count)
        Track.find_by_id(@track.id).user_id.should eq(nil)
      end

      it "a copy track will be succesfully/actually 'destroyed'" do
        count = Track.all.count
        @track.copy = true
        @track.save
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        Track.all.count.should eq(count-1)
        Track.find_by_id(@track.id).should eq nil
      end

      it "should not allow destroy of other user owned tracks" do
        count = Track.all.count
        delete :destroy, :user_id => @user.id, :id => @track.id + 1
        Track.all.count.should eq(count)
      end

      it "should return an error response if not user's track" do
        delete :destroy, :user_id => @user.id, :id => @track.id + 1
        expect(response.body).to eq({errors: "invalid track"}.to_json)
      end

      it "should return an error response if delete fails" do
        Track.any_instance.stub(:save).and_return(false)
        delete :destroy, :user_id => @user.id, :id => @track.id
        expect(response.body).to eq({:errors => @track.errors.messages}.to_json)
      end

    end
  

  end

end

