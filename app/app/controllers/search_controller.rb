require 'uri'

class SearchController < ApplicationController
  before_filter :authenticate_user!, only: [:mytracks, :playlists]

  def show
    respond_to do |format|

      format.json {
        tracks = Search.tracks_by_meta(query_params, page_params)
        render :json => tracks
      }

      format.html { redirect_to '/meow#search' }
    end

  end


  def mytracks
    respond_to do |format|

      format.json { 
        tracks = Search.tracks_by_meta_and_user(query_params, current_user.id, page_params)
        render :json => tracks
      }

      format.html { redirect_to '/meow#search' }
    end

  end


  def genres
    respond_to do |format|

      format.json {
        tracks = Search.tracks_by_genre(query_params, page_params)
        render :json => tracks
      }

      format.html { redirect_to '/meow#search' }
    end

  end


  def playlists
    respond_to do |format|

      format.json {
        results = Search.playlists(query_params, current_user)
        render :json => results, :methods => [:track_previews]
      }

      format.html { redirect_to '/meow#search' }
    end
  end



  private

  def page_params
    if params.has_key?(:page) && !params[:page].blank?
      return params.require(:page) ? params[:page].to_i : 0
    end

    return 0
  end

  def query_params
    if params.has_key?(:q) && !params[:q].blank?
      return params.require(:q) 
    end

    return "[]"
  end


end
