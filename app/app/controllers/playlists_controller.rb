class PlaylistsController < ApplicationController
  before_filter :authenticate_user!, only: [:create]

  def index    
    render :json => User.find(params[:user_id]).playlists
  end

  #we'll send all associated tracks for now,
  #but this might be a little verbose data-wise
  def show
    @playlist = Playlist.find(params[:id])
    @tracks = Track.find(@playlist.track_ids)
    render :json => {:playlist => @playlist, :tracks => @tracks}
  end

  def create
    @playlist = current_user.playlists.build(new_params)
    if @playlist.save
      render :json => @playlist
    else
      render :json => {:errors => @playlist.errors.messages}
    end
  end


  protected

  def new_params
    params.require(:playlist).permit(:name,
                                     :description,
                                     :track_ids) if params[:playlist]
  end
end
