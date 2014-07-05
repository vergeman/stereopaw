class PasswordsController < Devise::PasswordsController
  include ApplicationHelper
  respond_to :html, :json


  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
#      respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
      render_json_redirect("/meow")
    else
      #respond_with(resource)
      respond_to do |format|        
        format.json { render :json => {errors: resource.errors} }
        format.html { render :new }
      end

    end
  end


protected
  def after_resetting_password_path_for(resource)
    meow_path
  end

end
