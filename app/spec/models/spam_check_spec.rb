require 'spec_helper'

describe SpamCheck do

  before do
    @user = FactoryGirl.create(:user)
    @track = FactoryGirl.create(:track, :user_id => @user)
  end


  describe "testing akismet spam values" do

    it "with valid track will change track value to false" do

      @track.comment = "this is not a spam comment"
      test = SpamCheck.new(@user,
                           @track,
                           "127.0.0.1",
                           "Mozilla/5.0",
                           "http://www.yahoo.com").check
      
      test.should eq "false"
      
    end

    it "with spammy track will keep track value to true" do
      @track.comment = "viagra-test-123"
      test = SpamCheck.new(@user,
                           @track,
                           "127.0.0.1",
                           "Mozilla/5.0",
                           "http://www.yahoo.com").check
      
      test.should eq "true"
    end

  end

end
