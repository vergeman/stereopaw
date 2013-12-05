require 'spec_helper'

describe "TrackNew" do

  #"GET request renders form" -> see controller test

  describe "has Track" do
    subject { page }

    before { visit new_track_path({
                                    :track => 
                                    {
                                      :artist => "Artist",
                                      :title => "Title",
                                      :page_url => "mypageurl",
                                      :profile_url => "profileurl",
                                      :timeformat => "1:23",
                                    }
                                  }
                                    )}
    
    describe "form fields" do

      it { should have_field("track_artist") }
      it { should have_field("track_title") }
      it { should have_field("track_page_url") }
      it { should have_field("track_profile_url") }
      it { should have_field("track_timeformat") }
      it { should have_field("track_timeformat_optional") }

      #user testing, so should be inaccesbile to user --hacky
      it { should have_selector("input#track_timestamp") }
      it { should have_selector("input#track_duration" ) }

      it { should have_selector("input#track_submit[type=submit]") }
    end


    describe "with form_fields populated by new_params" do

      it { should have_selector("input#track_artist[value=\"Artist\"]") }
      it { should have_selector("input#track_title[value=\"Title\"]") }

      it { should have_selector("input#track_page_url[value=\"mypageurl\"]") }
      it { should have_selector("input#track_profile_url[value=\"profileurl\"]") }
      it { should have_selector("input#track_timeformat[value=\"1:23\"]") }
      it { should have_selector("input#track_timeformat_optional[value=\"1\"]") }

    end

  end


  pending "must be logged in"
  pending "not logged in, redirect to login"

end
