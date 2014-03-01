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


end
