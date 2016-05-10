# export MONGO_URL="mongodb://localhost:27017/pCHIP"

portNum=3100
settingsPath=/projects/sysbio/bmeg_meteor/config/sysbio/settings.json
rootUrl=http://disco.soe.ucsc.edu

if [ -z "$1" ]; then
	# run the app in headless mode
	ROOT_URL=$rootUrl nohup /usr/local/bin/meteor run --port $portNum --settings $settingsPath &
else
	meteor $1 --port $portNum --settings $settingsPath
fi
