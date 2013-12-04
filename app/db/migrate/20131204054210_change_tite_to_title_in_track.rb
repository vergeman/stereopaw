class ChangeTiteToTitleInTrack < ActiveRecord::Migration
  def change
    rename_column :tracks, :tite, :title
    remove_column :tracks, :elapsed
  end
end
