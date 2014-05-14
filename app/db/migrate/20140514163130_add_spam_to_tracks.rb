class AddSpamToTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :spam, :boolean, :default => true
  end
end
