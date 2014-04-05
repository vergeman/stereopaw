module ApplicationHelper

  def javascript_include(controller)
    case controller
    
    #root path, return js for main app
    when "main"
      return javascript_include_tag "main"
      
    else 
      return javascript_include_tag "controller"
    end

  end


  def render_json_redirect(path)
    response.headers["AJAX-STATUS"] = "302"
    render :json => {'location' => path}.to_json
  end

end
