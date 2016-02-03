//$(document).ready(strOut);

	function strOut(){
		var ws = new WebSocket('ws://10.97.40.226:8084');
		ws.onopen = function() {
		};
  		ws.onclose = function() {
  			setTimeout(strOut, 5000);
  		};
  		ws.onmessage = function(event) {
  			if(event.data.indexOf("DEBUG") > -1){
  				if(event.data.indexOf("DEBUG: Set analog out") > -1) {
  					var colValues = event.data.trim().split(/ +/);
  					var title = colValues[5].substr(1);
					title = title.substr(0, title.length-2);
					var pos = colValues[9];				
					pos = pos.substr(0, pos.length-1);
					var neg = colValues[12];

  					document.getElementById('log').textContent += title + '\n';
  					updateScroll('log_parent');
  				}
			}else if(event.data.indexOf('ptrace(PTRACE_ATTACH, ...): Operation not permitted') > -1) {
				//toggleDigger('start');
			}else if (event.data.indexOf('need to start the digger') > -1) {
				//toggleDigger('start');
			}
  		}
	}
	
	function updateScroll(el){
    	var element = document.getElementById(el);
    	element.scrollTop = element.scrollHeight;
	}
	
	function toggleDigger(tog){
		var ws = new WebSocket('ws://10.97.40.226:8081');
		ws.onopen = function() {
			ws.send(tog);
  		};
	}
	
	