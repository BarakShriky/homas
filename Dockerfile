FROM node:20-alpine as nodeenv
# Required for node-gyp compilation
# Required when Node version doesn't have a precompiled one (using latest node 20)
RUN yarn global add node-gyp
WORKDIR  /usr/src/app/homasapp

COPY server/yarn.lock server/package.json ./
RUN yarn --production

COPY server/rollup* server/obfuscator-options.json server/tsconfig.json server/.babelrc ./

FROM nodeenv as builder
RUN yarn --dev
COPY server/src ./src
RUN yarn run build && rm -rf src/

FROM node:16-alpine as clientbuilder
WORKDIR /usr/src/client
COPY client/.rescriptsrc.js client/cypress.json client/package.json client/tsconfig.json client/yarn.lock ./
RUN yarn --production

COPY client/src ./src

ENV GENERATE_SOURCEMAP false
ARG CLIENT_BUILD_FLAVOR=googlehttpdev

COPY client/public ./public
RUN yarn run build:${CLIENT_BUILD_FLAVOR}


FROM nodeenv
COPY --from=builder /usr/src/app/homasapp/dist ./dist
COPY --from=clientbuilder /usr/src/client/build ./dist/clientApp
WORKDIR  /usr/src/app/homasapp/dist

ENV NODE_ENV production

RUN chown -R node:node /usr/src/app/homasapp
USER node

EXPOSE 80
ENTRYPOINT ["node", "app.js"]
