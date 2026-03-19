#!/bin/sh
# Use --inspect only when NODE_ENV is not production (e.g. development, test).
# In production we avoid exposing the debugger on the network.
if [ "$NODE_ENV" = "production" ]; then
  exec node "$@"
else
  exec node --inspect=0.0.0.0:9229 "$@"
fi
