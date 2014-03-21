class Addgenrestotracks < ActiveRecord::Migration
  def change
    add_column :tracks, :genres, :string, array: true
    add_index  :tracks, :genres, using: 'gin'
  end
end
