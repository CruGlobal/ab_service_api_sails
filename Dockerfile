##
## digiserve/ab-api-sails:master
##
## This is our microservice for handling all our incoming AB
## api requests.
##
## Security: image runs as non-root user (node). --inspect is enabled only
## when NODE_ENV is not production (see docker-entrypoint.sh).
##
## Docker Commands:
## ---------------
## $ docker build -t digiserve/ab-api-sails:master .
## $ docker push digiserve/ab-api-sails:master
##
## Multi-platform (M1/M2/M3 Mac → amd64 + arm64):
## $ docker buildx create --use  # once, if no builder
## $ docker buildx build --provenance=true --sbom=true --platform linux/amd64,linux/arm64 -t digiserve/ab-api-sails:master --push .
## Or use: $ DOCKER_ARGS="--platform linux/amd64,linux/arm64 --push" ./build.sh
## Supply chain: use --provenance=true --sbom=true when pushing to a registry for Docker Hub attestations and license visibility.
##

ARG BRANCH=master

FROM digiserve/service-cli:${BRANCH}

# OCI labels for Docker Hub / Scout (license, description)
LABEL org.opencontainers.image.title="AB API Sails" \
   org.opencontainers.image.description="Microservice for handling incoming AppBuilder API requests" \
   org.opencontainers.image.licenses="MIT"

COPY . /app

WORKDIR /app

# Reproducible install; use npm i -f only if npm ci fails (e.g. peer deps)
RUN npm ci && npm cache clean --force

ENV NODE_ENV=production

# Security: run as non-root (base image should provide node user)
RUN chown -R node:node /app
USER node

# Entrypoint enables --inspect only when NODE_ENV != production
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["app_waitMysql.js"]
