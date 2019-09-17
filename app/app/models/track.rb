# == Schema Information
#
# Table name: tracks
#
#  id          :integer          not null, primary key
#  artist      :string
#  title       :string
#  profile_url :string
#  page_url    :string
#  duration    :decimal(, )
#  timestamp   :decimal(, )
#  timeformat  :string
#  created_at  :datetime
#  updated_at  :datetime
#  comment     :text
#  track_id    :string
#  shareable   :boolean
#  service     :string
#  artwork_url :string
#  user_id     :integer
#  genres      :string           default([]), is an Array
#  plays       :integer          default(0)
#  submit_id   :integer
#  spam        :boolean          default(TRUE)
#  spamscore   :integer          default(0)
#  copy        :boolean          default(FALSE)
#
# Indexes
#
#  index_tracks_on_genres  (genres)
#

require 'sanitize'

class Track < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search_by_meta, :against => [:artist, :title, :genres, :service, :comment], :order_within_rank => "tracks.created_at DESC"
  pg_search_scope :search_by_genre, :against => [:genres], :order_within_rank => "tracks.created_at DESC"

  belongs_to :user

  validates :artist, :title, :page_url, :profile_url, :shareable, :service, :artwork_url, :submit_id, presence: true

  validates :profile_url, :page_url, :artwork_url, url: true #/validators/UrlValidator

  validates :duration, :timestamp, numericality: true
  validate :timeformat_less_than_duration
  validates :plays, numericality: { only_integer: true, :greater_than_or_equal_to => 0 }
  validates :spamscore, numericality: { only_integer: true, :greater_than_or_equal_to => 0 }

  validates_format_of :timeformat, :with => /\A^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$\Z/

  validates :comment, length: { maximum: 1000 }
  before_save :capitalize_genres
  before_validation :default_values, :on => :create

  #
  ## Class foos
  #

  #get popular wrapper
  def self.get_popular(page, current_user)
=begin
    follow hacker news ranking for starters
    seems to give to much weight to 'new'
    score = (p - 1) / (t + 2)^1.2
    where p = plays (points) and t = age in hours
=end
    if current_user && current_user.reported_list.length > 0
      tracks = self._get_popular_logged_in(page, current_user)
    else
      tracks = self._get_popular_logged_out(page)
    end

    return tracks
  end

  def self._get_popular_logged_out(page)
    query = "SELECT *, " \
    "t.plays / (POW(( ( (SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP(0))) - (SELECT EXTRACT(EPOCH FROM t.created_at)) ) / 3600) + 2, 1.2)) as score " \
    "FROM tracks t " \
    "WHERE t.spam = false AND t.copy = false " \
    "ORDER BY score " \
    "DESC LIMIT 10 OFFSET ?";

    return Track.find_by_sql([query, page * 10])
  end

  def self._get_popular_logged_in(page, current_user)
    query = "SELECT *, " \
    "t.plays / (POW(( ( (SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP(0))) - (SELECT EXTRACT(EPOCH FROM t.created_at)) ) / 3600) + 2, 1.2)) as score " \
    "FROM tracks t " \
    "WHERE t.spam = false AND t.copy = false AND t.id NOT IN (?)" \
    "ORDER BY score " \
    "DESC LIMIT 10 OFFSET ?";

    return Track.find_by_sql([query,
                              current_user.reported_list,
                              page * 10])
  end


  #/new
  def self.get_latest(page, current_user)

    if current_user && current_user.reported_list.length > 0
      tracks = Track.where('spam = false AND copy=false AND id not in (?)', current_user.reported_list).order('created_at DESC').limit(10).offset(page * 10)
    else
      tracks = Track.where('spam = false AND copy=false').order('created_at DESC').limit(10).offset(page * 10)
    end

    return tracks
  end

  #my tracks
  def self.my_tracks(page, current_user)
    return current_user.tracks.order("created_at DESC").limit(10).offset(page * 10)
  end

  #add tracks to users 'collection' from pre-existing submission
  def self.add(current_user_id, track_id)
    track = Track.find(track_id)
    track_copy = Track.create(track
                                .attributes
                                .merge({
                                         "id" => nil,
                                         "copy" => true,
                                         "user_id" => current_user_id,
                                         "plays" => 0,
                                         "created_at" => DateTime.now.utc,
                                         "spam" => false
                                       })
                              )
    return track_copy
  end

  #find track utility
  def self.find_tracks(source, track_find_params)
    return source.find(track_find_params)
  end

  #PLAY
  def self.augment_plays(source, track_find_params)
    track = self.find_tracks(source, track_find_params)
    track[:errors] ? track : track.played.played_json
  end


  #
  ## Model Methods
  #

  #override to hide some data
  def as_json(options={})
    options[:except] ||= [:submit_id, :updated_at, :shareable, :spamscore]
    super
  end


  def default_values
    self.timestamp ||= 0
    self.duration ||= 0
    self.submit_id ||= self.user_id
  end


  def played
    self.update_attributes(:plays => self.plays + 1)
    return self
  end
  

  def played_json
    return {:track => {:id => self.id, :plays => self.plays} }
  end  


  def reported(current_user)
    self.update_attributes(:spamscore => self.spamscore + 1)
    current_user.add_track_to_reported_list(self.id)
    self.mark_spam?
    return {:success => "track reported"}
  end


  #flag as spam if spamscore > 3
  def mark_spam?
    self.update_attributes(:spam => true) if self.spamscore >= 3
  end


  def calculate_age
    diff = (Time.now - self.created_at)

    if (diff / 1.minutes) < 60
      return (diff / 1.minutes).round.to_s + "m"
    elsif (diff / 1.hours) <= 24
      return (diff / 1.hours).round.to_s + "h"
    else
      return self.created_at.strftime("%b %-d")
    end

  end


  def capitalize_genres
    self.genres = self.genres.map{|g| g.split.map(&:capitalize).join(" ")}
  end

  #timeformat is just a time-formatted timestamp value,
  #so we check timestamp for ease
  def timeformat_less_than_duration
    if (self.timestamp > self.duration)
      errors.add(:timeformat, "exceeds duration")
    end
  end

end
