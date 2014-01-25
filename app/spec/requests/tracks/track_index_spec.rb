require 'spec_helper'

describe "TrackIndex" do

  describe "Visits Track#Index page " do

    subject { page }

    let(:track) { FactoryGirl.create(:track) }

    before { visit tracks_path() }

    describe "to verify values" do

      pending "count number of tracks displayed"

      pending "required data is displayed"

      #partial data
      it { should have_content(track.artist) }
      it { should have_content(track.title) }
      it { should have_content(track.profile_url) }
      it { should have_content(track.page_url) }
      it { should have_content(track.timeformat) }
      it { should have_content(track.duration.to_s) }
      it { should have_content(track.timestamp.to_s) }
      it { should have_content(track.comment) }

    end


  end

end
