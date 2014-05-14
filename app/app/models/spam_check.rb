class SpamCheck
  include Rakismet::Model
=begin
Calls akismet and toggles a track if it is spam-free

author        : name submitted with the comment
author_url    : URL submitted with the comment
author_email  : email submitted with the comment
comment_type  : Defaults to comment but you can set it to trackback, pingback, or something more appropriate
content       : the content submitted
permalink     : the permanent URL for the entry the comment belongs to
user_ip       : IP address used to submit this comment
user_agent    : user agent string
referrer      : referring URL (note the spelling)
=end

  attr_accessor :user, :track, :user_ip, :user_agent, :referrer

  rakismet_attrs :author_email => proc { @user.email },
  :comment_type => "comment", :content => proc { @track.comment }


  def initialize(user, track, user_ip, user_agent, referrer)
    @user = user
    @track = track
    @user_ip = user_ip
    @user_agent = user_agent
    @referrer = referrer
  end

  #calls akismet and determines if spam
  def check
    Rails.logger.debug("==AKISMET CHECK==")

    if !self.spam?
      track = Track.find(@track)
      track.spam = false
      track.save
    end

    Rails.logger.debug(self.akismet_response)
    self.akismet_response
  end

end
