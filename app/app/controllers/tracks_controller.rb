require 'net/http'

class TracksController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create]
  respond_to :html, :json

  def index
    @tracks = Track.all

    respond_with(@tracks.order("created_at DESC")) do |format|
      format.json { render }
    end
    
  end


  def new
    @track = Track.new(new_params)
  end


  def create
    @track = Track.new(new_params)
    flash[:success] = "Success" if @track.save
    respond_with(@track)
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
