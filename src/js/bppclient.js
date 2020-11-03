const signalR = require("@aspnet/signalr");

export class bppclient {
    _channelID = undefined;
    _userID = undefined;
    _userName = undefined;
    connection = undefined;
    _room = undefined;


    constructor(channelID, userID, username) {
        this._channelID = channelID;
        this._userID = userID;
        this._userName = username;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5000/chat", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        this.connection.on("UserJoined", function(userID, userName){
            console.log(userName + " joined!");
        });
    
        this.connection.on("OnJoinData", function(){
            fetch("http://localhost:5000/Rooms/" + channelID).then(response => response.json()).then(data => this._room = data);
        }.bind(this));

        this.connection.start()
            .then(() => this.connection.invoke("JoinRoom", channelID, userID, username));
    }

    sendMessage(message) {
        this.connection.invoke("SendMessage", _userID, channelID, message);
    }
}