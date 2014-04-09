# Supported options: :resque, :sidekiq, :delayed_job
Devise::Async.enabled = true # | false
Devise::Async.backend = :delayed_job
