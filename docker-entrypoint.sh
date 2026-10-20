#!/bin/sh
# Like the stock node image entrypoint: if the first arg is a flag or not a
# command (e.g. "app.js"), run it with node. This lets both "app.js" and
# "node app.js" work as the container command.
if [ "${1#-}" != "$1" ] || [ -z "$(command -v "$1")" ]; then
  set -- node "$@"
fi
# Use --inspect only when NODE_ENV is not production (e.g. development, test).
# In production we avoid exposing the debugger on the network.
if [ "$1" = "node" ] && [ "$NODE_ENV" != "production" ]; then
  shift
  set -- node --inspect=0.0.0.0:9229 "$@"
fi
exec "$@"
