class CreateWorks < ActiveRecord::Migration
  def self.up
    create_table :works do |t|
      t.string :json, :default => '[]'
    end
  end

  def self.down
    drop_table :works
  end
end
