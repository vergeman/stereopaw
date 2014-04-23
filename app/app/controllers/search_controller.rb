class SearchController < ApplicationController
  before_filter :authenticate_user!, only: [:mytracks, :playlists]

  def show
    tracks = Track.search_by_meta(query_params).limit(10).offset(page_params * 10)

    render :json => tracks, except: [:pg_search_rank]
  end


  def mytracks
    tracks = Track.search_by_meta(query_params).where(user_id: current_user.id).limit(10).offset(page_params * 10)

    render :json => tracks, except: [:pg_search_rank]
  end


  def playlists
    results = Array.new

    #search playlists for name/description matches to query
    searched_playlists = Playlist.search_by_descriptions(query_params).where(user_id: current_user.id)


    current_user.playlists.each do |p|

      #find any playlists with track preview matches to query
      result = p.with_track_preview({query: query_params})

      if p.track_previews.empty?
        search_result = searched_playlists.where(id: p.id).first
        results.push(search_result.with_track_preview) unless search_result.nil?
      else
        results.push(result)
      end

    end

    render :json => results, :methods => [:track_previews]
  end


  private

  def page_params
    params.require(:page) ? params[:page].to_i : 0
  end

  def query_params
    params.require(:q)
  end


end
