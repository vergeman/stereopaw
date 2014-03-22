require 'spec_helper'

describe "TracksPlay", :js => true do

  describe "User clicks a play button" do

    pending "should increment the specific track plays count" do
      #first('.play').click
      #need to wait for ajax
      #@track = FactoryGirl.create(:track)
      #visit '/meow'
      #find('#new').click
      (@track.plays + 1).should eq Track.find(@track).plays
    end

    #can't get page rending to work...
    pending "should update the track's plays value on the page" do
      @track = FactoryGirl.create(:track)

      visit '/meow'

      find('#new').click

      #puts @track.inspect
      #puts page.evaluate_script('jQuery.active').zero?
      #puts first('.num-plays').inspect
      #puts page.body
      Rails::logger.debug "===================================="
      sleep(10)
      puts page.body
      expect(page).to have_content(@track.title)

      #puts "HERE"
      #all('.track-meta').each { |a|
      #  puts a[:id]
      #}

      #first('.num-plays').should have_content(@track.plays + 1)
    end

  end



end
