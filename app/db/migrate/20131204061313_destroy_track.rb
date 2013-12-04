class DestroyTrack < ActiveRecord::Migration
  def change
    drop_table :tracks
  end
end
