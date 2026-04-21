# server build stage ****************************************
FROM node:24-alpine AS server-builder

# create & set app to working dir
WORKDIR /app

# copy package.json and package-lock.json into /app/server
COPY /server/package*.json ./server/

# install dependencies in server
RUN cd server && npm install

# copy server & shared, preserve structure for imports to resolve
COPY server/ ./server/
COPY shared/ ./shared/

# build serve
RUN cd server && npm run build

# client build stage ****************************************
FROM node:24-alpine AS client-builder

# create & set app to working dir
WORKDIR /app

# copy package.json and package-lock.json from client
COPY /client/package*.json ./client/

# install dependencies in client
RUN cd client && npm install

# copy client & shared, preserve structure for imports to resolve
COPY client/ ./client/
COPY shared/ ./shared/

# build client
RUN cd client && npm run build


# production build stage ****************************************
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# copy only the build dir from server-builder
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/package*.json ./

# install runtime dependencies
RUN npm clean-install

# copy only the build dir from client-builder into /app/public, serve from express backend
COPY --from=client-builder /app/client/build/client ./public

# expose port 3000
EXPOSE 3000

# start server
CMD ["node", "dist/index.js"]
