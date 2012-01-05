class CreateErrors < ActiveRecord::Migration
  def self.up
    create_table :errors do |t|
      t.string :error, :default => ''
      t.datetime :when, :default => Time.now
    end
  end

  def self.down
    drop_table :errors
  end
end
