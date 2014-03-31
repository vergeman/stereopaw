class PlaylistsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index    
    render :json => User.find(params[:user_id]).playlists
  end

  #we'll sends playlist-associated tracks
  def show
    @playlist = Playlist.find(params[:id])
    @tracks = Track.find(@playlist.track_ids)
    #render :json => {:playlist => @playlist, :tracks => @tracks}
    render :json => @tracks
  end

  def create
    @playlist = current_user.playlists.build(new_params)
    if @playlist.save
      render :json => @playlist
    else
      render :json => {:errors => @playlist.errors.messages}
    end
  end

  #accepts :track => a single track_id or :playlist => xx params
  def update
    @playlist = current_user.playlists.find(params[:id])
    if @playlist.update_attributes(track_params(@playlist))
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

  def track_params(playlist)
    #case of just adding a track id to params
    if params[:track] && playlist
      return {:track_ids => playlist.track_ids + [ params[:track] ] }
    else
      #case where track_ids are being removed
      return _parse_track_id_params()
    end
  end


  private

  def _parse_track_id_params()
    #this isn't pretty but pg array saving behavior is really strange
    if params[:playlist][:track_ids].nil?
      _params = new_params
      _params[:track_ids] = []
      return _params
    else
      _params = new_params
      _params[:track_ids] = Array.new(params[:playlist][:track_ids])
      return _params
    end
  end

end
