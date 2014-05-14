require 'net/http'

class TracksController < ApplicationController
  include ApplicationHelper

  before_filter :authenticate_user!, only: [:new, :create, :submit, :update, :destroy, :mytracks]

  before_filter :check_auth_or_json_redirect, only: [:update, :destroy]

  respond_to :html, :json

  #returns paginated set of latest tracks
  def latest
    render :json => Track.get_tracks(params, Track, "created_at DESC")
  end

  #returns paginated set of popular tracks
  def popular
    render :json => Track.get_tracks(params, Track, "plays DESC")
  end

  #returns paginated set of current user's tracks - requires auth
  def mytracks
    render :json => Track.get_tracks(params,
                                     current_user.tracks,
                                     "created_at DESC")
  end

  #find individual track given param, responds in json
  def show
    @track = Track.find_tracks(Track,
                               params[:id])
    respond_with(@track)
  end

  #route that augments play count
  def play
    render :json => Track.augment_plays(Track,
                                        params[:track][:id])
  end

  #delete a track from current user's set
  def destroy
    render :json => Track.destroy(current_user.tracks, params[:id])
  end

  #receives edited track data
  #update_params processes genres into appropriate format
  def update
    @track = Track.find_tracks(current_user.tracks, params[:id])

    if @track[:errors]
      render :json => @track
      return
    end

    if @track.update_attributes(update_params)
      render :json => { "success" => @track.id }
    else
      render :json => { "errors" => @track.errors.messages }
    end

  end

  #receives a marklet submission
  def new
    unless new_params
      redirect_to root_path
      return
    end

    @user = current_user
    @track = current_user.tracks.build(new_params)
  end

  #post submission of a track
  def create
    @user = current_user
    @track = current_user.tracks.build(new_params)

    if @track.save
      respond_with(@track, :location => tracks_submit_path(@track) )
    else
      respond_with(current_user, @track) #for error submit
    end
  end

  #marklet's "show": what renders after successful submit
  def submit
    @track = Track.find_by_id(params[:id])    
  end


###=====
  protected

  def check_auth_or_json_redirect
    if user_signed_in?
      return true
    else
      render_json_redirect('/login')
    end
  end

#strong params

  def update_params

    process_genres_params( 
                          params.require(:track).permit(:artist,
                                                        :title,
                                                        :timeformat,
                                                        :timestamp,
                                                        :comment,
                                                        :genres)
                          )  if params[:track]
  end

  def new_params
    process_genres_params (
                           params.require(:track)
                             .permit(:track_id, 
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
                                     :service)
                           ) if params[:track]
  end

  def process_genres_params(params)
    params[:genres] = params[:genres].to_s.split(',').map(&:strip) if params[:genres]
    return params
  end
end
