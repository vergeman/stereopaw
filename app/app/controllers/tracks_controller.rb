require 'net/http'

class TracksController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create]

  def index
    @tracks = Track.all

    respond_to do |format|
      format.html {}
      format.json { render :json => @tracks.order("created_at DESC") }
    end
    
  end

  def new
    @track = Track.new(new_params)
  end


  def create
    @track = Track.new(new_params)
    if @track.save
      flash[:success] = "Success"
      redirect_to @track
    else
      render 'new'
    end

  end


  def show
    @track = Track.find_by_id(params[:id])
  end





#strong params
private

  def new_params
    params.require(:track).permit(:track_id, 
                                  :artist, 
                                  :title, 
                                  :page_url, 
                                  :profile_url, 
                                  :timeformat, 
                                  :timestamp, 
                                  :duration,
                                  :comment, 
                                  :shareable,
                                  :artwork_url,
                                  :service) if params[:track]
  end

end
