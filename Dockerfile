FROM node:14-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install -g ionic
#adding -f force tag for fsevent platform error 
RUN npm install -f
COPY ./ /app/
RUN npm run-script build
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ /usr/share/nginx/html/
#EXPOSE 5173/tcp
#EXPOSE 5173/udp
#RUN npm run serve-kk
#ionic serve --configuration=docker --host=0.0.0.0
