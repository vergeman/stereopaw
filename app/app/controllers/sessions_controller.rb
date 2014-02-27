class SessionsController < Devise::SessionsController

  #override for json response
  # POST /resource/sign_in
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message(:notice, :signed_in) if is_flashing_format?
    sign_in(resource_name, resource)
    yield resource if block_given?

    response.headers['X-CSRF-Token'] = form_authenticity_token
    render :json => resource
  end



  #POST /resource/sign_out
  def destroy

#    redirect_path = after_sign_out_path_for(resource_name)
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    set_flash_message :notice, :signed_out if signed_out && is_flashing_format?

    yield resource if block_given?

    response.headers['X-CSRF-Token'] = form_authenticity_token
    render :json => { 'logout' => true }.to_json

  end


end
