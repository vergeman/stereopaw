class AddCopyToTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :copy, :boolean, default: false
  end
end
