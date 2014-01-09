class ChangeCommentInTracksToText < ActiveRecord::Migration
  def change
    change_column :tracks, :comment, :text
  end
end
