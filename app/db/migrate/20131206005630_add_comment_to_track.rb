class AddCommentToTrack < ActiveRecord::Migration
  def change
    add_column :tracks, :comment, :string
  end
end
