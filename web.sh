#!/bin/sh

backend/build/install/backend/bin/backend serve 8080 &

nginx -g 'daemon off; error_log /dev/stdout info;'
