class Search

  def self.tracks_by_meta(query, page)
    Track.search_by_meta(query).limit(10).offset(page * 10).as_json(except: track_exceptions)
  end


  def self.tracks_by_meta_and_user(query, current_user_id, page)
    Track.search_by_meta(query).where(user_id: current_user_id).limit(10).offset(page * 10).as_json(except: track_exceptions)
  end


  def self.tracks_by_genre(query, page)
    Track.search_by_genre(query).limit(10).offset(page * 10).as_json(except: track_exceptions)
  end


  def self.playlists(query, current_user)
    results = Array.new
    ###
    #search playlists for name/description matches to query
    ###
    searched_playlists = Playlist.search_by_descriptions(query).where(user_id: current_user.id)

    current_user.playlists.each do |p|

      ###
      #find any playlists with track preview matches to query
      ###

      result = p.with_track_preview({query: query})

      if p.track_previews.empty?
        search_result = searched_playlists.where(id: p.id).first
        results.push(search_result.with_track_preview) unless search_result.nil?
      else
        results.push(result)
      end

    end

    results
  end



  private

  def self.track_exceptions
    [:submit_id, :user_id, :updated_at, :shareable, :pg_search_rank]
  end

end
