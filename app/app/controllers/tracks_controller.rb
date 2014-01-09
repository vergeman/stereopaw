require 'net/http'

class TracksController < ApplicationController

  def index
    @tracks = Track.all
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
    params.require(:track).permit(:artist, :title, :page_url, :profile_url, :timeformat, :timestamp, :duration, :comment) if params[:track]
  end

end
