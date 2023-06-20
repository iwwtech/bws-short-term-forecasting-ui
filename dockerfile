FROM node:16-bullseye as build-stage
WORKDIR /usr/src/app  

COPY ./react/package.json ./react/package-lock.json ./
RUN npm install --legacy-peer-deps

COPY ./react . 

# Override dev env variable with prod env variable (note that env variables technically don't exist client side, therefore the hack)
#RUN sed -i '/export const API_BASE_URL/c\export const API_BASE_URL = "https://api.wasserbedarfsprognosen.de";' src/constants/index.js
#RUN npm run build
CMD ["npm", "start"]

# Copy all relevant build files into a new slim nginx container
#FROM nginx:1.23

#COPY --from=build-stage /usr/src/app/build/ /usr/share/nginx/html
