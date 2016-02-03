#!/bin/bash
read TOG

case $TOG in
	 start) ssh excavator.lx "export DISPLAY=:0;killall launcher;nohup ~/work/volvo-remote-controlled-excavator/excavator.sh > foo.out 2> foo.err < /dev/null &";;
	 stop) ssh excavator.lx "killall launcher";;
esac
