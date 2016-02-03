#!/bin/bash
read OPER

EXCAVATORLX="10.99.21.10"
EXCAVATORMAC="10.99.21.3"
SJLX="10.99.21.82"
SJMAC="10.99.21.90"
PLLX=""
PLMAC="10.99.21.58"

#case OPER in
#	all) ;;

ssh $EXCAVATORLX "echo 'sysadmin|sudo -S shutdown -r now"

ping