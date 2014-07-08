# == Schema Information
#
# Table name: tracks
#
#  id          :integer          not null, primary key
#  artist      :string(255)
#  title       :string(255)
#  profile_url :string(255)
#  page_url    :string(255)
#  duration    :decimal(, )
#  timestamp   :decimal(, )
#  timeformat  :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  comment     :text
#  track_id    :string(255)
#  shareable   :boolean
#  service     :string(255)
#  artwork_url :string(255)
#  user_id     :integer
#  genres      :string(255)      default([])
#  plays       :integer          default(0)
#  submit_id   :integer
#  spam        :boolean          default(TRUE)
#
# Indexes
#
#  index_tracks_on_genres  (genres)
#

require 'sanitize'

class Track < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search_by_meta, :against => [:artist, :title, :genres, :service, :comment]
  pg_search_scope :search_by_genre, :against => [:genres]

  belongs_to :user

  validates :artist, :title, :page_url, :profile_url, :shareable, :service, :artwork_url, :submit_id, presence: true

  validates :profile_url, :page_url, :artwork_url, url: true #/validators/UrlValidator

  validates :duration, :timestamp, numericality: true
  validate :timeformat_less_than_duration
  validates :plays, numericality: { only_integer: true, :greater_than_or_equal_to => 0 }
  validates_format_of :timeformat, :with => /\A^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$\Z/

  validates :comment, length: { maximum: 1000 }
  before_save :capitalize_genres
  before_validation :default_values, :on => :create

  #
  ## Model Utlities
  #


  #get popular
  def self.get_popular(page)
=begin
    follow hacker news ranking for starters
    seems to give to much weight to 'new'
    score = (p - 1) / (t + 2)^1.2
    where p = plays (points) and t = age in hours
=end

    query = "SELECT *, " \
    "t.plays / (POW(( ( (SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP(0))) - (SELECT EXTRACT(EPOCH FROM t.created_at)) ) / 3600) + 2, 1.2)) as score " \
    "FROM tracks t " \
    "WHERE t.spam = false " \
    "ORDER BY score " \
    "DESC LIMIT 10 OFFSET ?";

    return Track.find_by_sql([query, page * 10])
    #results.each do |r|
    #  puts "#{r.title} : \t #{r.score}"
    #end
    #return results
  end

  #get track utility
  def self.get_tracks(params, source, conditions, track_order)
    page = params[:page] ? params[:page].to_i : 0
    tracks = source.order(track_order).where(conditions).limit(10).offset(page * 10)
    return tracks
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
    options[:except] ||= [:submit_id, :updated_at, :shareable]
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
