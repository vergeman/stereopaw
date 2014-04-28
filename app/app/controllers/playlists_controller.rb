class PlaylistsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update, :destroy]

  def index
    playlists = User.find(params[:user_id]).playlists
    render :json => playlists.map{|p| p.with_track_preview}, :methods => [:track_previews]
  end


  #we'll send playlist-associated tracks
  def show
    @playlist = Playlist.find(params[:id])
    begin
    @tracks = Track.where(id: @playlist.track_ids)
    rescue ActiveRecord::RecordNotFound
      #TODO: if error, sync tracks w/ @playlist.track_ids -- rebuild
      render :json => {:errors => "missing track"}
      return
    end
    render :json => @tracks
  end


  def create
    @playlist = current_user.playlists.build(new_params)
    if @playlist.save
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => @playlist
    else
      render :json => {:errors => @playlist.errors.messages}
    end
  end

  #accepts :track => a single track_id or :playlist => xx params
  def update
    begin
    @playlist = current_user.playlists.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render :json => {:errors => "invalid playlist"}
      return
    end

    if @playlist.update_attributes(track_params(@playlist))
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => @playlist.with_track_preview, :methods => [:track_previews]
    else
      render :json => {:errors => @playlist.errors.messages}
    end

  end

  #/users/user_id/playlists/playlist_id
  def destroy
    begin
    @playlist = current_user.playlists.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render :json => {:errors => "invalid playlist"}
      return
    end
     
    if @playlist.destroy
      Rails.cache.delete_matched("search-playlists/#{current_user.id}/*")
      render :json => {:success => "playlist destroyed"}
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

  #this is UGLY but pg array saving behavior is really strange
  def _parse_track_id_params
    #we aren't updating track_ids 
    if params[:playlist].has_key?(:track_ids)

      #case: they've deleted the last track in a playlist
      if params[:playlist][:track_ids].nil?
        _params = new_params
        _params[:track_ids] = []
        return _params

      #track_ids are updated (deleted any)
      else
        _params = new_params
        _params[:track_ids] = Array.new(params[:playlist][:track_ids])
        return _params
      end
    end

    #otherwise they've updated other stuff (name, description)
    return new_params
  end

end
