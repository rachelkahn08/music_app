var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioCtx);

var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(audioCtx.destination);
});

var server;
var user = {};
var playerInterval;

class Note {
	constructor(frequency) {
		this.frequency = frequency;
		this.oscillator = audioCtx.createOscillator();
		this.oscillator.type = 'sine';
		this.oscillator.frequency.value = this.frequency; // value in hertz

		this.gainNode = audioCtx.createGain();
		this.gainNode.gain.value = 0.0;

		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(audioCtx.destination);
		this.context = audioCtx;
		this.delay = this.randomInRange(1, 3);
		this.play = this.play.bind(this);

	}

	randomInRange(from, to) {
		var r = Math.floor(Math.random() * ( to - from ) + from);
			r = r/1000;
		return r;
	}

	play() {
		let gainValue = undefined;

		if (this.frequency > 1000) {
			gainValue = 0.7;
		} else {
			gainValue = 0.8;
		}

		this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
		this.gainNode.gain.linearRampToValueAtTime(gainValue, (this.context.currentTime + 0.08 + this.delay));
		        
		this.oscillator.start(this.context.currentTime);
		this.stop();
	}

	stop() {
		let stopTime = this.context.currentTime + 2;
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);
        this.oscillator.stop(stopTime + 0.05);
	}

	tweakStartTime() {
		setTimeout(this.play, this.delay);
	}
}



class Scale {
	constructor(params) {
		this.params = params;
		this.scaleType = this.params.scaleType;
		this.numberOfOctaves = this.params.numberOfOctaves;
		

		this.key = this.params.key;
		this.startingOctave = this.params.startingOctave;

		this.scale = [];
		this.allStepPatterns = {
			'major': [2, 2, 1, 2, 2, 2, 1, ],
			'minor': [2, 1, 2, 2, 1, 2, 2, 2],
			'minor_harmonic': [2, 1, 2, 2, 1, 3, 1, ],
			'pentatonic_major': [2, 3, 2, 3, 2, 3, ], // this one is kinda fucked up when the octave repeats
			'pentatonic_minor': [3, 2, 2, 3, 2, ],
			'fifths': [7, 2],
			'chord_major': [4, 3, 2, 3],
			'chord_minor': [3, 4, 2],
			'chord_sus': [5, 2, 2],
			'chromatic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
		}

		// every single note name starting with c
		this.chromaticNotes = ['c', 'c#', 'd','d#', 'e', 'f', 'f#','g', 'g#', 'a', 'a#','b',];

		// at least one note has to be hard-coded for the formula to work
		this.cFreq = 16.35;

		// select a step pattern based on parameters
		for (name in this.allStepPatterns) {
			if (this.scaleType == name) {
				this.stepArray = this.allStepPatterns[name];
			}
		}

		// finds number of steps to root note
		this.stepsToRoot = this.generateRootFreq(this.startingOctave, this.key);
	}

	// find steps between two notes
	generateRootFreq(octave, startingNote) {
		let stepsToRoot = (12 * octave) + this.chromaticNotes.indexOf(startingNote);
		return stepsToRoot;
	}

	// generate a single frequency based on steps from c0
	generateFreq(numberOfSteps) {

		const a = 1.059463094359;
		
		let f = this.cFreq;
		let n = numberOfSteps;

		let frequency = f * Math.pow(a, n);

		return ( frequency );
	}

	// generate scale by steps and root
	generate() {
		this.scale.push(this.generateFreq(this.stepsToRoot));
		let steps = this.stepsToRoot; // multiply root by number of octaves
		let octaves = this.numberOfOctaves;

		if (this.stepArray.length == 2) {
			octaves = octaves * 3;
		} else if (this.stepArray.length < 5) {
			octaves = octaves * 2;
		}

		for (var x = 0; x < this.numberOfOctaves; x++) {
			
			for (var i = 0; i < this.stepArray.length; i++) {
				steps = steps +  this.stepArray[i];
				let freq = this.generateFreq(steps);
				this.scale.push(freq);
			}
		}

		return this.scale;
	}
}

class PlayerGrid {
	constructor(params) {
		this.numberOfBeats = params.numberOfBeats;
		this.scale = params.scale;
		this.notesArray = [];
	}

