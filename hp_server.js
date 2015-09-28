var net = require('net');
var shortid = require('shortid')

var ss = {
	mtn: null,
	tg: null,
	air: null,
};
var clients = {};

var ORIGIN_SERVER_CONNECTION = "this_is_ussd_server_connecting", ORIGIN_SERVER_RESPONSE = "this_is_ussd_server_respons", ORIGIN_CLIENT = "this_is_vuga_client",
	USSD_MTN = "ussd_mtn", USSD_TG = "ussd_tg", USSD_AIR = "ussd_air";

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

var whichServer = function(PROVIDER){

	if ( PROVIDER == USSD_MTN )
		return "mtn";

	if ( PROVIDER == USSD_AIR )
		return "air";

	if ( PROVIDER == USSD_TG )
		return "tg";

};

var providerByNumber = function(number) {

	if ( number.startsWith("25078") || number.startsWith("078") )
		return "mtn";

	if( number.startsWith("25072")  || number.startsWith("072") )
		return "tg";

	if( number.startsWith("25073") || number.startsWith("073") )
		return "air";

};

net.createServer(function(socket){ 
	
	socket.on('data', function(data){
		
		var json_data = JSON.parse(data);
		console.log(json_data.origin + json_data.provider || '');

		if( json_data.origin ==  ORIGIN_SERVER_CONNECTION ) {
			console.log(whichServer(json_data.provider));
			ss[whichServer(json_data.provider)] = socket;
		}

		if( json_data.origin == ORIGIN_SERVER_RESPONSE ){
			clients[json_data.shortid].write( String(json_data.response) );
			clients[json_data.shortid].destroy();
		}

		if( json_data.origin == ORIGIN_CLIENT && ss[providerByNumber(json_data.phone)]){
			var id = shortid.generate();
			var foreward_req = {
				phone: json_data.phone,
				amount: json_data.amount,
				shortid: id,
			};
			console.log("Forewarding "+json_data.phone + " amount " + json_data.amount + " to " + providerByNumber(json_data.phone) + " server.");
			ss[providerByNumber(json_data.phone)].write( JSON.stringify(foreward_req) );
			clients[id] = socket;
		}

	});

}).listen(12321, "0.0.0.0");