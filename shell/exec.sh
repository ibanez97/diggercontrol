#!/bin/bash
killall websocketd

PATHTOHTML="/home/expuser/excavator/html"
PATHTOSHELL="/home/expuser/excavator/shell"

websocketd --port=8080 --staticdir=$PATHTOHTML $PATHTOSHELL/excavator.gstreamer.sh &
websocketd --port=8081 --devconsole $PATHTOSHELL/excavator.control.sh &
websocketd --port=8082 --devconsole $PATHTOSHELL/firewall.status.sh &
websocketd --port=8084 --devconsole $PATHTOSHELL/excavator.strace.sh
