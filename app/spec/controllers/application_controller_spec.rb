require 'spec_helper'


describe ApplicationController do

  describe "set_csrf_cookie" do

    it "returns a form authenticity token" do      
      @controller.stub(:protect_against_forgery?).and_return(true)
      @controller.stub(:form_authenticity_token).and_return("TOKEN") 
      @controller.send(:set_csrf_cookie)

      expect(@controller.send(:cookies)['csrf_token']).to eq(@controller.send(:set_csrf_cookie))

    end
  end

end
