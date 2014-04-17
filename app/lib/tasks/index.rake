require 'rake'

task :index do
  puts "Rebuild pg_search index [Track]"
  Rake::Task["pg_search:multisearch:rebuild"].invoke("Track")
end
