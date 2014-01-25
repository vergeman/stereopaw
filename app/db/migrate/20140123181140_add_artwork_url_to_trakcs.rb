class AddArtworkUrlToTrakcs < ActiveRecord::Migration
  def change
    add_column :tracks, :artwork_url, :string
  end
end
