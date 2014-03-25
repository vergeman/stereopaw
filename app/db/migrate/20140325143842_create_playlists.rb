class CreatePlaylists < ActiveRecord::Migration
  def change
    create_table :playlists do |t|
      t.string :name
      t.text :description
      t.integer :track_ids, array: true, default: []
      t.integer :user_id
      t.timestamps
    end
  end
end