	generatePlayerArray() {
		let index = 0;
		let column = 0;

		for (var x = 0; x <= this.numberOfBeats; x++) {
			// columns (all the same index number)
			this.notesArray.push([]);

			for (var y = 0; y < this.scale.length; y++) {
				// rows (increase index number by one)

				var columnString;
				var indexString;

				if (index == this.scale.length) {
					index = 0;
				}

				if (column < 10) {
					columnString = `0${column}`;
				} else {
					columnString = column;
				}

				if (index < 10) {
					indexString = `0${index}`;
				} else {
					indexString = index;
				}


				let arrayObject = {};
				arrayObject.id = columnString+'_'+indexString;
				arrayObject.frequency = this.scale[index];
				arrayObject.toggle = this.toggle.bind(arrayObject);
				arrayObject.updateIndexArray = this.updateIndexArray.bind(arrayObject);
				arrayObject.x = column;
				arrayObject.y = index;

				let noteButton = document.createElement('button');
					noteButton.id = arrayObject.id;
					noteButton.classList.add('player__button');
					

				arrayObject.noteButton = noteButton;

				this.notesArray[x][y] = arrayObject;
				
				index++;
			}

			column++;
		}
		
		return {notesArray: this.notesArray};

	}

	updateIndexArray(info) {

		let obj = {};
			obj.call = 'update_toggle_array';
			obj.id = info.id;

			if (this.noteButton.classList.contains('active')) {
				obj.val = 1;
			} else {
				obj.val = 0;
			}

		const objToSend = JSON.stringify(obj);

		server.send(objToSend);
	}

	toggle() {
		let noteButton = this.noteButton;

		if (noteButton.classList.contains('active')) {
			noteButton.classList.remove('active');
		} else {
			noteButton.classList.add('active');
		}
	}
}

class App {
	constructor(params) {
		// default settings for the first init & for multiplayer mode
		this.defaultParams = {
			'key': 'c',
			'startingOctave': 4,
			'scaleType': 'pentatonic_minor',
			'numberOfOctaves': 2,
			'bpm': 180,
			'signature': [4, 4],
			'duration': 5,
		}

		// check for parameter arguments 
		if (!params) {
			// use default params if no arguments
			this.params = this.defaultParams;
		} else {
			// use arguments
			this.params = params;
		}

		this.appContainer = document.getElementById('appPlayer');

		// calculate the total number of beats to get the number of columns
		this.params.numberOfBeats = this.params.signature[0] * this.params.duration;

		// calculate & define the interval rate for the player interval	
		this.params.intervalRate = 60000 / this.params.bpm;

		// generate the frequency values of the player buttons
		this.scale = new Scale(this.params);
		this.params.scale = this.scale.generate();

		// generate the grid for the interface
		this.player = new PlayerGrid(this.params);
		this.playerArrays = this.player.generatePlayerArray();

		// PlayerGrid returns the array of objects for each note button
		this.noteArray = this.playerArrays.notesArray;

		this.setPlayerInterval = this.setPlayerInterval.bind(this);
		this.playColumn = this.playColumn.bind(this);
		this.allOff = this.allOff.bind(this);
		this.init = this.init.bind(this);

		this.testPlayCount = 0;
	}

	setPlayerInterval() {
		this.xCount = 0;
		playerInterval = window.setInterval(this.playColumn, this.params.intervalRate);
	}

	// clearPlayerInterval() {
	// 	window.clearInterval(playerInterval);
	// }

	// testInterval() {
	// 	console.log(this.clearPlayerInterval);
	// }

	// refreshApp() {
	// 	this.clearPlayerInterval();
	// 	this.setPlayerInterval();
	// }

	playColumn() {
		this.testPlayCount++;
		this.columns = this.noteArray[this.xCount];
	
		for (this.yCount = 0; this.yCount < this.columns.length; this.yCount++) {
			this.noteButton = this.columns[this.yCount].noteButton;
			this.frequency = this.columns[this.yCount].frequency;

			if (this.noteButton.classList.contains('active')) {
				// it has to be a new note every time because of how the gain functions work
				this.note = new Note(this.frequency);
				this.noteButton.classList.add('playing');
				this.note.tweakStartTime();

				let noteButton = this.noteButton;

				setTimeout(() => {
					noteButton.classList.remove('playing');
				}, this.params.intervalRate);
			} 
		}

		this.xCount++;

		if (this.xCount == this.params.numberOfBeats + 1) {
			this.xCount = 0;
		}
	}

	allOff(e) {
		e.preventDefault();

		let columns = this.noteArray;

		for (var x = 0; x < columns.length; x++) {
			let buttons = columns[x];
			for (var y = 0; y < buttons.length; y++) {
				if (buttons[y].noteButton.classList.contains('active')) {
					buttons[y].toggle();
					buttons[y].updateIndexArray(buttons[y].noteButton);
				}
			}
		}
	}

