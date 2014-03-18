require 'net/http'

class TracksController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create, :submit]
  respond_to :html, :json

  #TODO: separate route for 
  #other users v. current_user, privacy issues?
  #also need to display something when not logged in

  #all tracks of a user
  def index
    @user = User.find(params[:user])
    @tracks = @user.tracks
    respond_with(@tracks) do |format|
      format.json { render }
    end

  end


  #latest tracks
  def latest
    @tracks = Track.all.order("created_at DESC").limit(20)
    respond_with(@tracks) do |format|
      format.json { render }
    end
  end

  #most popular tracks - need metric
  def popular
    @tracks = Track.all.order("created_at ASC").limit(20)
    respond_with(@tracks) do |format|
      format.json { render }
      #format.html { render :json => @tracks}
    end

  end


  def show
    @track = Track.find_by_id(params[:id])
  end


#REQUIRES AUTH
  def submit
    @track = Track.find_by_id(params[:id])    
  end

  def mytracks
    if user_signed_in?
      respond_with(current_user.tracks.order("created_at DESC") ) do |format|
        format.json { render }
        format.html { redirect_to meow_path() }
      end
    else
      redirect_to meow_path()
    end
  end


  def new
    #our route is tracks/new - we won't know what user we
    #are on initial submitx
    unless new_params
      redirect_to root_path
    end

    @user = current_user
    @track = current_user.tracks.build(new_params)
  end


  def create
    @user = current_user
    @track = current_user.tracks.build(new_params)
    flash[:success] = "Success" if @track.save

    respond_with(@track, :location => tracks_submit_path(@track))
    #respond_with(current_user, @track)
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
