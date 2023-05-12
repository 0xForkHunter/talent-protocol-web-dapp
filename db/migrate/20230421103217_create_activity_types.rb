class CreateActivityTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :activity_types do |t|
      t.string :activity_type

      t.timestamps
    end
  end
end
