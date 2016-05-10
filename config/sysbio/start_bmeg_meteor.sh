#!/bin/sh
# 10MAY16 chrisw
# Start BMEG meteor app if it is not running.

HOST_NAME=disco
BMEG_WEBAPP=/projects/sysbio/bmeg_meteor/webapp

if hostname | grep $HOST_NAME > /dev/null
then
  echo "host is $HOST_NAME" > /dev/null
else
  echo "BMEG app is served from $HOST_NAME. This machine is `hostname`. Exit."
  exit
fi

if ps -Af | grep -v 'grep' | grep $BMEG_WEBAPP | grep -v 'mongod' > /dev/null
then
  echo "$BMEG_WEBAPP running" > /dev/null
else
  echo "$BMEG_WEBAPP needs to be started"
  cd $BMEG_WEBAPP && bash $BMEG_WEBAPP/../config/sysbio/run.sh
fi

