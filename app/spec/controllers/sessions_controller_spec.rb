require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

#new_user_session GET   /users/sign_in(.:format)   sessions#new
#user_session POST   /users/sign_in(.:format)     sessions#create
#destroy_user_session DELETE /users/sign_out(.:format) sessions#destroy
#auth_user_session POST   /users/auth(.:format) sessions#auth


describe SessionsController do

  #==GET==
  describe "GET #new (users/sign_in)" do

    describe "when logged out" do

      before {
        Warden.test_reset!
        @request.env["devise.mapping"] = Devise.mappings[:user]
        @user = FactoryGirl.create(:user)
        sign_out @user
      }
      
      it "responds with 200" do
        get :new, :format => :html
        expect(response.status).to eq(200)
      end

      it "renders sign in page" do
        get :new
        expect(response).to render_template("new")
      end      
    end


    describe "when logged in" do

      before {
        @request.env["devise.mapping"] = Devise.mappings[:user]
        Warden.test_reset!
        controller.stub(:authenticate_user!).and_return(true)
        @user = FactoryGirl.create(:user)
        sign_in @user
      }

      it "should have 302 redirect" do
        get :new
        expect(response.status).to eq(302)
      end

      it "should render / template" do
        get :new
        response.should redirect_to root_path
      end
    end    
  end

  #==AUTH==
  #/users/auth POST
  describe "POST #auth" do

    #invalid login - 401
    describe "invalid login" do

      before {
        Warden.test_reset!
        @request.env["devise.mapping"] = Devise.mappings[:user]
        controller.stub(:authenticate_user!).and_return(false)
        @user = FactoryGirl.create(:user)
        sign_out(@user)
      }

      it "should return a 403 forbidden response" do
        post :auth, :format => :json
        expect(response.status).to eq(403)
      end

    end
    
    #valid login
    describe "valid login" do

      before {
        Warden.test_reset!
        @request.env["devise.mapping"] = Devise.mappings[:user]
        controller.stub(:authenticate_user!).and_return(true)
        @user = FactoryGirl.create(:user)
        sign_in @user
      }

      it "should return a 200 valid response" do
        post :auth, :format => :json
        expect(response.status).to eq(200)
      end

      it "should return a json users resource" do
        post :auth, :format => :json
        response.body.should == @user.to_json
      end

    end
  end


  #/users/sign_in POST to create session
  describe "POST #create" do
     describe "invalid login" do

      before {
        Warden.test_reset!
        @request.env["devise.mapping"] = Devise.mappings[:user]
        controller.stub(:authenticate_user!).and_return(false)
        @user = FactoryGirl.create(:user)
        sign_out(@user)
      }

      it "should return a 401 unauthorized response" do
        post :create, :format => :json
        expect(response.status).to eq(401)
      end

    end

    describe "valid login" do

      before {
        Warden.test_reset!
        @request.env["devise.mapping"] = Devise.mappings[:user]
        @user = FactoryGirl.create(:user)
        sign_in @user
        controller.stub(:authenticate_user!).and_return(true)
      }

      it "should return a 200 valid response" do
        post :create, :format => :json
        expect(response.status).to eq(200)
      end

      it "json should return a json users resource" do
        post :create, :format => :json
        response.body.should == @user.to_json
      end

      it "html should return a 302 redirect" do
        post :create, :format => :html
        expect(response.status).to eq(302)
      end

      it "html should redirect aftersigninpath" do
        post :create, :format => :html
        response.should redirect_to('/')
      end

    end

  end



  describe "POST #destroy" do


    before {
      Warden.test_reset!
      @request.env["devise.mapping"] = Devise.mappings[:user]
      @user = FactoryGirl.create(:user)
      sign_in @user
    }

    it "should receive a logout true response" do
      post :destroy, :format => :json
      response.body.should == {'logout' => true}.to_json
    end

  end



  Warden.test_reset!
end
