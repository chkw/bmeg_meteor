# Taken from dockerBuild.sh for patient_pchips

# I can't get `meteor build` to run within the docker file so I'm just doing
# the build before running docker build
cd webapp
meteor build --directory ../build

cd ..
docker build --tag bmeg/web-portal .
