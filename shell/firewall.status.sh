#!/bin/bash
read OPER

case $OPER in
	get) curl -s -u diggerapi:6KGvJNtB47Hdw88Y http://diggerfwapi.explab.com/digger/v1.0/policies;;
	pl) curl -s -u diggerapi:6KGvJNtB47Hdw88Y -H "Content-Type: application/json" -X PUT --data '{"status":"disable"}' http://diggerfwapi.explab.com/digger/v1.0/policies/104
		curl -s -u diggerapi:6KGvJNtB47Hdw88Y -H "Content-Type: application/json" -X PUT --data '{"status":"enable"}' http://diggerfwapi.explab.com/digger/v1.0/policies/103;;
	sj)curl -s -u diggerapi:6KGvJNtB47Hdw88Y -H "Content-Type: application/json" -X PUT --data '{"status":"disable"}' http://diggerfwapi.explab.com/digger/v1.0/policies/103
		curl -s -u diggerapi:6KGvJNtB47Hdw88Y -H "Content-Type: application/json" -X PUT --data '{"status":"enable"}' http://diggerfwapi.explab.com/digger/v1.0/policies/104;;
esac