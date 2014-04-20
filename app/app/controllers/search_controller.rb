class SearchController < ApplicationController
  before_filter :authenticate_user!, only: [:mytracks]

  def show
    tracks = PgSearch.multisearch(query_params).limit(10).offset(page_params * 10)
      .map(&:searchable)
    render :json => tracks
  end


  def mytracks
    tracks = PgSearch.multisearch(query_params).limit(10).offset(page_params * 10)
      .select { |doc| doc.searchable.user_id == current_user.id }
      .map(&:searchable)

    render :json => tracks
  end


  def playlists
  end

  def page_params
    params.require(:page) ? params[:page].to_i : 0
  end

  def query_params
    params.require(:q)
  end


end
