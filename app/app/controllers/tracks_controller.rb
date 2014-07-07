require 'net/http'
require 'sanitize'

class TracksController < ApplicationController
  include ApplicationHelper

  before_filter :authenticate_user!, only: [:new, :create, :submit, :update, :destroy, :mytracks]

  before_filter :check_auth_or_json_redirect, only: [:update, :destroy]

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  respond_to :html, :json

  #returns paginated set of latest tracks
  def latest
    render :json => Track.get_tracks(params,
                                     Track,
                                     "spam = false",
                                     "created_at DESC")
  end

  #returns paginated set of popular tracks
  def popular
    render :json => Track.get_tracks(params,
                                     Track,
                                     "spam = false",
                                     "plays DESC")
  end

  #returns paginated set of current user's tracks - requires auth
  def mytracks
    render :json => Track.get_tracks(params,
                                     current_user.tracks,
                                     "",
                                     "created_at DESC")
  end


  #find individual track given param, responds in json
  def show
    @track = Track.find_tracks(Track, params[:id])
    respond_with(@track)
  end


  #route that augments play count
  def play
    render :json => Track.augment_plays(Track, params[:track][:id])
  end


  #delete a track from current user's set
  def destroy
    @track = Track.find_tracks(current_user.tracks, params[:id])

    #if error, return error msg
    render :json => { "errors" => { :general => "Not owner" } } && return if @track[:errors]

    #we dissociate but not remove track
    @track.user_id = nil
    if @track.save
      render :json => { "success" => @track.id }
    else
      render :json => { "errors" => @track.errors.messages }
    end

  end


  #receives a marklet submission
  def new
    redirect_to root_path unless new_track_params
    @user = current_user
    @track = current_user.tracks.build(new_track_params)
  end


  #receives edited track data
  #update_params processes genres into appropriate format
  def update
    @track = Track.find_tracks(current_user.tracks, params[:id])
    render :json => @track && return if @track[:errors]

    if @track.update_attributes(update_track_params)
      render :json => { "success" => @track.id }
    else
      render :json => { "errors" => @track.errors.messages }
    end

  end


  #post submission of a track
  def create
    @user = current_user
    @track = current_user.tracks.build(new_track_params)

    if @track.save

      SpamCheck.new(@user, @track, request.remote_ip, request.user_agent, request.referer).delay.check

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

  def record_not_found
    render :json => {:errors => "invalid track"}
  end

#strong params
  #separate permit params for new_tracks and update_track actions
  #we process genre params since they are comma separated strings,
  #instead of treating them as array type parameters
  #(i.e. :genres => []

  def new_track_params
    return nil unless params[:track]

    track_params = sanitize_params(
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
                                             :service,
                                             :genres)
                                   ) if params[:track]

    track_params[:genres] = process_genres_params(track_params[:genres]) if track_params[:genres]

    return track_params
  end

  def update_track_params
    track_params = sanitize_params(
                                   params.require(:track)
                                     .permit(:artist,
                                             :title,
                                             :timeformat,
                                             :timestamp,
                                             :comment,
                                             :genres)
                                   ) if params[:track]    

    track_params[:genres] = process_genres_params(track_params[:genres])
    return track_params
  end


  def process_genres_params(genres)
    return genres.to_s.split(',').map(&:strip) if genres
    return []
  end


end
