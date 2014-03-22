require 'net/http'

class TracksController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create, :submit]
  respond_to :html, :json

  #all tracks of a user
  def index
    page = params[:page].to_i
    @user = User.find(params[:user])
    @tracks = @user.tracks.limit(10).offset(page * 10)
    respond_with(@tracks) do |format|
      format.json { render }
    end

  end

  #latest tracks
  def latest
    page = params[:page].to_i
    @tracks = Track.all.order("created_at DESC").limit(10).offset(page * 10)
    respond_with(@tracks) do |format|
      format.json { render }
    end
  end

  #most popular tracks - need metric
  def popular
    page = params[:page].to_i
    @tracks = Track.all.order("plays DESC").limit(10).offset(page * 10)
    respond_with(@tracks) do |format|
      format.json { render }
    end

  end

  def show
    @track = Track.find_by_id(params[:id])
  end


  #POST/plays
  def play
    begin
      @track = Track.find(params[:track][:id])
    rescue ActiveRecord::RecordNotFound
      render :json => {:errors => "invalid track"}
      return
    end

    @track.played
    render :json =>
      {
      :track => 
      {
        :id => @track.id,
        :plays => @track.plays 
      }
    }

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
      return
    end

    @user = current_user
    @track = current_user.tracks.build(new_params)
    @track.genres = new_params[:genres].to_s.split(',').map(&:strip)
  end


  def create
    @user = current_user
    @track = current_user.tracks.build(new_params)
    @track.genres = new_params[:genres].to_s.split(',').map(&:strip)

    if @track.save
      flash[:success] = "Success"
      respond_with(@track, :location => tracks_submit_path(@track))
    else
      respond_with(current_user, @track) #for error submit
    end
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
                                  :genres,
                                  :service) if params[:track]
  end

end
