class AddReportedListToUsers < ActiveRecord::Migration
  def change
    add_column :users, :reported_list, :integer, array:true, null:false, default: []
  end
end
