require 'net/http'

class TracksController < ApplicationController
  include ApplicationHelper

  before_filter :authenticate_user!, only: [:new, :create, :submit, :update, :destroy, :mytracks]

  before_filter :check_auth_or_json_redirect, only: [:update, :destroy]

  respond_to :html, :json

  #returns paginated set of latest tracks
  def latest
    get_tracks_json(Track, "created_at DESC")
  end

  #returns paginated set of popular tracks
  def popular
    get_tracks_json(Track, "plays DESC")
  end

  #returns paginated set of current user's tracks - requires auth
  def mytracks
    get_tracks_json(current_user.tracks, "created_at DESC")
  end

  #find individual track given param, responds in json
  def show
    if Track_find(Track, params[:id], {:errors => "invalid track"})
      json_response(@track)
    end
  end

  #route that augments play count
  def play
    if Track_find(Track, params[:track][:id], 
                  {:errors => "invalid track"})
      render :json =>  @track.played.played_json
    end
  end

  #delete a track from current user's set
  def destroy

    if Track_find(current_user.tracks, params[:id], 
                  { "errors" => { :general => "Not owner" }})

      if @track.destroy
        render :json => { "success" => @track.id }
      else
        render :json => { "errors" => @track.errors.messages }
      end
    end

  end

  #receives edited track data
  def update
    
    if Track_find(current_user.tracks, params[:id],
                  { "errors" => { general: "Not owner" } } )

      if @track.update_attributes(update_params)
        render :json => { "success" => @track.id }
      else
        render :json => { "errors" => @track.errors.messages }
      end
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
      respond_with(@track, :location => tracks_submit_path(@track))
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

  def Track_find(source, track_find_params, json_error_msg)
    begin
      @track = source.find(track_find_params)
    rescue ActiveRecord::RecordNotFound
      render :json => json_error_msg
      return false
    end
    return true
  end

  def get_tracks_json(source, track_order)
    page = params[:page] ? params[:page].to_i : 0
    @tracks = source.order(track_order).limit(10).offset(page * 10)
    json_response(@tracks)
  end

  def json_response(obj)
    respond_with(obj) do |format|
      format.json { render }
    end
  end

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
