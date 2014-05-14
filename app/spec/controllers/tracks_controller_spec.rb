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
      @track1 = FactoryGirl.create(:track)
      @track2 = FactoryGirl.create(:track)
    end
    it "responds successfully with an HTTP 200 status code" do
      get :latest, :format => :json
      expect(response.status).to eq(200)
    end

    it "responds with tracks sorted DESC by created_at" do
      get :latest, :format => :json, :page => 0
      expect(response.body).to eq(Track.all.order("created_at DESC").limit(10).to_json(:except => [:submit_id, :user_id, :updated_at, :shareable]) )
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
      @track = FactoryGirl.create(:track)
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
      expect(response.body).to eq(@track.to_json(:except => [:submit_id, :user_id, :updated_at, :shareable]))
    end

  end

  describe "POST #play" do

    before do
      @track = FactoryGirl.create(:track)
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
        @track = FactoryGirl.create(:track)
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
        @track = FactoryGirl.create(:track)
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
        @track = FactoryGirl.create(:track)
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
        @track = FactoryGirl.create(:track)
        @user = @track.user
        login_as(@user, :scope => :user)
        controller.stub(:authenticate_user!).and_return(true)
        controller.stub(:current_user).and_return(@user)
      end
      it "responds with a 200" do
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        expect(response.status).to eq (200)
      end

      it "a successful destroy should render success response" do
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        expect(response.body).to eq({:success => @track.id}.to_json)
      end

      it "a succesful 'destroy' does not actually remove from the database" do
        count = Track.all.count
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        Track.all.count.should eq(count)
        Track.find_by_id(@track.id).should_not eq(nil)
      end


      it "a succesful 'destroy' does disassociate the user" do
        count = Track.all.count
        delete :destroy, :user_id =>  @user.id, :id => @track.id
        Track.all.count.should eq(count)
        Track.find_by_id(@track.id).user_id.should eq(nil)
      end

      it "should not allow destroy of other user owned tracks" do
        count = Track.all.count
        delete :destroy, :user_id => @user.id, :id => @track.id + 1
        Track.all.count.should eq(count)
      end

      it "should return an error response if not user's track" do
        delete :destroy, :user_id => @user.id, :id => @track.id + 1
        expect(response.body).to eq({errors: {general: "Not owner"}}.to_json)
      end

      it "should return an error response if delete fails" do
        Track.any_instance.stub(:save).and_return(false)
        delete :destroy, :user_id => @user.id, :id => @track.id
        expect(response.body).to eq({:errors => @track.errors.messages}.to_json)
      end

    end
  

  end

end

