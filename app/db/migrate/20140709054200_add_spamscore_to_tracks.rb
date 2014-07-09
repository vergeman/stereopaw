class AddSpamscoreToTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :spamscore, :integer, default: 0
  end
end
