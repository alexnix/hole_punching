var net = require('net');
var shortid = require('shortid')

var ss = null;
var clients = {};

var ORIGIN_SERVER_CONNECTION = "this_is_ussd_server_connecting", ORIGIN_SERVER_RESPONSE = "this_is_ussd_server_respons", ORIGIN_CLIENT = "this_is_vuga_client";

net.createServer(function(socket){ 
	
	socket.on('data', function(data){
		
		var json_data = JSON.parse(data);
		console.log(json_data.origin);

		if( json_data.origin ==  ORIGIN_SERVER_CONNECTION ) {
			ss = socket;
		}

		if( json_data.origin == ORIGIN_SERVER_RESPONSE ){
			clients[json_data.shortid].write( String(json_data.response) );
			clients[json_data.shortid].destroy();
		}

		if( json_data.origin == ORIGIN_CLIENT && ss){
			var id = shortid.generate();
			var foreward_req = {
				phone: json_data.phone,
				amount: json_data.amount,
				shortid: id,
			};
			ss.write( JSON.stringify(foreward_req) );
			clients[id] = socket;
		}

	});

}).listen(9001, "localhost");