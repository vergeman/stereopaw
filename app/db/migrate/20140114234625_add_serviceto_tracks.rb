class AddServicetoTracks < ActiveRecord::Migration
  def change
    add_column :tracks, :service, :string
  end
end
