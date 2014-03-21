class AddPlaysToTrack < ActiveRecord::Migration
  def change
    add_column :tracks, :plays, :integer
  end
end
