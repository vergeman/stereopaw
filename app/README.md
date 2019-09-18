# Stereopaw API and Backbone.js SPA

* ENV: .env, .env.production need to be symlinked into repo before
running app.  see .env.example for necessary variables

* delayed_job workers: these process submissions once received by
  Rails; if new tracks aren't showing up, it might be the case that
  there are no running workers.

```
#
# dev env: loads db +  rails app stack
#

sudo docker-compose up


# deploy to prod
# run capitastrano with ssh forwarding
# might need to add the key to keyring (ssh-add)
# .env are symlinked

sudo docker-compose run -e "SSH_AUTH_SOCK=/ssh-agent" \
    -v $SSH_AUTH_SOCK:/ssh-agent web bundle exec cap production deploy


#
# misc helpful dev commands
#

sudo docker-compose run web bash

sudo docker-compose build


```
