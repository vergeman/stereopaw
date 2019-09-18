#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /stereopaw/app/tmp/pids/server.pid

# init / update app
cd /stereopaw/app
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake assets:precompile

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
