all: clean concatenate build

concatenate:
#	cat *.js > ./bin/stereopaw.js
	cat stereopaw.js >> ./bin/stereopaw.js
	cat Util.js >> ./bin/stereopaw.js
	cat Page.js >> ./bin/stereopaw.js
	cat Service.js >> ./bin/stereopaw.js
	cat Track.js >> ./bin/stereopaw.js
	cat Data.js >> ./bin/stereopaw.js
	cat Run.js >> ./bin/stereopaw.js

build:
	java -jar ./lib/yuicompressor-2.4.8.jar -o ./bin/stereopaw-min.js ./bin/*.js
	rm ./bin/stereopaw.js

clean:
	rm -f ./bin/*

.PHONY : concatenate build clean
