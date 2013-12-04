class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :tite
      t.string :artist
      t.string :profile_url
      t.string :page_url
      t.decimal :elapsed
      t.string :duration
      t.integer :timestamp

      t.timestamps
    end
  end
end
