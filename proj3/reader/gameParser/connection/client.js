/**
* Client
* @constructor
*/

function Client(){
  console.log("Initiating Client");
}

Client.prototype.constructor=Client;

Client.prototype.getPrologRequest= function(requestString, onSuccess, onError, port){
	var requestPort = port || 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+ requestPort + '/' + requestString, false);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};