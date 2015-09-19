var net = require('net');
var client = new net.Socket();

var HP_HOST = "52.21.130.230", HP_PORT = 12321;
var ORIGIN_CLIENT = "this_is_vuga_client";

var json_for_hp = {
	origin: ORIGIN_CLIENT,
	phone: "2507222",
	amount: "1",
};

client.connect(HP_PORT, "localhost", function(){

	client.write( JSON.stringify(json_for_hp) );

});

client.on('data', function(data){

	console.log(data+"");
	client.destroy();

});