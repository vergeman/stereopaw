class AddTopGenresToPlaylist < ActiveRecord::Migration
  def change
    add_column :playlists, :top_genres, :string
  end
end
