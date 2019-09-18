# stereopaw Marklet

Builds respective versions into _../app/public_: the rails app static
files directory.

The marklet is a simple loop that polls for metadata, and auto
populates to stereopaw on submit.

This marklet contains:
* the [audio service logic](src/Data.js): Data.js
* [browser panel](src/Page.js): Page.js
* [form submission](src/stereopaw.js) and runtime loop

Generated build artifact is ```stereopaw.min.js``` in the rails public
directory, to be served on extension click.


```
#dev
grunt

#prod
grunt prod
```

Marklet updates need to be built and committed to master since
deploys are based off the most recent commit.

. . . should probably change that.
