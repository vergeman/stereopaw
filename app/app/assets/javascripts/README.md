# Backbone App

* The _/routers_ subdirectory gives an overview of the SPA.
* Many of the components rely on a global event bus, where components
  listen to a variety of triggers.
* Backbone Views use JST templates found in
  _app/assets/javascripts/templates/_, which are preprocessed by
  haml-coffee-assets. For some reason I thought was a good idea.

The Rails app contains CRUD endpoints for the various models, and a
bunch of setup to use devise with a SPA app. There's also some some
additional search logic that uses *pg_search*.
