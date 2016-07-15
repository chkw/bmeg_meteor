# dockerize the bmeg_meteor webapp
# docker node version should match the node version of the build
# run the image with something like:
# docker run -p 3000:3000 -e ROOT_URL="http://localhost" -e bmeg_ip="http://bmeg.io" bmeg/web-portal

FROM node:0.10.46
MAINTAINER chrisw

# install Meteor
RUN apt-get update
RUN apt-get install -y curl
RUN curl https://install.meteor.com | /bin/sh

# expose ports from container to host
EXPOSE 3000
ENV PORT 3000

# copy meteor build into image
COPY ./build ./build
WORKDIR ./build/bundle/programs/server

# node install app
RUN npm install

# go to webapp bundle dir
WORKDIR /build/bundle

# default command
CMD ["node", "main.js"]
