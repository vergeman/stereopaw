class AddTopGenresArrayToPlaylist < ActiveRecord::Migration
  def change
    add_column :playlists, :top_genres, :string, array:true, default: '{}'
  end
end
