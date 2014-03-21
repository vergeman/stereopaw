class ChangeGenresinTracksDefault < ActiveRecord::Migration
  def change
    change_column :tracks, :genres, :string, array:true, default: '{}'
  end
end
