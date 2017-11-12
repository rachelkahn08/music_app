const WebSocket = require('websocket'),
      WebSocketServer = WebSocket.server;
const util = require('util');
const http = require('http'),
      port = 1357;

// create a server with websocket
const httpServer = http.createServer(function(req, res) {
    // this exclusively exists for the websocket to attach to
});

httpServer.listen(port, function() {
});

const wsServer = new WebSocketServer({
    httpServer: httpServer,
}); 


let toggleArray = [],
    allUsers = {};
    allUsers.all = [];
    allUsers.havePartners = [];
    allUsers.needPartners = [];

// create a connection with client
var connection,
    userIndex;

wsServer.on('request', function(req){

        // establishes connection
        connection = req.accept(null, req.origin);

        // set up user object before doing anything else
        connection.onopen = new Promise(function(resolve, reject) {

            // if this is a new connection, it gets a unique ID
            if (!connection.config.uniqueID) {
                let uniqueID = (Math.floor(Math.random() * (999999 - 100000) + 100000));     
                connection.config.uniqueID = uniqueID;
            }

            // configure function to get a new partner on call
            connection.config.getPartner = function() {
                // exclusively look at users wno need a partner
                let potentials = allUsers.needPartners;
                // select one from that pool
                let partner = potentials[(Math.floor(Math.random() * (potentials.length - 1) + potentials.length))];
                connection.config.partner = partner;
                // prevent other users from trying to connect to partner user
                allUsers.havePartners.push(partner);

                partner.call = 'new_partner_set';

                connection.sendUTF(JSON.stringify(partner));
            }

            // if this is the second or larger connection...
            if (allUsers.needPartners.length > 1) {
                //get a partner, yo
                connection.config.getPartner();
                // add connection to list of users who have partners
                allUsers.havePartners.push(connection);
            } else if (allUsers.needPartners.length < 1) {
                // add connection to partner-seeking list
                allUsers.needPartners.push(connection);
            }

            // now that configurations are made, add this connection to the list of connections
            allUsers.all.push(connection);

            // keep this index for later to remove the connection on close
            userIndex = allUsers.all.length - 1;

            // if there is already a list of buttons turned on 
            if (toggleArray.length > 0) {
                // create init object to immediately update player
                let initObj = {}
                    initObj.call = 'init';
                    initObj.array = toggleArray;
                    
                //send that object to the new connection
                connection.sendUTF(JSON.stringify(initObj)); 
            } else {
                // send 'null' so the browser won't freak out at it being undefined
                connection.sendUTF(JSON.stringify({'call':'null'}));
            }

            //configuration complete
            resolve(connection);
        }).then(function(connection) {
            // set up the connection to listen for changes
            connection.on('message', function(message) {
                let newState = JSON.parse(message.utf8Data);

                // see what the purpose of the message is, act accordingly
                if (newState.call == 'get_partner') {
                    connection.config.getPartner();

                } else if (newState.call == 'update_toggle_array') {

                   // check if there is already an array of changes
                   if (!toggleArray.length) {

                       // if there isn't, create one
                       toggleArray.push(newState);
                   } else {


                       // if there is, check whether this change is creating a new object or updating an existing one
                       let match = false;

                       // if this object exists in ther array, update it
                       for (var i = 0; i < toggleArray.length; i++) {
                          if (toggleArray[i].id == newState.id) {
                              toggleArray[i].val = newState.val;
                              match = true;
                          }
                       }

                       // if it doesn't, create it
                       if (!match) {
                           toggleArray.push(newState);
                       }        
                   }

                   // ping this change back to the original connection 
                   connection.sendUTF(JSON.stringify(newState));

                   // loop through all the users
                   for (var i = 0; i < allUsers.havePartners.length; i++) {
                       // find this connection's partner
                       if (allUsers[i].config.uniqueID == connection.config.partnerID) {
                           // send the update only to this connection's partner
                           allUsers[i].sendUTF(JSON.stringify(newState));
                       }
                   } 
               }
                
            });

            // closes connection
            connection.on('close', function(code, description){
                // removes the active connection from the user array
                allUsers.all.splice([userIndex], 1);
                // tells partner time to get a new partner, if there is one
                if ( connection.config.partner ) {
                    connection.config.partner.sendUTF(JSON.stringify({'call':'get_partner'}));     
                } 
            });  
    });          
});