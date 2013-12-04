class ChangeDurationInTrackToDecimal < ActiveRecord::Migration
  def change
    remove_column :tracks, :duration
    add_column :tracks, :duration, :decimal
  end
end
