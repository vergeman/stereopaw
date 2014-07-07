class PlaylistsController < ApplicationController
  include ApplicationHelper
  before_filter :authenticate_user!, only: [:create, :update, :destroy]
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def index
    @playlists = User.find(params[:user_id]).playlists
    render :json => @playlists.map{|p| p.with_track_preview}, :methods => [:track_previews]
  end


  def show
    @playlist = Playlist.find(params[:id])
    @tracks = Track.where(id: @playlist.track_ids)
    render :json => @tracks
  end

  #Cases:
  #1. update META(name, description) *
  #2. Add Track
  #3. Remove Track
  def update
    @playlist = current_user.playlists.find(params[:id])

    if @playlist && @playlist.update_attributes(playlist_params)
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => @playlist.with_track_preview, :methods => [:track_previews]
    else
      render :json => {:errors => @playlist.errors.messages}
    end
  end


  def create
    @playlist = current_user.playlists.build(playlist_params)

    if @playlist.save
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => @playlist.with_track_preview, :methods => [:track_previews]
    else
      render :json => {:errors => @playlist.errors.messages}
    end
  end


  #/users/user_id/playlists/playlist_id
  def destroy
    @playlist = current_user.playlists.find(params[:id])
    if @playlist.destroy
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => {:success => "playlist destroyed"}
    else
      render :json =>  {:errors => "error destroying playlist"}
    end
  end


  protected
  
  def record_not_found
    render :json => {:errors => "invalid playlist"}
  end

  def playlist_params
    playlist_params = 
      sanitize_params( 
                      params.require(:playlist)
                        .permit(:name,
                                :description,
                                :track_ids => [])
                      )

    #for empty playlists
    playlist_params[:track_ids] ||= []

    return playlist_params
  end

end