	init(condition) {
		var mousedown = false;
		var first = true;

		window.addEventListener('mousedown', function(e) {
			mousedown = true;
		});


		window.addEventListener('mouseup', function() {
			mousedown = false;
			first = true;
		});

		for (this.x = 0; this.x < this.noteArray.length; this.x++) {
			this.column = this.noteArray[this.x];
			
			this.playerColumn = document.createElement('div');
				this.playerColumn.classList.add('player__column');

			this.appContainer.appendChild(this.playerColumn);

			for (this.y = 0; this.y < this.column.length; this.y++) {
				
				let button = this.column[this.y];
				var state;

				button.noteButton.addEventListener('mousedown', function() {
					if (first) {
						button.toggle();
						state = button.noteButton.classList.value;
						first = false;	
					} 

					if (condition == 'multi') {
						button.updateIndexArray(button.noteButton);
					}
				});

				button.noteButton.addEventListener('mouseenter', function() {
					
					if (mousedown) {
						if (first) {
							button.toggle();
							state = button.noteButton.classList.value;
							first = false;
						} else {	
							if (this.classList.value != state) {
								
								button.toggle();	

								if (condition == 'multi') {
									button.updateIndexArray(button.noteButton);
								}
							}	
						}
					}
				});

				
				this.playerColumn.appendChild(button.noteButton);
			}	
		}

		this.setPlayerInterval();
	}
}

const multiPlayer = (function() {
	var app;
	let shared = {};

	function init() {
		// open server
		connectToServer().then(function(server) {
			document.getElementById('clearAll').addEventListener('click', app.allOff);

			// what to do when the server sends updates
			server.onmessage = function(message) {

				let update = JSON.parse(message.data);
				
				// update.call describes the type of change to make
				if (update.call == 'update_toggle_array') {
					updatePlayer(update);	
				} if (update.call == 'new_partner_set') {
					app.allOff();
				}	
			}
		}).catch(function(err) {
			console.log(err);
		});
	}

	// function refresh() {
	// 	app.refreshApp();
	// }


	function connectToServer() {

		// generate a new app instance with multiplayer settings, but don't mount it until server can respond
    	app = new App;

		// promise allows server to send info on other player's board before the user 
	    return new Promise(function(resolve, reject) {

	    	// create live connection to server
	        server = new WebSocket('ws://localhost:1357');

	        // wait until server responds before finishing build
	        server.onopen = function() {

	        	// receive and react to server response
	        	server.onmessage = function(message) {

	        		// parse initial message
	        		let initMessage = JSON.parse(message.data);

	        		// check whether joining existing game or starting new one
	        		if (initMessage.call == 'null') {
	   					app.init('multi');
	        		} else if (initMessage.call == 'init') {
	        			app.init('multi');
	        			// if joining new existing, update player to reflect existing conditions
	        			for (var i = 0; i < initMessage.array.length; i++) {
	        				updatePlayer(initMessage.array[i]);
	        			}
	        		}

	        		// finish pre-init
	        		resolve(server);
	        	}
	        }

	        server.onerror = function(err) {
	            reject(err);
	        }
	    })
	}


	// update handler
	function updatePlayer(message) {

		// target specifically the button that is changing
		var button = document.getElementById(message.id);

		// compare classList vals to the new vals 
		if 	(button.classList.contains('active') && message.val == 0) {
			// if val is false and button is true, set button to false by removing 'active' from classlist
			button.classList.remove('active');
		} else if (!button.classList.contains('active') && message.val == 1) {
			// if val is true and button is false, set button to true by adding 'active' to classlist
			button.classList.add('active');
		}
	}


	shared.init = init;
	// shared.refresh = refresh;
	return shared;
}());

