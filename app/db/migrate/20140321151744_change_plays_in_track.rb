class ChangePlaysInTrack < ActiveRecord::Migration
  def change
    change_column :tracks, :plays, :integer, :default => 0
  end
end
