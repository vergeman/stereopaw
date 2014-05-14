class PlaylistsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update, :destroy]

  def index
    playlists = User.find(params[:user_id]).playlists
    render :json => playlists.map{|p| p.with_track_preview}, :methods => [:track_previews]
  end

  def show
    render :json => Playlist.show_playlist_tracks(params)
  end

  #accepts :track => update a single track_id or 
  #:playlist => xx params, remove track or update playlist info
  def update
    render :json => Playlist.update_playlist(params, current_user), :methods => [:track_previews]
  end

  def create
    render :json => Playlist.create_playlist(params, current_user), :methods => [:track_previews]
  end

  #/users/user_id/playlists/playlist_id
  def destroy
    render :json => Playlist.destroy_playlist(params, current_user), :methods => [:track_previews]
  end


end
