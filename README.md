# bmeg_meteor

# Docker

The Docker image for the built Meteor app is available on Docker Hub as `bmeg/web-portal`. To run it, you'll do something like `docker run -p 3100:3000 -e ROOT_URL="http://localhost" -e bmeg_ip="http://bmeg.io" bmeg/web-portal`. In the example:

- The guest will communicate through port `3100` of the host.
- The BMEG GAEA server is at `http://bmeg.io`.
