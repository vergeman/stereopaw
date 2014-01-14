class AddshareabletoTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :shareable, :boolean
  end
end
