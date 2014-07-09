require 'spec_helper'

describe "TrackShow" do

  describe "Visits Track#Show page " do

    subject { page }

    let(:track) { FactoryGirl.create(:track) }
    let (:user) { FactoryGirl.create(:user) }

    before { visit user_track_path(user, track) }

    describe "to verify values" do

      #partial data
      it { should have_content(track.artist) }
      it { should have_content(track.title) }

      it {
        find('.track-plays').should have_content(1)
      }

      it {
        find_link("#{track.title}")[:href].should == "#{track.page_url}"
      }

      it {
      find_link("#{track.artist}")[:href].should == "#{track.profile_url}"
      }
      #it { should have_content(track.timeformat) }
      #it { should have_content(track.duration.to_s) }
      #it { should have_content(track.timestamp.to_s) }
      #it { should have_content(track.comment) }

    end


  end

end
