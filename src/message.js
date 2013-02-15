var message = {};

//place holder for developer's callback function for getMessages and getMessage method
var getMessagesCallback;

//place holder for developer's callback function for search by number
var searchByNumberCallback;

//var messageServiceUrl = "https://api.tfoundry.com/a1/messages/messages/";
var messageServiceUrl = "https://api.foundry.att.com/a1/messages/messages/";

// helper function that creates data returned to developer's callback function
constructReturnData = function(data, textStatus) {
	var returnData = {};
	returnData.status = textStatus;
	returnData.data = data;
	return JSON.stringify(returnData);
};

sendMessageSuccess = function(data, textStatus, jqXHR) {
	console.log("success sendMessage. textStatus = "+textStatus);
};

sendMessageError = function(data, textStatus, jqXHR) {
	console.error("error sendMessage. textStatus = "+textStatus);
};

getMessagesSuccess = function(data, textStatus, jqXHR) {
	console.log("success getMessages. textStatus = "+textStatus);

	getMessagesCallback(constructReturnData(data, textStatu));
};

getMessagesError = function(data, textStatus, jqXHR) {
	console.error("error getMessages. textStatus = "+textStatus);

	getMessagesCallback(constructReturnData(data, textStatu));	
};

deleteMessageSuccess = function(data, textStatus, jqXHR) {
	console.log("success deleteMessage. textStatus = "+textStatus);
};

deleteMessageError = function(data, textStatus, jqXHR) {
	console.error("error deleteMessage. textStatus = "+textStatus);
};

searchByNumberSuccess = function(data, textStatus, jqXHR) {
	console.log("success searchByNumber. textStatus = "+textStatus);

	searchByNumberCallback(constructReturnData(data, textStatus));	
};


searchByNumberError = function(data, textStatus, jqXHR) {
	console.log("error searchByNumber. textStatus = "+textStatus);
	
	searchByNumberCallback(constructReturnData(data, textStatus));	
};

// helper function that gets URL, appends access token
getUrl = function(requestedPath) {
	var access_token = window.att.config.apiKey;
	var url = "";
	
	if(requestedPath) {
		url = messageServiceUrl+requestedPath+"/?access_token="+access_token;
	} else {
		url = messageServiceUrl+"?access_token="+access_token;		
	}
	
	console.log("url = "+url);
	
	return url;	
};

message.sendMessage = function(recipient, text) {
	console.log('sending message '+text+' to '+recipient);

	var data = {};
	data.recipient = recipient;
	data.text = text;

	$.ajax({
		type : 'POST',
		url : getUrl(),
		data : JSON.stringify(data),
		success : sendMessageSuccess,
		error : sendMessageError,
		dataType : 'application/json'
	});
};

message.getMessages = function(callback) {
	getMessagesCallback = callback;
	$.ajax({
		type : 'GET',
		url : getUrl(),
		success : getMessagesSuccess,
		error : getMessagesError
	});
};

message.getMessage = function(messageId, callback) {
	getMessagesCallback = callback;
	$.ajax({
		type : 'GET',
		url : getUrl(messageId),
		success : getMessagesSuccess,
		error : getMessagesError
	});
};

message.deleteMessage = function(messageId) {
	$.ajax({
		type : 'DELETE',
		url : getUrl(messageId),
		success : deleteMessageSuccess,
		error : deleteMessageError
	});
};

message.searchByNumber = function(number, callback) {
	searchByNumberCallback = callback;
	$.ajax({
		type : 'GET',
		url : getUrl("filter/"+number),
		success : searchByNumberSuccess,
		error : searchByNumberError
	});
};

att.message = message;