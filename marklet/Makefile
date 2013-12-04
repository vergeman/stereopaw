all: clean concatenate build

concatenate:
#	cat *.js > ./bin/SoundByte.js
	cat SoundByte.js >> ./bin/SoundByte.js
	cat Util.js >> ./bin/SoundByte.js
	cat Page.js >> ./bin/SoundByte.js
	cat Service.js >> ./bin/SoundByte.js
	cat Track.js >> ./bin/SoundByte.js
	cat Data.js >> ./bin/SoundByte.js
	cat Run.js >> ./bin/SoundByte.js

build:
	java -jar ./lib/yuicompressor-2.4.8.jar -o ./bin/SoundByte-min.js ./bin/*.js
	rm ./bin/SoundByte.js

clean:
	rm -f ./bin/*

.PHONY : concatenate build clean
