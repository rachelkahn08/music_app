class Search {
    constructor(params, array) {
        this.search = params;
        this.array = array;
        this.match = false;
        this.byName = this.byName.bind(this);
        this.by2DIndex = this.by2DIndex.bind(this);
    }

    byName() {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].username == this.search.name) {
                this.match = this.array[i];
            } 
        }

        return this.match;
    }

    by2DIndex() {
        for (var i = 0; i < this.search.array.length; i++) {
            if (this.array[i].x == this.search.x && this.array[i].y == this.search.y)   {
                this.match = this.search.array[i];
            }
        }
        
        return this.match;
    }
}

class Player {
    constructor(params) {
        this.params = params;
        this.noteObject = params.noteObject;
        this.playerData = {};
        this.playerData.noteArray = params.noteArray;
        this.playerData.paired = false;
        this.playerData.playing = true;
        this.setUsername = this.setUsername.bind(this);
        this.setPartner = this.setPartner.bind(this);
        this.savePlayer = this.savePlayer.bind(this);
    }

    setUsername() {
        if (!this.params.username) {
            this.playerData.username = (Math.floor(Math.random() * (999999 - 100000)) + 100000);
        } else {
            this.playerData.username = this.params.username;
        }
        
        return this.playerData.username;
    }

    pickRandomPartner() {
        let i = (Math.floor(Math.random() * (allPlayers.length - 1)) + 1); 
        return allPlayers[i];
    }

    setPartner() {
        
        function testForPlaying() {
            let testPartner = pickRandomPlayer();
            
            if (!testPartner.paired && testPartner.username != this.playerData.username) {
                return false;
            } else {
                return testPartner;
            }
        }

        let partner = false;

        while (!partner) {
            partner = testForPlaying();
        }

        return partner;
    }

    savePlayer() {
        allPlayers.push(this.playerData);
    }
}

const WebSocket = require('websocket'),
      WebSocketServer = WebSocket.server;
const util = require('util');
const http = require('http'),
      port = 1357;

let noteArray = [],
    allPlayers = [],
    currentPlayer = false;

// create a server with websocket
const httpServer = http.createServer(function(req, res) {
    // this exclusively exists for the websocket to attach to
});

httpServer.listen(port, function() {
    // console.log(`listening to port:${port}`);
});

const wsServer = new WebSocketServer({
    httpServer: httpServer,
}); 

// create a connection with client
var connection;

wsServer.on('request', function(req){
        // establishes connection
        connection = req.accept(null, req.origin);

        // set up user object
        connection.onopen = new Promise(function(resolve, reject) {

            // check if user object already exists before continuing
            if (!currentPlayer.playerData) {
                
                // is this a new or returning user?
                connection.on('message', function(message){

                    // if no user object in message, this is a brand new user
                    if (message.utf8Data == 'null') { 
                        // generate a new user object
                            currentPlayer = new Player();
                    } else {

                        // check for user history 
                        let searchSavedUsers = new Search({'name': message.utf8Data}, allPlayers);
                        let matched = searchSavedUsers.byName();

                        // if username does not have a saved array
                        if (!matched) {  
                            // create user object from message
                              currentPlayer = new Player({'username': message.utf8Data});
                        }                         
                    }

                    currentPlayer.setUsername();
                    resolve(connection);
                }); 
            } else { 
                // if there's already a user object for this session, then go straight to listening for changes
                resolve(connection);
            }
        }).then(function(connection) {
            // set up to listen for changes
            connection.on('message', function(message){
                parsedMessage = JSON.parse(message.utf8Data);
                // for (var i = 0; i < parsedMessage.length; i++) {
                //     messageHistory.push(parsedMessage[i]);
                // }
                manageNoteArray(parsedMessage);
            });

            // closes connection
            connection.on('close', function(code, description){
                console.log('connection closed');
            });  
        });          
});


// add to an array based on client
function manageNoteArray(obj) {
   
    var matched = new Search(obj, noteArray);

    if (!matched) {
        console.log('no matches');
        noteArray.push(obj);
    } else {
        console.log('match!');
        
        manageChanges(matched);
    }
}

// send array changes to client 
function manageChanges(obj) {
    // send to player2
}

