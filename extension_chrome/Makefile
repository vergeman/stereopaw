
define DEBUG_CHECK
    @if [ -z $(DEBUG) ]; then \
        echo "\n Argument required: pass DEBUG=false for no console, DEBUG=true for console output \n"; \
	exit 1; \
    fi;
endef


all: clean build

build:
	$(DEBUG_CHECK)

	uglifyjs ./bg.js -o ./bin/bg.js --compress -d "DEBUG=$(DEBUG)"
	uglifyjs ./content.js -o ./bin/content.js --compress -d "DEBUG=$(DEBUG)"
#	cp ./popup.js ./bin/popup.js
	uglifyjs ./popup.js -o ./bin/popup.js --compress -d "DEBUG=$(DEBUG)"
	cp manifest.json ./bin/
	cp *.png ./bin/
	cp jquery.min.js ./bin/
	cp popup.html ./bin/
	cp popup.css ./bin/

clean:
	rm -f ./bin/*

.PHONY : build clean
