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

# Copy the Backend (Express)
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/package*.json ./

# Copy the Frontend SSR Build
COPY --from=client-builder /app/client/build/server ./build/server

# Copy the Frontend Static Assets (CSS, JS, Images)
COPY --from=client-builder /app/client/build/client ./public

# 4. Install production dependencies
RUN npm clean-install

EXPOSE 3000
CMD ["node", "dist/index.js"]