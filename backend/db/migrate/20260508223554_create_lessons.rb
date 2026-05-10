class CreateLessons < ActiveRecord::Migration[8.1]
  def change
    create_table :lessons do |t|
      t.string :title
      t.string :status
      t.string :video_url
      t.integer :course_id

      t.timestamps
    end
  end
end
