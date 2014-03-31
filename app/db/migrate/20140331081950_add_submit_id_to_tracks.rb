class AddSubmitIdToTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :submit_id, :integer
  end
end
