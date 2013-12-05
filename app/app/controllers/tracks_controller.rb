class TracksController < ApplicationController

  def index
    redirect_to root_path
  end

  def new
    @track = Track.new(new_params)
  end


#strong params
private
  def new_params
    params.require(:track).permit(:artist, :title, :page_url, :profile_url, :timeformat, :timestamp, :duration) if params[:track]
  end

end
