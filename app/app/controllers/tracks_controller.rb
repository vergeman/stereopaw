require 'net/http'
require 'sanitize'

class TracksController < ApplicationController
  include ApplicationHelper

  before_filter :authenticate_user!, only: [:new, :create, :submit, :update, :destroy, :mytracks, :report, :add]

  before_filter :check_auth_or_json_redirect, only: [:update, :destroy]

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  respond_to :html, :json

  #returns paginated set of latest ('new') tracks
  def latest
    @tracks = Track.get_latest(page_params, current_user)
    respond_to do |format|
      format.json { render :json => @tracks }
      format.html { redirect_to '/meow#new' }
    end
  end

  #returns paginated set of popular tracks
  def popular
    @tracks = Track.get_popular(page_params, current_user)
    respond_to do |format|
      format.json { render :json => @tracks }
      format.html { redirect_to '/meow#popular'}
    end
  end

  #returns paginated set of current user's tracks - requires auth
  def mytracks
    @tracks = Track.my_tracks(page_params, current_user)
    respond_to do |format|
      format.json { render :json => @tracks }
      format.html { redirect_to 'meow/#tracks' }
    end
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

  def add
    if current_user
      render :json => Track.add(current_user.id, params[:id])
    else
      render :json => {:reported => "please login"}
    end
  end

  #delete a track from current user's set
  def destroy
    @track = Track.find_tracks(current_user.tracks, params[:id])

    #if error, return error msg
    render :json => { "errors" => { :general => "Not owner" } } && return if @track[:errors]

    #if it's a copy track being deleted, remove completely
    if (@track.copy && @track.user_id == current_user.id)
      render :json => { "success" => @track.id} if @track.destroy
      return
    end

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
      SpamCheck.new(current_user, @track, request.remote_ip, request.user_agent, request.referer).delay.check
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

  #user reports track as spam
  def report
    if current_user
      @track = Track.find_by_id(params[:id])
      render :json => @track.reported(current_user)
    else
      render :json => {:reported => "please login"}
    end
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

  #on any update, we toggle spam to true, and send it through akismet
  #just in case we have nefarious types who submit valid, 
  #and then make it spam on edit

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
    track_params[:spam] = true
    return track_params
  end

  #returns page number
  def page_params
    return params[:page] ? params[:page].to_i : 0
  end

  def process_genres_params(genres)
    return genres.to_s.split(',').map(&:strip) if genres
    return []
  end


end
