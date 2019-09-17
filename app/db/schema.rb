# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140711083442) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ar_internal_metadata", id: false, force: true do |t|
    t.string   "key",        limit: nil, null: false
    t.string   "value",      limit: nil
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",               default: 0, null: false
    t.integer  "attempts",               default: 0, null: false
    t.text     "handler",                            null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by",  limit: nil
    t.string   "queue",      limit: nil
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "playlists", force: true do |t|
    t.string   "name",        limit: nil
    t.text     "description"
    t.integer  "track_ids",               default: [], array: true
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "top_genres",  limit: nil, default: [], array: true
  end

  create_table "tracks", force: true do |t|
    t.string   "artist",      limit: nil
    t.string   "title",       limit: nil
    t.string   "profile_url", limit: nil
    t.string   "page_url",    limit: nil
    t.decimal  "duration"
    t.decimal  "timestamp"
    t.string   "timeformat",  limit: nil
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "comment"
    t.string   "track_id",    limit: nil
    t.boolean  "shareable"
    t.string   "service",     limit: nil
    t.string   "artwork_url", limit: nil
    t.integer  "user_id"
    t.string   "genres",      limit: nil, default: [],    array: true
    t.integer  "plays",                   default: 0
    t.integer  "submit_id"
    t.boolean  "spam",                    default: true
    t.integer  "spamscore",               default: 0
    t.boolean  "copy",                    default: false
  end

  add_index "tracks", ["genres"], name: "index_tracks_on_genres", using: :gin

  create_table "users", force: true do |t|
    t.string   "email",                  limit: nil, default: "", null: false
    t.string   "encrypted_password",     limit: nil, default: "", null: false
    t.string   "reset_password_token",   limit: nil
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: nil
    t.string   "last_sign_in_ip",        limit: nil
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "reported_list",                      default: [], null: false, array: true
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
