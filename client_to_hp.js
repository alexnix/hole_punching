var net = require('net');
var client = new net.Socket();

var HP_HOST = "localhost", HP_PORT = 9001;
var ORIGIN_CLIENT = "this_is_vuga_client";

var json_for_hp = {
	origin: ORIGIN_CLIENT,
	phone: "250784306298",
	amount: "1000",
};

client.connect(HP_PORT, HP_HOST, function(){

	client.write( JSON.stringify(json_for_hp) );

});

client.on('data', function(data){

	console.log(data+"");
	client.destroy();

});