class CreateModelTrack < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :artist
      t.string :title
      t.string :profile_url
      t.string :page_url

      t.decimal :duration
      t.decimal :timestamp
      t.string :timeformat

      t.timestamps
    end
  end
end
