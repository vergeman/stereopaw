# config valid only for Capistrano 3.1
lock '3.2.1'

require 'dotenv'
Dotenv.load



set :application, 'stereopaw'
set :repo_url, 'git@github.com:vergeman/stereopaw.git'
set :user, "ubuntu"
set :ssh_options, { :forward_agent => true }

#REPO
set :repository, "git@github.com:vergeman/stereopaw.git"
set :scm, :git
set :branch, "master"
set :subdir, "app"

set :delayed_job_command, "bin/delayed_job"

# Default branch is :master
#ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

# Default deploy_to directory is /var/www/my_app
set :deploy_to, ENV['DEPLOY_DIR']

#ssh_options[:forward_agent] = true
#ssh_options[:auth_methods] = ["publickey"]
#ssh_options[:keys] = []


# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, %w{.env .env.staging .env.production scottishfold.key ssl-bundle.crt}

# Default value for linked_dirs is []
#set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

#RVM
set :rvm_type, :user                     # Defaults to: :auto
#set :rvm_ruby_version, '2.0.0-p247'      # Defaults to: 'default'
set :default_env, { rvm_bin_path: '~/.rvm/bin' }

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end


  after :updating, :checkout_subdir
end


after 'deploy:publishing', 'deploy:restart'           
namespace :deploy do
  task :restart do
    invoke 'delayed_job:stop'
    #invoke 'delayed_job:start'
    invoke 'delayed_job:restart'    
  end                                                
end

