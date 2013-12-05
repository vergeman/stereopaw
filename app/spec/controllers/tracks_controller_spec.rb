require 'spec_helper'

describe TracksController do

#    tracks GET    /tracks(.:format)          tracks#index
#           POST   /tracks(.:format)          tracks#create
# new_track GET    /tracks/new(.:format)      tracks#new
#edit_track GET    /tracks/:id/edit(.:format) tracks#edit
#     track GET    /tracks/:id(.:format)      tracks#show
#           PATCH  /tracks/:id(.:format)      tracks#update
#           PUT    /tracks/:id(.:format)      tracks#update
#           DELETE /tracks/:id(.:format)      tracks#destroy


  describe "GET #new" do

    it "responds successfully with an HTTP 200 status code" do
      get :new
      expect(response).to be_success
      expect(response.status).to eq(200)
    end

    it "renders the new template" do
      get :new
      expect(response).to render_template("new")
    end

  end


  describe "GET #index" do

    it "responds successfully with an HTTP 302 redirect code" do
      get :index
      expect(response.status).to eq(302)
    end

    it "renders the root page" do 
      get :index
      response.should redirect_to root_path
    end

  end


  describe "GET #show" do

    before do
      @track = FactoryGirl.create(:track)
    end

    it "responds successfully with an HTTP 302 redirect code" do

      get :show, id: @track
      expect(response.status).to eq(200)
    end

    it "renders the appropriate track page" do 
      get :show, id: @track
      response.should render_template(:show)
    end
  end

  pending "GET #edit  [:id]"
  pending "PATCH/PUT #update [:id]"
  pending "DELETE #destroy"

end
