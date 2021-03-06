LaughTrack = {
	message:null,
	config:{
		form:'laugh-track',  
		input:'input',  
		output:'laughs',  
		sendTrigger:'send',  
		host:'localhost',  
		port:'10721'
	},
	socket:null,
	time:new Date(),
	clientId:Math.floor(Math.random()*11),
	
	init:function(options) {
		_socket_io = document.createElement('script');
		_socket_io.type = 'text/javascript';
		_socket_io.src = 'http://'+LaughTrack.config.host+':'+LaughTrack.config.port+'/socket.io/socket.io.js';
		_socket_io.onload = function() {
			// Connect to the server
			LaughTrack.connect();

			// Append form elements
			LaughTrack.appendMarkup();

			// Attach click handler
			LaughTrack.sendReady();

			// Add UI
			//LaughTrack.ui();
		};
		
		document.getElementsByTagName('head')[0].appendChild(_socket_io);
	},
	
	connect:function() {
		LaughTrack.socket = new io.Socket(LaughTrack.config.host, { port: LaughTrack.config.port });
		
		// Connect client sockets and log messages to console
		LaughTrack.socket.connect();
		LaughTrack.socket.on('message', function(msg) {
			var laugh = document.createElement('p');
			var contents = '<abbr title="'+msg.time+'">'+new Date(msg.time)+'</abbr><br />'+msg.message;
			
			laugh.innerHTML = contents;
			
			var el = document.getElementById(LaughTrack.config.output);
			
			el.insertBefore(laugh, el.firstChild);
		});
	},
	
	// Add widget to page
	appendMarkup:function() {
		var markup = 	'<a href="#" id="show-laugh-track">Show</a><ul><li><a href="#" id="hide-laugh-track">Hide</a></li><li><a href="#" id="close-laugh-track">Close</a></li></ul>' +
                  '<form>' +
										'<span class="directions">What do you think?</span>' +
										'<textarea id="input"></textarea><br>' +
										'<a id="send" href="#">Add Comment</a>' +
										'<div id="laughs"></div>' +
									'</form>';
										
		var style = 	'span.directions { display:block; font-size:18px; }' +
									'#laugh-track { padding:20px;-moz-box-shadow:-1px -1px 20px #ccc;-webkit-box-shadow: -1px -1px 20px #ccc;box-shadow: -1px -1px 20px #ccc; z-index:9999; position:fixed; bottom:0; right:0; background:#000; opacity:0.3; width:300px; min-height:100px; max-height:300px; overflow-y:auto; }' +
									'#laugh-track:hover { opacity:1; -webkit-transition: opacity .25s linear; transition: opacity .25s linear; }' +
									'#laugh-track.active { opacity:1!important; }' +
                  '#laugh-track span { color:#fff!important; display:block; margin-bottom:10px; font-weight:bold; }' +
                  '#laugh-track ul { margin:0; padding:0; float:right; width:100px; list-style:none; }' +
                  '#laugh-track ul li { display:inline; }' +
									'#laugh-track p { color:#fff!important; }' +
									'#laugh-track small { font-size:0.5em; letter-spacing:1px; }' +
                  '#laugh-track a#show-laugh-track { display:none; float:left; }';
									
		var html = document.createElement('div');
		html.id = 'laugh-track';
		html.innerHTML = markup;
		
		var css = document.createElement('style');
		css.type = 'text/css';
		css.innerHTML = style;
									
		var body = document.getElementsByTagName('body')[0];
									
		body.appendChild(html);
		body.appendChild(css);
	},
	
	// UI animations and interactivity
	ui:function() {
		var lt = document.getElementById(LaughTrack.config.form);
		var input = document.getElementById(LaughTrack.config.input);
		var show = document.getElementById('show-laugh-track');

		function removeClass() {
			console.log('removeClass');
			lt.className = '';
		};
		
		function addClass() {
			console.log('addClass');
			lt.className = 'active';
		};

		input.onFocus = addClass();
		
		input.onBlur = removeClass();
	},
	
	// Add track listeners
	sendReady:function() {
		// Send message through websocket
		function sendMessage(e) { e.preventDefault();
			var input = document.getElementById(LaughTrack.config.input);
			
			// Get message from DOM
			var string = input.value;
		  
			// Reset message to blank
      input.value = '';

			// Construct JSON packet with message and metadata
			LaughTrack.message = {
				message:string,
				from:LaughTrack.clientId,
				time:LaughTrack.time
			};
			
			LaughTrack.socket.send(LaughTrack.message);
		};
		
		// Click handler to send message
		document.getElementById(LaughTrack.config.sendTrigger).addEventListener('click', sendMessage, false);
	}
};
