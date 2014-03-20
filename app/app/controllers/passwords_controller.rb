class PasswordsController < Devise::PasswordsController
  include ApplicationHelper
  respond_to :html, :json

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    self.resource = resource_class.new
    resource.reset_password_token = params[:reset_password_token]
    puts "===="
    puts resource.errors.inspect
  end


 # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
      set_flash_message(:notice, flash_message) if is_flashing_format?
      sign_in(resource_name, resource)
      respond_with resource, location: after_resetting_password_path_for(resource)
    else
      puts "===="
      puts resource.errors.inspect

      respond_with resource
    end
  end

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
        format.html { render "new" }
      end

    end
  end


protected
  def after_resetting_password_path_for(resource)
    meow_path
  end

end
