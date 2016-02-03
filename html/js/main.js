$(document).ready(startUp);
var noout = false;

//Start Page Operation Functions //

	function startUp(){
		pollFW();
		runDigger();
	}

	function startAll(loc){
		diggerCtl(loc);
		toggleDigger('start');
	}
	
	function clearLog(){
		document.getElementById('log').textContent = '';
	}

	function log(msg) {
    	document.getElementById('log').textContent += msg + '\n';
    	updateScroll('log_parent');
  	}
  	
  	function updateScroll(el){
    	var element = document.getElementById(el);
    	element.scrollTop = element.scrollHeight;
	}

// End Page Operation Functions  //

// Start Digger Control Functions //

	function toggleDigger(tog){
		var ws = new WebSocket('ws://10.97.40.226:8081');
		ws.onopen = function() {
			log('sending signal');
			ws.send(tog);
  		};
  		ws.onclose = function(){
  			log(tog + ' command sent');
  			if(tog === 'start'){runDigger();}
  		};
  		ws.onmessage = function(){
  			//log(event.data);
  		}
	}

	function runDigger(){
		var ws = new WebSocket('ws://10.97.40.226:8084');
		ws.onopen = function() {
    		log('Connecting excavator controls');
  		};
  		ws.onclose = function() {
  			log('Disconnecting excavator controls');
  			$('#inactive').show();
  		};
  		
  		ws.onmessage = function(event) {
  			//log('it is seeing events');
  			//log(event.data);
			if(event.data.indexOf("DEBUG") > -1){
  				if(event.data.indexOf("DEBUG: Set analog out") > -1) {
  					$('#inactive').hide();
  					if(event.data.indexOf("SIGTERM (Terminated)") > -1){
  						$('#inactive').show();
  						log('Control stream terminated.')
  					}
  					var colValues = event.data.trim().split(/ +/);
  					var title = colValues[5].substr(1);
					title = title.substr(0, title.length-2);
					var pos = colValues[9];				
					pos = pos.substr(0, pos.length-1);
					var neg = colValues[12];

  					//log(title + ' - ' + pos + ' - ' + neg);
			
					if (pos != 0){
						pos = pos*100;
						pos = Math.round(pos);
						title = title + 'pos';
					}
				
					if (neg != 0){
						neg = neg*100;
						neg = Math.round(neg);
						title = title + 'neg';
					}
					//log(title);
					switch(title){
						case "Boompos":
							var readout = 'boompos';
							var ctlval = pos;
							break;
						case "Armpos":
							var readout = 'armpos';
							var ctlval = pos;
							break;
						case "Bucketpos":
							var readout = 'bucketpos';
							var ctlval = pos;
							break;
						case "Boomneg":
							var readout = 'boomneg';
							var ctlval = neg;
							break;
						case "Armneg":
							var readout  = 'armneg';
							var ctlval = neg;
							break;
						case "Bucketneg":
							var readout = 'bucketneg';
							var ctlval = neg;
							break;
					}

					if (pos != 0 || neg != 0) {
						//var testcount = 0;
						ctlval = ctlval/2;
						//log(readout);
						document.getElementById(readout).style.height = ctlval + '%';
						if(pos != 0){
							var armval = pos;
							var ht = 100 - pos;
						}else if(neg !== 0) {
							var armval = neg;
						}
    				}
				}
			}else if(event.data.indexOf('ptrace(PTRACE_ATTACH, ...): Operation not permitted') > -1) {
				if(noout === false){
					$('#inactive').show();
					//log(event.data);
					log("It's possible that someone else is viewing control status.  Click above to recieve control status.");
					noout = true;
				}
			}else if (event.data.indexOf('need to start the digger') > -1) {
				$('#inactive').show();
				log(event.data);
				//toggleDigger('start');
			}
    		
  		};
	}

	function diggerCtl(loc){
		FWStatus(loc);
		document.getElementById('log').textContent = "";
		if (loc == "pl"){
			log("Video Sending to Plano");
		}else {
			log("Video Sending to San Jose");
		}		
		// setup websocket with callbacks
  		var ws = new WebSocket('ws://10.97.40.226:8080');
  		ws.onopen = function() {
    		//log('CONNECT');
    		ws.send(loc);
  		};
  		ws.onclose = function() {
    		//log('DISCONNECT');
  		};
  		ws.onmessage = function(event) {
    		log(event.data);
    		updateScroll("log_parent");
  		};
	}
	
	function control_output(msg) {
    	document.getElementById('control_output').textContent += msg + '\n';
  	}
  	
// Endg Digger Control Functions //
	
// Start Firewall Functions //

	function FWStatus(oper){
		var ws = new WebSocket('ws://10.97.40.226:8082');
  		ws.onopen = function() {
  			ws.send(oper);
  		};
  		ws.onclose = function() {
  		};
  		ws.onmessage = function(event) {
			if(oper != 'get'){
				FWStatus('get');
				runDigger();
			}else {
				getFWStatus(event);
			}
  		};
	}
	
	function getFWStatus(event){
		$.each($.parseJSON(event.data), function(index, element){
    		$.each(element, function(key, val){
    			var diggerkit = '#diggerkit' + val.diggerkit;
    			control_output(val.description + ' is ' + val.status);
    			if(val.status == "enabled"){
    				$(diggerkit).addClass("loc_status_active");
    			}else {
    				$(diggerkit).removeClass('loc_status_active');
    			}
    		})
    	})
	}
	
	function setFWStatus(oper){
		$.each($.parseJSON(event.data), function(index, element){
    		$.each(element, function(key, val){
    			var diggerkit = '#diggerkit' + val.diggerkit;
    			if(val.status == "enabled"){
    				$(diggerkit).addClass("loc_status_active");
    				//log(val.description + ' is ' + val.status);
    			}else {
    				$(diggerkit).removeClass('loc_status_active');
    			}
    		})
    	})
	}
	
	function pollFW(){
		FWStatus('get');
		setTimeout(pollFW, 30000);
	}
	
	