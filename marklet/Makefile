
define DEBUG_CHECK
    @if [ -z $(DEBUG) ]; then \
        echo "\n Argument required: pass DEBUG=false for no console, DEBUG=true for console output \n"; \
	exit 1; \
    fi;
endef

define ENV_CHECK
    @if [ -z $(ENV) ]; then \
        echo "\n Argument required: dev --> ENV=0  / prod --> ENV=1 \n"; \
	exit 1; \
    fi;
endef


#ifeq ($(ENV), dev)
#	HOST=
#else
#	HOST=
#endif

all: clean concatenate build

concatenate:
	$(DEBUG_CHECK)
	$(ENV_CHECK)
#	cat *.js > ./bin/stereopaw.js
	cat stereopaw.js >> ./bin/stereopaw.js
	cat Util.js >> ./bin/stereopaw.js
	cat Page.js >> ./bin/stereopaw.js
	cat Service.js >> ./bin/stereopaw.js
	cat Track.js >> ./bin/stereopaw.js
	cat Data.js >> ./bin/stereopaw.js
	cat Run.js >> ./bin/stereopaw.js

build:
#	java -jar ./lib/yuicompressor-2.4.8.jar -o ./bin/stereopaw-min.js ./bin/*.js
	uglifyjs ./bin/stereopaw.js -o ./bin/stereopaw-min.js --compress -d "DEBUG=$(DEBUG),ENV=$(ENV)"
	rm ./bin/stereopaw.js
	mv ./bin/stereopaw-min.js ../app/public/

clean:
	rm -f ./bin/*

.PHONY : concatenate build clean
