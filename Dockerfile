FROM node:16
WORKDIR ./
COPY . .
 
RUN rm package-lock.json
RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN apt-get update && apt-get install python -y && apt-get install python2 -y
RUN apt-get -y install gcc
RUN npm install --legacy-peer-deps
# RUN npm uninstall node-sass
# RUN npm install sass --legacy-peer-deps
 
 
EXPOSE 8080
CMD ["npm", "start"]