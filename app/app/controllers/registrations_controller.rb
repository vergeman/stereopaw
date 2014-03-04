class RegistrationsController < Devise::RegistrationsController

  # GET /resource/sign_up
  def new
    build_resource({})
    respond_with self.resource
  end

  # POST /resource
  def create
    build_resource(sign_up_params)

    if resource.save
      yield resource if block_given?

      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        render_json_redirect("/")
        #respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
        expire_data_after_sign_in!
        render_json_redirect("/")
        #respond_with resource, location: after_inactive_sign_up_path_for(resource)

      end
    else

      clean_up_passwords resource
      render :json => {user: resource, errors: resource.errors }
      #respond_with resource
    end
  end

  # GET /resource/edit
  def edit
    render :edit
  end



  def render_json_redirect(path)
    response.headers["AJAX-STATUS"] = "302"
    render :json => {'location' => path}.to_json
  end


end
