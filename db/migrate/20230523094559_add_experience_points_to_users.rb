class AddExperiencePointsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :experience_points_amount, :integer, default: 0, null: false
  end
end
