class SessionsController < Devise::SessionsController

  def new
    self.resource = resource_class.new(sign_in_params)
    clean_up_passwords(resource)
    respond_with(resource, serialize_options(resource)) do |format|
      format.html { render "users/login"}
    end

  end


  def auth
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)

    render :json => resource
  end


  #override for json response
  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message(:notice, :signed_in) if is_flashing_format?
    sign_in(resource_name, resource)
    yield resource if block_given?


    respond_with(resource) do |format|

      format.html {        
        redirect_to after_sign_in_path_for(resource)
      }

      format.json {
        #see application_controller for setting csrf
        render :json => resource
      }

    end

  end

  #POST /resource/sign_out
  def destroy
    #redirect_path = after_sign_out_path_for(resource_name)
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message :notice, :signed_out if signed_out && is_flashing_format?
    yield resource if block_given?

    render :json => { 'logout' => true }.to_json

  end


end
