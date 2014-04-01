class ChangeTopGenresInPlaylistToArray < ActiveRecord::Migration
  def change
    remove_column :playlists, :top_genres
  end
end
