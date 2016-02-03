#!/bin/bash


ssh -q excavator.lx bash <<'EOF'
PID=$(ps aux|pgrep launcher)

if [ -z "$PID" ];then
echo 'need to start the digger'
exit
fi

strace -p $PID -s 9999 -e write 2>&1
EOF