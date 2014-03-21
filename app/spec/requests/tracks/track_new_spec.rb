require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!
Warden.test_reset!

describe "TrackNew" do

  #"GET request renders form" -> see controller test

  describe "has Track" do
    subject { page }

    before { 
      
      @user = FactoryGirl.create(:user)
      login_as(@user, :scope => :user)
      
      visit tracks_new_path({
                             :track => 
                              {
                                :track_id => "123",
                                :artist => "Artist",
                                :title => "Title",
                                :page_url => "mypageurl",
                                :profile_url => "profileurl",
                                :timeformat => "1:23",
                                :shareable => "true",
                                :service => "youtube",
                                :artwork_url => "http://www.youtube.com/vi/images/0.jpg",
                                :genres => "alternative"
                              }
                            }
                            )
    }
    
    describe "form fields" do

      it { should have_field("track_artist") }
      it { should have_field("track_title") }
      it { should have_field("track_comment") }
      it { should have_field("track_genres") }

      #user testing, so should be inaccesbile to user --hacky
      it { should have_selector("input#track_page_url") }
      it { should have_selector("input#track_profile_url") }
      it { should have_selector("input#track_shareable") }
      it { should have_selector("input#track_timestamp") }
      it { should have_selector("input#track_duration" ) }
      it { should have_selector("input#track_track_id") }
      it { should have_selector("input#track_service") }
      it { should have_selector("input#track_artwork_url") }

      it { should have_selector("input#track_submit[type=submit]") }
    end


    describe "with form_fields populated by new_params" do
      #not hidden
      it { find_field('track[artist]').value.should eq 'Artist' }
      it { find_field('track[title]').value.should eq 'Title' }
      it { find_field('track[timeformat]').value.should eq '1:23' }
      it { find_field('track[genres]').value.should eq "\"alternative\"" }

      it { should have_selector("input#track_shareable[value=\"true\"]") }
      it { should have_selector("input#track_track_id[value=\"123\"]") }     
      it { should have_selector("input#track_page_url[value=\"mypageurl\"]") }
      it { should have_selector("input#track_profile_url[value=\"profileurl\"]") }
      it { should have_selector("input#track_timeformat[value=\"1:23\"]") }
      it { should have_selector("input#track_service[value=\"youtube\"]") }
      it { should have_selector("input#track_artwork_url[value=\"http://www.youtube.com/vi/images/0.jpg\"]") }      

    end

  end


end