multiPlayer.init();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG5yZXZlcmJqcy5leHRlbmQoYXVkaW9DdHgpO1xuXG52YXIgcmV2ZXJiVXJsID0gXCJodHRwOi8vcmV2ZXJianMub3JnL0xpYnJhcnkvRXJyb2xCcmlja3dvcmtzS2lsbi5tNGFcIjtcbnZhciByZXZlcmJOb2RlID0gYXVkaW9DdHguY3JlYXRlUmV2ZXJiRnJvbVVybChyZXZlcmJVcmwsIGZ1bmN0aW9uKCkge1xuICByZXZlcmJOb2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xufSk7XG5cbnZhciBzZXJ2ZXI7XG52YXIgdXNlciA9IHt9O1xudmFyIHBsYXllckludGVydmFsO1xuXG5jbGFzcyBOb3RlIHtcblx0Y29uc3RydWN0b3IoZnJlcXVlbmN5KSB7XG5cdFx0dGhpcy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XG5cdFx0dGhpcy5vc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdHRoaXMub3NjaWxsYXRvci50eXBlID0gJ3NpbmUnO1xuXHRcdHRoaXMub3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSB0aGlzLmZyZXF1ZW5jeTsgLy8gdmFsdWUgaW4gaGVydHpcblxuXHRcdHRoaXMuZ2Fpbk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC4wO1xuXG5cdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5nYWluTm9kZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblx0XHR0aGlzLmNvbnRleHQgPSBhdWRpb0N0eDtcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5yYW5kb21JblJhbmdlKDEsIDMpO1xuXHRcdHRoaXMucGxheSA9IHRoaXMucGxheS5iaW5kKHRoaXMpO1xuXG5cdH1cblxuXHRyYW5kb21JblJhbmdlKGZyb20sIHRvKSB7XG5cdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoIHRvIC0gZnJvbSApICsgZnJvbSk7XG5cdFx0XHRyID0gci8xMDAwO1xuXHRcdHJldHVybiByO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHRsZXQgZ2FpblZhbHVlID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYgKHRoaXMuZnJlcXVlbmN5ID4gMTAwMCkge1xuXHRcdFx0Z2FpblZhbHVlID0gMC43O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjg7XG5cdFx0fVxuXG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGdhaW5WYWx1ZSwgKHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDAuMDggKyB0aGlzLmRlbGF5KSk7XG5cdFx0ICAgICAgICBcblx0XHR0aGlzLm9zY2lsbGF0b3Iuc3RhcnQodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLnN0b3AoKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0bGV0IHN0b3BUaW1lID0gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMjtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMSwgc3RvcFRpbWUpO1xuICAgICAgICB0aGlzLm9zY2lsbGF0b3Iuc3RvcChzdG9wVGltZSArIDAuMDUpO1xuXHR9XG5cblx0dHdlYWtTdGFydFRpbWUoKSB7XG5cdFx0c2V0VGltZW91dCh0aGlzLnBsYXksIHRoaXMuZGVsYXkpO1xuXHR9XG59XG5cblxuXG5jbGFzcyBTY2FsZSB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdHRoaXMuc2NhbGVUeXBlID0gdGhpcy5wYXJhbXMuc2NhbGVUeXBlO1xuXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdFxuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnBhcmFtcy5rZXk7XG5cdFx0dGhpcy5zdGFydGluZ09jdGF2ZSA9IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlO1xuXG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHRcdHRoaXMuYWxsU3RlcFBhdHRlcm5zID0ge1xuXHRcdFx0J21ham9yJzogWzIsIDIsIDEsIDIsIDIsIDIsIDEsIF0sXG5cdFx0XHQnbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgMiwgMiwgMl0sXG5cdFx0XHQnbWlub3JfaGFybW9uaWMnOiBbMiwgMSwgMiwgMiwgMSwgMywgMSwgXSxcblx0XHRcdCdwZW50YXRvbmljX21ham9yJzogWzIsIDMsIDIsIDMsIDIsIDMsIF0sIC8vIHRoaXMgb25lIGlzIGtpbmRhIGZ1Y2tlZCB1cCB3aGVuIHRoZSBvY3RhdmUgcmVwZWF0c1xuXHRcdFx0J3BlbnRhdG9uaWNfbWlub3InOiBbMywgMiwgMiwgMywgMiwgXSxcblx0XHRcdCdmaWZ0aHMnOiBbNywgMl0sXG5cdFx0XHQnY2hvcmRfbWFqb3InOiBbNCwgMywgMiwgM10sXG5cdFx0XHQnY2hvcmRfbWlub3InOiBbMywgNCwgMl0sXG5cdFx0XHQnY2hvcmRfc3VzJzogWzUsIDIsIDJdLFxuXHRcdFx0J2Nocm9tYXRpYyc6IFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLF1cblx0XHR9XG5cblx0XHQvLyBldmVyeSBzaW5nbGUgbm90ZSBuYW1lIHN0YXJ0aW5nIHdpdGggY1xuXHRcdHRoaXMuY2hyb21hdGljTm90ZXMgPSBbJ2MnLCAnYyMnLCAnZCcsJ2QjJywgJ2UnLCAnZicsICdmIycsJ2cnLCAnZyMnLCAnYScsICdhIycsJ2InLF07XG5cblx0XHQvLyBhdCBsZWFzdCBvbmUgbm90ZSBoYXMgdG8gYmUgaGFyZC1jb2RlZCBmb3IgdGhlIGZvcm11bGEgdG8gd29ya1xuXHRcdHRoaXMuY0ZyZXEgPSAxNi4zNTtcblxuXHRcdC8vIHNlbGVjdCBhIHN0ZXAgcGF0dGVybiBiYXNlZCBvbiBwYXJhbWV0ZXJzXG5cdFx0Zm9yIChuYW1lIGluIHRoaXMuYWxsU3RlcFBhdHRlcm5zKSB7XG5cdFx0XHRpZiAodGhpcy5zY2FsZVR5cGUgPT0gbmFtZSkge1xuXHRcdFx0XHR0aGlzLnN0ZXBBcnJheSA9IHRoaXMuYWxsU3RlcFBhdHRlcm5zW25hbWVdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZpbmRzIG51bWJlciBvZiBzdGVwcyB0byByb290IG5vdGVcblx0XHR0aGlzLnN0ZXBzVG9Sb290ID0gdGhpcy5nZW5lcmF0ZVJvb3RGcmVxKHRoaXMuc3RhcnRpbmdPY3RhdmUsIHRoaXMua2V5KTtcblx0fVxuXG5cdC8vIGZpbmQgc3RlcHMgYmV0d2VlbiB0d28gbm90ZXNcblx0Z2VuZXJhdGVSb290RnJlcShvY3RhdmUsIHN0YXJ0aW5nTm90ZSkge1xuXHRcdGxldCBzdGVwc1RvUm9vdCA9ICgxMiAqIG9jdGF2ZSkgKyB0aGlzLmNocm9tYXRpY05vdGVzLmluZGV4T2Yoc3RhcnRpbmdOb3RlKTtcblx0XHRyZXR1cm4gc3RlcHNUb1Jvb3Q7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBhIHNpbmdsZSBmcmVxdWVuY3kgYmFzZWQgb24gc3RlcHMgZnJvbSBjMFxuXHRnZW5lcmF0ZUZyZXEobnVtYmVyT2ZTdGVwcykge1xuXG5cdFx0Y29uc3QgYSA9IDEuMDU5NDYzMDk0MzU5O1xuXHRcdFxuXHRcdGxldCBmID0gdGhpcy5jRnJlcTtcblx0XHRsZXQgbiA9IG51bWJlck9mU3RlcHM7XG5cblx0XHRsZXQgZnJlcXVlbmN5ID0gZiAqIE1hdGgucG93KGEsIG4pO1xuXG5cdFx0cmV0dXJuICggZnJlcXVlbmN5ICk7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBzY2FsZSBieSBzdGVwcyBhbmQgcm9vdFxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNjYWxlLnB1c2godGhpcy5nZW5lcmF0ZUZyZXEodGhpcy5zdGVwc1RvUm9vdCkpO1xuXHRcdGxldCBzdGVwcyA9IHRoaXMuc3RlcHNUb1Jvb3Q7IC8vIG11bHRpcGx5IHJvb3QgYnkgbnVtYmVyIG9mIG9jdGF2ZXNcblx0XHRsZXQgb2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzO1xuXG5cdFx0aWYgKHRoaXMuc3RlcEFycmF5Lmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDM7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0ZXBBcnJheS5sZW5ndGggPCA1KSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDI7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLm51bWJlck9mT2N0YXZlczsgeCsrKSB7XG5cdFx0XHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyArICB0aGlzLnN0ZXBBcnJheVtpXTtcblx0XHRcdFx0bGV0IGZyZXEgPSB0aGlzLmdlbmVyYXRlRnJlcShzdGVwcyk7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0fVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblx0fVxuXG5cdGdlbmVyYXRlUGxheWVyQXJyYXkoKSB7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHRsZXQgY29sdW1uID0gMDtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDw9IHRoaXMubnVtYmVyT2ZCZWF0czsgeCsrKSB7XG5cdFx0XHQvLyBjb2x1bW5zIChhbGwgdGhlIHNhbWUgaW5kZXggbnVtYmVyKVxuXHRcdFx0dGhpcy5ub3Rlc0FycmF5LnB1c2goW10pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2NhbGUubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0Ly8gcm93cyAoaW5jcmVhc2UgaW5kZXggbnVtYmVyIGJ5IG9uZSlcblxuXHRcdFx0XHR2YXIgY29sdW1uU3RyaW5nO1xuXHRcdFx0XHR2YXIgaW5kZXhTdHJpbmc7XG5cblx0XHRcdFx0aWYgKGluZGV4ID09IHRoaXMuc2NhbGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbHVtbiA8IDEwKSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gYDAke2NvbHVtbn1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGNvbHVtbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpbmRleCA8IDEwKSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBgMCR7aW5kZXh9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGluZGV4O1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRsZXQgYXJyYXlPYmplY3QgPSB7fTtcblx0XHRcdFx0YXJyYXlPYmplY3QuaWQgPSBjb2x1bW5TdHJpbmcrJ18nK2luZGV4U3RyaW5nO1xuXHRcdFx0XHRhcnJheU9iamVjdC5mcmVxdWVuY3kgPSB0aGlzLnNjYWxlW2luZGV4XTtcblx0XHRcdFx0YXJyYXlPYmplY3QudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXG5cdH1cblxuXHR1cGRhdGVJbmRleEFycmF5KGluZm8pIHtcblxuXHRcdGxldCBvYmogPSB7fTtcblx0XHRcdG9iai5jYWxsID0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknO1xuXHRcdFx0b2JqLmlkID0gaW5mby5pZDtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdG9iai52YWwgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b2JqLnZhbCA9IDA7XG5cdFx0XHR9XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0c2VydmVyLnNlbmQob2JqVG9TZW5kKTtcblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdC8vIGRlZmF1bHQgc2V0dGluZ3MgZm9yIHRoZSBmaXJzdCBpbml0ICYgZm9yIG11bHRpcGxheWVyIG1vZGVcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHQna2V5JzogJ2MnLFxuXHRcdFx0J3N0YXJ0aW5nT2N0YXZlJzogNCxcblx0XHRcdCdzY2FsZVR5cGUnOiAncGVudGF0b25pY19taW5vcicsXG5cdFx0XHQnbnVtYmVyT2ZPY3RhdmVzJzogMixcblx0XHRcdCdicG0nOiAxODAsXG5cdFx0XHQnc2lnbmF0dXJlJzogWzQsIDRdLFxuXHRcdFx0J2R1cmF0aW9uJzogNSxcblx0XHR9XG5cblx0XHQvLyBjaGVjayBmb3IgcGFyYW1ldGVyIGFyZ3VtZW50cyBcblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0Ly8gdXNlIGRlZmF1bHQgcGFyYW1zIGlmIG5vIGFyZ3VtZW50c1xuXHRcdFx0dGhpcy5wYXJhbXMgPSB0aGlzLmRlZmF1bHRQYXJhbXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVzZSBhcmd1bWVudHNcblx0XHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdH1cblxuXHRcdHRoaXMuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpO1xuXG5cdFx0Ly8gY2FsY3VsYXRlIHRoZSB0b3RhbCBudW1iZXIgb2YgYmVhdHMgdG8gZ2V0IHRoZSBudW1iZXIgb2YgY29sdW1uc1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5zaWduYXR1cmVbMF0gKiB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcblxuXHRcdC8vIGNhbGN1bGF0ZSAmIGRlZmluZSB0aGUgaW50ZXJ2YWwgcmF0ZSBmb3IgdGhlIHBsYXllciBpbnRlcnZhbFx0XG5cdFx0dGhpcy5wYXJhbXMuaW50ZXJ2YWxSYXRlID0gNjAwMDAgLyB0aGlzLnBhcmFtcy5icG07XG5cblx0XHQvLyBnZW5lcmF0ZSB0aGUgZnJlcXVlbmN5IHZhbHVlcyBvZiB0aGUgcGxheWVyIGJ1dHRvbnNcblx0XHR0aGlzLnNjYWxlID0gbmV3IFNjYWxlKHRoaXMucGFyYW1zKTtcblx0XHR0aGlzLnBhcmFtcy5zY2FsZSA9IHRoaXMuc2NhbGUuZ2VuZXJhdGUoKTtcblxuXHRcdC8vIGdlbmVyYXRlIHRoZSBncmlkIGZvciB0aGUgaW50ZXJmYWNlXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cdFx0dGhpcy5wbGF5ZXJBcnJheXMgPSB0aGlzLnBsYXllci5nZW5lcmF0ZVBsYXllckFycmF5KCk7XG5cblx0XHQvLyBQbGF5ZXJHcmlkIHJldHVybnMgdGhlIGFycmF5IG9mIG9iamVjdHMgZm9yIGVhY2ggbm90ZSBidXR0b25cblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLnNldFBsYXllckludGVydmFsID0gdGhpcy5zZXRQbGF5ZXJJbnRlcnZhbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucGxheUNvbHVtbiA9IHRoaXMucGxheUNvbHVtbi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuYWxsT2ZmID0gdGhpcy5hbGxPZmYuYmluZCh0aGlzKTtcblx0XHR0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcblxuXHRcdHRoaXMudGVzdFBsYXlDb3VudCA9IDA7XG5cdH1cblxuXHRzZXRQbGF5ZXJJbnRlcnZhbCgpIHtcblx0XHR0aGlzLnhDb3VudCA9IDA7XG5cdFx0cGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5wbGF5Q29sdW1uLCB0aGlzLnBhcmFtcy5pbnRlcnZhbFJhdGUpO1xuXHR9XG5cblx0Ly8gY2xlYXJQbGF5ZXJJbnRlcnZhbCgpIHtcblx0Ly8gXHR3aW5kb3cuY2xlYXJJbnRlcnZhbChwbGF5ZXJJbnRlcnZhbCk7XG5cdC8vIH1cblxuXHQvLyB0ZXN0SW50ZXJ2YWwoKSB7XG5cdC8vIFx0Y29uc29sZS5sb2codGhpcy5jbGVhclBsYXllckludGVydmFsKTtcblx0Ly8gfVxuXG5cdC8vIHJlZnJlc2hBcHAoKSB7XG5cdC8vIFx0dGhpcy5jbGVhclBsYXllckludGVydmFsKCk7XG5cdC8vIFx0dGhpcy5zZXRQbGF5ZXJJbnRlcnZhbCgpO1xuXHQvLyB9XG5cblx0cGxheUNvbHVtbigpIHtcblx0XHR0aGlzLnRlc3RQbGF5Q291bnQrKztcblx0XHR0aGlzLmNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhDb3VudF07XG5cdFxuXHRcdGZvciAodGhpcy55Q291bnQgPSAwOyB0aGlzLnlDb3VudCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IHRoaXMueUNvdW50KyspIHtcblx0XHRcdHRoaXMubm90ZUJ1dHRvbiA9IHRoaXMuY29sdW1uc1t0aGlzLnlDb3VudF0ubm90ZUJ1dHRvbjtcblx0XHRcdHRoaXMuZnJlcXVlbmN5ID0gdGhpcy5jb2x1bW5zW3RoaXMueUNvdW50XS5mcmVxdWVuY3k7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHQvLyBpdCBoYXMgdG8gYmUgYSBuZXcgbm90ZSBldmVyeSB0aW1lIGJlY2F1c2Ugb2YgaG93IHRoZSBnYWluIGZ1bmN0aW9ucyB3b3JrXG5cdFx0XHRcdHRoaXMubm90ZSA9IG5ldyBOb3RlKHRoaXMuZnJlcXVlbmN5KTtcblx0XHRcdFx0dGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0dGhpcy5ub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG5cdFx0XHRcdH0sIHRoaXMucGFyYW1zLmludGVydmFsUmF0ZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyArIDEpIHtcblx0XHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR9XG5cdH1cblxuXHRhbGxPZmYoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGxldCBjb2x1bW5zID0gdGhpcy5ub3RlQXJyYXk7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGNvbHVtbnMubGVuZ3RoOyB4KyspIHtcblx0XHRcdGxldCBidXR0b25zID0gY29sdW1uc1t4XTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgYnV0dG9ucy5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHRpZiAoYnV0dG9uc1t5XS5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRidXR0b25zW3ldLnRvZ2dsZSgpO1xuXHRcdFx0XHRcdGJ1dHRvbnNbeV0udXBkYXRlSW5kZXhBcnJheShidXR0b25zW3ldLm5vdGVCdXR0b24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aW5pdChjb25kaXRpb24pIHtcblx0XHR2YXIgbW91c2Vkb3duID0gZmFsc2U7XG5cdFx0dmFyIGZpcnN0ID0gdHJ1ZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRtb3VzZWRvd24gPSB0cnVlO1xuXHRcdH0pO1xuXG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bW91c2Vkb3duID0gZmFsc2U7XG5cdFx0XHRmaXJzdCA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRmb3IgKHRoaXMueCA9IDA7IHRoaXMueCA8IHRoaXMubm90ZUFycmF5Lmxlbmd0aDsgdGhpcy54KyspIHtcblx0XHRcdHRoaXMuY29sdW1uID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54XTtcblx0XHRcdFxuXHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uY2xhc3NMaXN0LmFkZCgncGxheWVyX19jb2x1bW4nKTtcblxuXHRcdFx0dGhpcy5hcHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wbGF5ZXJDb2x1bW4pO1xuXG5cdFx0XHRmb3IgKHRoaXMueSA9IDA7IHRoaXMueSA8IHRoaXMuY29sdW1uLmxlbmd0aDsgdGhpcy55KyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzLmNvbHVtblt0aGlzLnldO1xuXHRcdFx0XHR2YXIgc3RhdGU7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IGJ1dHRvbi5ub3RlQnV0dG9uLmNsYXNzTGlzdC52YWx1ZTtcblx0XHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XHRcblx0XHRcdFx0XHR9IFxuXG5cdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRidXR0b24ubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKG1vdXNlZG93bikge1xuXHRcdFx0XHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1x0XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmNsYXNzTGlzdC52YWx1ZSAhPSBzdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcdFxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnBsYXllckNvbHVtbi5hcHBlbmRDaGlsZChidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFBsYXllckludGVydmFsKCk7XG5cdH1cbn1cblxuY29uc3QgbXVsdGlQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciBhcHA7XG5cdGxldCBzaGFyZWQgPSB7fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdC8vIG9wZW4gc2VydmVyXG5cdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckFsbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXBwLmFsbE9mZik7XG5cblx0XHRcdC8vIHdoYXQgdG8gZG8gd2hlbiB0aGUgc2VydmVyIHNlbmRzIHVwZGF0ZXNcblx0XHRcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHRcdFx0bGV0IHVwZGF0ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIHVwZGF0ZS5jYWxsIGRlc2NyaWJlcyB0aGUgdHlwZSBvZiBjaGFuZ2UgdG8gbWFrZVxuXHRcdFx0XHRpZiAodXBkYXRlLmNhbGwgPT0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknKSB7XG5cdFx0XHRcdFx0dXBkYXRlUGxheWVyKHVwZGF0ZSk7XHRcblx0XHRcdFx0fSBpZiAodXBkYXRlLmNhbGwgPT0gJ25ld19wYXJ0bmVyX3NldCcpIHtcblx0XHRcdFx0XHRhcHAuYWxsT2ZmKCk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdC8vIFx0YXBwLnJlZnJlc2hBcHAoKTtcblx0Ly8gfVxuXG5cblx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG5cdFx0Ly8gZ2VuZXJhdGUgYSBuZXcgYXBwIGluc3RhbmNlIHdpdGggbXVsdGlwbGF5ZXIgc2V0dGluZ3MsIGJ1dCBkb24ndCBtb3VudCBpdCB1bnRpbCBzZXJ2ZXIgY2FuIHJlc3BvbmRcbiAgICBcdGFwcCA9IG5ldyBBcHA7XG5cblx0XHQvLyBwcm9taXNlIGFsbG93cyBzZXJ2ZXIgdG8gc2VuZCBpbmZvIG9uIG90aGVyIHBsYXllcidzIGJvYXJkIGJlZm9yZSB0aGUgdXNlciBcblx0ICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuXHQgICAgXHQvLyBjcmVhdGUgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlclxuXHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHQgICAgICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcblx0ICAgICAgICBzZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgIFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuXHQgICAgICAgIFx0XHQvLyBwYXJzZSBpbml0aWFsIG1lc3NhZ2Vcblx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdCAgICAgICAgXHRcdC8vIGNoZWNrIHdoZXRoZXIgam9pbmluZyBleGlzdGluZyBnYW1lIG9yIHN0YXJ0aW5nIG5ldyBvbmVcblx0ICAgICAgICBcdFx0aWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ251bGwnKSB7XG5cdCAgIFx0XHRcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHQgICAgICAgIFx0XHRcdGFwcC5pbml0KCdtdWx0aScpO1xuXHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuXHQgICAgICAgIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdE1lc3NhZ2UuYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICBcdFx0XHRcdHVwZGF0ZVBsYXllcihpbml0TWVzc2FnZS5hcnJheVtpXSk7XG5cdCAgICAgICAgXHRcdFx0fVxuXHQgICAgICAgIFx0XHR9XG5cblx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG5cdCAgICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHQgICAgICAgICAgICByZWplY3QoZXJyKTtcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG5cblxuXHQvLyB1cGRhdGUgaGFuZGxlclxuXHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG5cdFx0Ly8gdGFyZ2V0IHNwZWNpZmljYWxseSB0aGUgYnV0dG9uIHRoYXQgaXMgY2hhbmdpbmdcblx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWVzc2FnZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMSkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIHRydWUgYW5kIGJ1dHRvbiBpcyBmYWxzZSwgc2V0IGJ1dHRvbiB0byB0cnVlIGJ5IGFkZGluZyAnYWN0aXZlJyB0byBjbGFzc2xpc3Rcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXG5cdHNoYXJlZC5pbml0ID0gaW5pdDtcblx0Ly8gc2hhcmVkLnJlZnJlc2ggPSByZWZyZXNoO1xuXHRyZXR1cm4gc2hhcmVkO1xufSgpKTtcblxubXVsdGlQbGF5ZXIuaW5pdCgpO1xuIl19
