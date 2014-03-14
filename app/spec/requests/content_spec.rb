require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!


describe "Root Page" do

  describe "Visits '/meow' page" do

    describe "Popular", :js => true do

      before {
        visit meow_path()
      }

      it "should have display of all the popular tracks" do        
        tracks = Track.all.order("created_at ASC").limit(20)
        i=0
        all('.track-meta').each do |t|
          expect(t[:id].to_s).to eq(tracks[i].id.to_s)
          i=i+1
        end
      end

    end

  end


  describe "Visits 'latest tracks' page" do

    describe "New", :js => true do
      before {
        visit '/meow/#new'
      }

      it "should display new tracks" do
        tracks = Track.all.order("created_at DESC").limit(20)

        i=0
        all('.track-meta').each do |t|
          expect(t[:id].to_s).to eq(tracks[i].id.to_s)
          i=i+1
        end
        
      end

    end
  end


  describe "Visits 'mytracks' page" do
    
    before {
      Warden.test_reset!
      @track1 = FactoryGirl.create(:track)
      @user = @track1.user
      login_as(@user, :scope => :user)
    }

    describe "when logged in", :js => true do

      it "should display mytracks" do
        get "tracks.json"       
        tracks = @user.tracks.order("created_at DESC")
        
        i=0
        JSON.parse(response.body).each do |t|          
          expect(t['id'].to_s).to eq(tracks[i].id.to_s)
          i=i+1
        end
        
      end

    end

    describe "when logged out", :js => true do
      
      it "should redirect" do
        Warden.test_reset!
        get "tracks.json"
        response.should redirect_to meow_path
      end

    end

  end

end
