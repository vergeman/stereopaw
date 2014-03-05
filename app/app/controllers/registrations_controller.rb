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
        #set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)
        render_json_redirect("/")
        #respond_with resource, location: after_sign_up_path_for(resource)
      else
        #set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
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

  # PUT /resource
  # We need to use a copy of the resource because we don't want to change
  # the current user in place.
  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    if update_resource(resource, account_update_params)
      yield resource if block_given?
      if is_flashing_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
          :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end

      sign_in resource_name, resource, bypass: true      
      render_json_redirect("/")
      #respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      render :json => {user: resource, errors: resource.errors }
      #respond_with resource
    end
  end

  # DELETE /resource
  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    #set_flash_message :notice, :destroyed if is_flashing_format?
    yield resource if block_given?

    render_json_redirect("/")
    #respond_with_navigational(resource){ redirect_to after_sign_out_path_for(resource_name) }
  end

  def render_json_redirect(path)
    response.headers["AJAX-STATUS"] = "302"
    render :json => {'location' => path}.to_json
  end


end
