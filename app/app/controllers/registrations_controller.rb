class RegistrationsController < Devise::RegistrationsController
  include ApplicationHelper

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
        sign_up(resource_name, resource)
        #respond_with resource, location: after_sign_up_path_for(resource)
      else
        expire_data_after_sign_in!
        #respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end

      #succesful signup
      respond_with(resource) do |format|
        format.html {
          #submission data from marklet/extension
          redirect_to after_sign_up_path_for(resource) 
        }
        format.json { 
          #plain signup (no track submission from backbone)
          render_json_redirect("/meow") 
        }
      end

    else
      #no save - no signup
      clean_up_passwords resource

      respond_to do |format|

        format.html {
          #redirect_to after_inactive_sign_up_path_for(resource)
          #inactive is used for confimration email & activated account
          render :new
        }

        format.json {
          render :json => 
          { 
            user: resource,
            errors: resource.errors 
          }
        }
      end

      #respond_with resource
    end
  end

  # GET /resource/edit
  # make unavailable for html access
  def edit
    redirect_to root_path
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
      render_json_redirect("/meow")
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
    respond_with_navigational(resource){ redirect_to meow_path }
  end



end
