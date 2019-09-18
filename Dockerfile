FROM ruby:2.3
RUN apt-get update -qq
RUN apt-get install apt-transport-https
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get update -qq && apt-get install -y apt-utils nodejs postgresql-client
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn


WORKDIR /tmp
ADD ./app/Gemfile /tmp/
ADD ./app/Gemfile.lock /tmp/
RUN bundle install

COPY ./app/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

RUN npm install -g grunt

WORKDIR /stereopaw


