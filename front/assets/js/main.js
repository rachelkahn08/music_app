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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xucmV2ZXJianMuZXh0ZW5kKGF1ZGlvQ3R4KTtcblxudmFyIHJldmVyYlVybCA9IFwiaHR0cDovL3JldmVyYmpzLm9yZy9MaWJyYXJ5L0Vycm9sQnJpY2t3b3Jrc0tpbG4ubTRhXCI7XG52YXIgcmV2ZXJiTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZVJldmVyYkZyb21VcmwocmV2ZXJiVXJsLCBmdW5jdGlvbigpIHtcbiAgcmV2ZXJiTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbn0pO1xuXG52YXIgc2VydmVyO1xudmFyIHVzZXIgPSB7fTtcbnZhciBwbGF5ZXJJbnRlcnZhbDtcblxuY2xhc3MgTm90ZSB7XG5cdGNvbnN0cnVjdG9yKGZyZXF1ZW5jeSkge1xuXHRcdHRoaXMuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xuXHRcdHRoaXMub3NjaWxsYXRvciA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHR0aGlzLm9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcblx0XHR0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gdGhpcy5mcmVxdWVuY3k7IC8vIHZhbHVlIGluIGhlcnR6XG5cblx0XHR0aGlzLmdhaW5Ob2RlID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuMDtcblxuXHRcdHRoaXMub3NjaWxsYXRvci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cdFx0dGhpcy5jb250ZXh0ID0gYXVkaW9DdHg7XG5cdFx0dGhpcy5kZWxheSA9IHRoaXMucmFuZG9tSW5SYW5nZSgxLCAzKTtcblx0XHR0aGlzLnBsYXkgPSB0aGlzLnBsYXkuYmluZCh0aGlzKTtcblxuXHR9XG5cblx0cmFuZG9tSW5SYW5nZShmcm9tLCB0bykge1xuXHRcdHZhciByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCB0byAtIGZyb20gKSArIGZyb20pO1xuXHRcdFx0ciA9IHIvMTAwMDtcblx0XHRyZXR1cm4gcjtcblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0bGV0IGdhaW5WYWx1ZSA9IHVuZGVmaW5lZDtcblxuXHRcdGlmICh0aGlzLmZyZXF1ZW5jeSA+IDEwMDApIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuNztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2FpblZhbHVlID0gMC44O1xuXHRcdH1cblxuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShnYWluVmFsdWUsICh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAwLjA4ICsgdGhpcy5kZWxheSkpO1xuXHRcdCAgICAgICAgXG5cdFx0dGhpcy5vc2NpbGxhdG9yLnN0YXJ0KHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdGxldCBzdG9wVGltZSA9IHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDI7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMC4wMDEsIHN0b3BUaW1lKTtcbiAgICAgICAgdGhpcy5vc2NpbGxhdG9yLnN0b3Aoc3RvcFRpbWUgKyAwLjA1KTtcblx0fVxuXG5cdHR3ZWFrU3RhcnRUaW1lKCkge1xuXHRcdHNldFRpbWVvdXQodGhpcy5wbGF5LCB0aGlzLmRlbGF5KTtcblx0fVxufVxuXG5cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLnNjYWxlVHlwZSA9IHRoaXMucGFyYW1zLnNjYWxlVHlwZTtcblx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMucGFyYW1zLm51bWJlck9mT2N0YXZlcztcblx0XHRcblxuXHRcdHRoaXMua2V5ID0gdGhpcy5wYXJhbXMua2V5O1xuXHRcdHRoaXMuc3RhcnRpbmdPY3RhdmUgPSB0aGlzLnBhcmFtcy5zdGFydGluZ09jdGF2ZTtcblxuXHRcdHRoaXMuc2NhbGUgPSBbXTtcblx0XHR0aGlzLmFsbFN0ZXBQYXR0ZXJucyA9IHtcblx0XHRcdCdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyLCAxLCBdLFxuXHRcdFx0J21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDIsIDIsIDJdLFxuXHRcdFx0J21pbm9yX2hhcm1vbmljJzogWzIsIDEsIDIsIDIsIDEsIDMsIDEsIF0sXG5cdFx0XHQncGVudGF0b25pY19tYWpvcic6IFsyLCAzLCAyLCAzLCAyLCAzLCBdLCAvLyB0aGlzIG9uZSBpcyBraW5kYSBmdWNrZWQgdXAgd2hlbiB0aGUgb2N0YXZlIHJlcGVhdHNcblx0XHRcdCdwZW50YXRvbmljX21pbm9yJzogWzMsIDIsIDIsIDMsIDIsIF0sXG5cdFx0XHQnZmlmdGhzJzogWzcsIDJdLFxuXHRcdFx0J2Nob3JkX21ham9yJzogWzQsIDMsIDIsIDNdLFxuXHRcdFx0J2Nob3JkX21pbm9yJzogWzMsIDQsIDJdLFxuXHRcdFx0J2Nob3JkX3N1cyc6IFs1LCAyLCAyXSxcblx0XHRcdCdjaHJvbWF0aWMnOiBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxdXG5cdFx0fVxuXG5cdFx0Ly8gZXZlcnkgc2luZ2xlIG5vdGUgbmFtZSBzdGFydGluZyB3aXRoIGNcblx0XHR0aGlzLmNocm9tYXRpY05vdGVzID0gWydjJywgJ2MjJywgJ2QnLCdkIycsICdlJywgJ2YnLCAnZiMnLCdnJywgJ2cjJywgJ2EnLCAnYSMnLCdiJyxdO1xuXG5cdFx0Ly8gYXQgbGVhc3Qgb25lIG5vdGUgaGFzIHRvIGJlIGhhcmQtY29kZWQgZm9yIHRoZSBmb3JtdWxhIHRvIHdvcmtcblx0XHR0aGlzLmNGcmVxID0gMTYuMzU7XG5cblx0XHQvLyBzZWxlY3QgYSBzdGVwIHBhdHRlcm4gYmFzZWQgb24gcGFyYW1ldGVyc1xuXHRcdGZvciAobmFtZSBpbiB0aGlzLmFsbFN0ZXBQYXR0ZXJucykge1xuXHRcdFx0aWYgKHRoaXMuc2NhbGVUeXBlID09IG5hbWUpIHtcblx0XHRcdFx0dGhpcy5zdGVwQXJyYXkgPSB0aGlzLmFsbFN0ZXBQYXR0ZXJuc1tuYW1lXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBmaW5kcyBudW1iZXIgb2Ygc3RlcHMgdG8gcm9vdCBub3RlXG5cdFx0dGhpcy5zdGVwc1RvUm9vdCA9IHRoaXMuZ2VuZXJhdGVSb290RnJlcSh0aGlzLnN0YXJ0aW5nT2N0YXZlLCB0aGlzLmtleSk7XG5cdH1cblxuXHQvLyBmaW5kIHN0ZXBzIGJldHdlZW4gdHdvIG5vdGVzXG5cdGdlbmVyYXRlUm9vdEZyZXEob2N0YXZlLCBzdGFydGluZ05vdGUpIHtcblx0XHRsZXQgc3RlcHNUb1Jvb3QgPSAoMTIgKiBvY3RhdmUpICsgdGhpcy5jaHJvbWF0aWNOb3Rlcy5pbmRleE9mKHN0YXJ0aW5nTm90ZSk7XG5cdFx0cmV0dXJuIHN0ZXBzVG9Sb290O1xuXHR9XG5cblx0Ly8gZ2VuZXJhdGUgYSBzaW5nbGUgZnJlcXVlbmN5IGJhc2VkIG9uIHN0ZXBzIGZyb20gYzBcblx0Z2VuZXJhdGVGcmVxKG51bWJlck9mU3RlcHMpIHtcblxuXHRcdGNvbnN0IGEgPSAxLjA1OTQ2MzA5NDM1OTtcblx0XHRcblx0XHRsZXQgZiA9IHRoaXMuY0ZyZXE7XG5cdFx0bGV0IG4gPSBudW1iZXJPZlN0ZXBzO1xuXG5cdFx0bGV0IGZyZXF1ZW5jeSA9IGYgKiBNYXRoLnBvdyhhLCBuKTtcblxuXHRcdHJldHVybiAoIGZyZXF1ZW5jeSApO1xuXHR9XG5cblx0Ly8gZ2VuZXJhdGUgc2NhbGUgYnkgc3RlcHMgYW5kIHJvb3Rcblx0Z2VuZXJhdGUoKSB7XG5cdFx0dGhpcy5zY2FsZS5wdXNoKHRoaXMuZ2VuZXJhdGVGcmVxKHRoaXMuc3RlcHNUb1Jvb3QpKTtcblx0XHRsZXQgc3RlcHMgPSB0aGlzLnN0ZXBzVG9Sb290OyAvLyBtdWx0aXBseSByb290IGJ5IG51bWJlciBvZiBvY3RhdmVzXG5cdFx0bGV0IG9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcztcblxuXHRcdGlmICh0aGlzLnN0ZXBBcnJheS5sZW5ndGggPT0gMikge1xuXHRcdFx0b2N0YXZlcyA9IG9jdGF2ZXMgKiAzO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGVwQXJyYXkubGVuZ3RoIDwgNSkge1xuXHRcdFx0b2N0YXZlcyA9IG9jdGF2ZXMgKiAyO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IHgrKykge1xuXHRcdFx0XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RlcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHN0ZXBzID0gc3RlcHMgKyAgdGhpcy5zdGVwQXJyYXlbaV07XG5cdFx0XHRcdGxldCBmcmVxID0gdGhpcy5nZW5lcmF0ZUZyZXEoc3RlcHMpO1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuc2NhbGU7XG5cdH1cbn1cblxuY2xhc3MgUGxheWVyR3JpZCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMubnVtYmVyT2ZCZWF0cyA9IHBhcmFtcy5udW1iZXJPZkJlYXRzO1xuXHRcdHRoaXMuc2NhbGUgPSBwYXJhbXMuc2NhbGU7XG5cdFx0dGhpcy5ub3Rlc0FycmF5ID0gW107XG5cdH1cblxuXHRnZW5lcmF0ZVBsYXllckFycmF5KCkge1xuXHRcdGxldCBpbmRleCA9IDA7XG5cdFx0bGV0IGNvbHVtbiA9IDA7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8PSB0aGlzLm51bWJlck9mQmVhdHM7IHgrKykge1xuXHRcdFx0Ly8gY29sdW1ucyAoYWxsIHRoZSBzYW1lIGluZGV4IG51bWJlcilcblx0XHRcdHRoaXMubm90ZXNBcnJheS5wdXNoKFtdKTtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNjYWxlLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdC8vIHJvd3MgKGluY3JlYXNlIGluZGV4IG51bWJlciBieSBvbmUpXG5cblx0XHRcdFx0dmFyIGNvbHVtblN0cmluZztcblx0XHRcdFx0dmFyIGluZGV4U3RyaW5nO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PSB0aGlzLnNjYWxlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb2x1bW4gPCAxMCkge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGAwJHtjb2x1bW59YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBjb2x1bW47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaW5kZXggPCAxMCkge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gYDAke2luZGV4fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBpbmRleDtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0bGV0IGFycmF5T2JqZWN0ID0ge307XG5cdFx0XHRcdGFycmF5T2JqZWN0LmlkID0gY29sdW1uU3RyaW5nKydfJytpbmRleFN0cmluZztcblx0XHRcdFx0YXJyYXlPYmplY3QuZnJlcXVlbmN5ID0gdGhpcy5zY2FsZVtpbmRleF07XG5cdFx0XHRcdGFycmF5T2JqZWN0LnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC51cGRhdGVJbmRleEFycmF5ID0gdGhpcy51cGRhdGVJbmRleEFycmF5LmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC54ID0gY29sdW1uO1xuXHRcdFx0XHRhcnJheU9iamVjdC55ID0gaW5kZXg7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlkID0gYXJyYXlPYmplY3QuaWQ7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2J1dHRvbicpO1xuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdGFycmF5T2JqZWN0Lm5vdGVCdXR0b24gPSBub3RlQnV0dG9uO1xuXG5cdFx0XHRcdHRoaXMubm90ZXNBcnJheVt4XVt5XSA9IGFycmF5T2JqZWN0O1xuXHRcdFx0XHRcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Y29sdW1uKys7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB7bm90ZXNBcnJheTogdGhpcy5ub3Rlc0FycmF5fTtcblxuXHR9XG5cblx0dXBkYXRlSW5kZXhBcnJheShpbmZvKSB7XG5cblx0XHRsZXQgb2JqID0ge307XG5cdFx0XHRvYmouY2FsbCA9ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jztcblx0XHRcdG9iai5pZCA9IGluZm8uaWQ7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRvYmoudmFsID0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9iai52YWwgPSAwO1xuXHRcdFx0fVxuXG5cdFx0Y29uc3Qgb2JqVG9TZW5kID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblxuXHRcdHNlcnZlci5zZW5kKG9ialRvU2VuZCk7XG5cdH1cblxuXHR0b2dnbGUoKSB7XG5cdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHQvLyBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGUgZmlyc3QgaW5pdCAmIGZvciBtdWx0aXBsYXllciBtb2RlXG5cdFx0dGhpcy5kZWZhdWx0UGFyYW1zID0ge1xuXHRcdFx0J2tleSc6ICdjJyxcblx0XHRcdCdzdGFydGluZ09jdGF2ZSc6IDQsXG5cdFx0XHQnc2NhbGVUeXBlJzogJ3BlbnRhdG9uaWNfbWlub3InLFxuXHRcdFx0J251bWJlck9mT2N0YXZlcyc6IDIsXG5cdFx0XHQnYnBtJzogMTgwLFxuXHRcdFx0J3NpZ25hdHVyZSc6IFs0LCA0XSxcblx0XHRcdCdkdXJhdGlvbic6IDUsXG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2sgZm9yIHBhcmFtZXRlciBhcmd1bWVudHMgXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdC8vIHVzZSBkZWZhdWx0IHBhcmFtcyBpZiBubyBhcmd1bWVudHNcblx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB1c2UgYXJndW1lbnRzXG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR9XG5cblx0XHR0aGlzLmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBQbGF5ZXInKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSB0aGUgdG90YWwgbnVtYmVyIG9mIGJlYXRzIHRvIGdldCB0aGUgbnVtYmVyIG9mIGNvbHVtbnNcblx0XHR0aGlzLnBhcmFtcy5udW1iZXJPZkJlYXRzID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzBdICogdGhpcy5wYXJhbXMuZHVyYXRpb247XG5cblx0XHQvLyBjYWxjdWxhdGUgJiBkZWZpbmUgdGhlIGludGVydmFsIHJhdGUgZm9yIHRoZSBwbGF5ZXIgaW50ZXJ2YWxcdFxuXHRcdHRoaXMucGFyYW1zLmludGVydmFsUmF0ZSA9IDYwMDAwIC8gdGhpcy5wYXJhbXMuYnBtO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgdGhlIGZyZXF1ZW5jeSB2YWx1ZXMgb2YgdGhlIHBsYXllciBidXR0b25zXG5cdFx0dGhpcy5zY2FsZSA9IG5ldyBTY2FsZSh0aGlzLnBhcmFtcyk7XG5cdFx0dGhpcy5wYXJhbXMuc2NhbGUgPSB0aGlzLnNjYWxlLmdlbmVyYXRlKCk7XG5cblx0XHQvLyBnZW5lcmF0ZSB0aGUgZ3JpZCBmb3IgdGhlIGludGVyZmFjZVxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllckdyaWQodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGxheWVyQXJyYXlzID0gdGhpcy5wbGF5ZXIuZ2VuZXJhdGVQbGF5ZXJBcnJheSgpO1xuXG5cdFx0Ly8gUGxheWVyR3JpZCByZXR1cm5zIHRoZSBhcnJheSBvZiBvYmplY3RzIGZvciBlYWNoIG5vdGUgYnV0dG9uXG5cdFx0dGhpcy5ub3RlQXJyYXkgPSB0aGlzLnBsYXllckFycmF5cy5ub3Rlc0FycmF5O1xuXG5cdFx0dGhpcy5zZXRQbGF5ZXJJbnRlcnZhbCA9IHRoaXMuc2V0UGxheWVySW50ZXJ2YWwuYmluZCh0aGlzKTtcblx0XHR0aGlzLnBsYXlDb2x1bW4gPSB0aGlzLnBsYXlDb2x1bW4uYmluZCh0aGlzKTtcblx0XHR0aGlzLmFsbE9mZiA9IHRoaXMuYWxsT2ZmLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLnRlc3RQbGF5Q291bnQgPSAwO1xuXHR9XG5cblx0c2V0UGxheWVySW50ZXJ2YWwoKSB7XG5cdFx0dGhpcy54Q291bnQgPSAwO1xuXHRcdHBsYXllckludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucGxheUNvbHVtbiwgdGhpcy5wYXJhbXMuaW50ZXJ2YWxSYXRlKTtcblx0fVxuXG5cdC8vIGNsZWFyUGxheWVySW50ZXJ2YWwoKSB7XG5cdC8vIFx0d2luZG93LmNsZWFySW50ZXJ2YWwocGxheWVySW50ZXJ2YWwpO1xuXHQvLyB9XG5cblx0Ly8gdGVzdEludGVydmFsKCkge1xuXHQvLyBcdGNvbnNvbGUubG9nKHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbCk7XG5cdC8vIH1cblxuXHQvLyByZWZyZXNoQXBwKCkge1xuXHQvLyBcdHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbCgpO1xuXHQvLyBcdHRoaXMuc2V0UGxheWVySW50ZXJ2YWwoKTtcblx0Ly8gfVxuXG5cdHBsYXlDb2x1bW4oKSB7XG5cdFx0dGhpcy50ZXN0UGxheUNvdW50Kys7XG5cdFx0dGhpcy5jb2x1bW5zID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54Q291bnRdO1xuXHRcblx0XHRmb3IgKHRoaXMueUNvdW50ID0gMDsgdGhpcy55Q291bnQgPCB0aGlzLmNvbHVtbnMubGVuZ3RoOyB0aGlzLnlDb3VudCsrKSB7XG5cdFx0XHR0aGlzLm5vdGVCdXR0b24gPSB0aGlzLmNvbHVtbnNbdGhpcy55Q291bnRdLm5vdGVCdXR0b247XG5cdFx0XHR0aGlzLmZyZXF1ZW5jeSA9IHRoaXMuY29sdW1uc1t0aGlzLnlDb3VudF0uZnJlcXVlbmN5O1xuXG5cdFx0XHRpZiAodGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0Ly8gaXQgaGFzIHRvIGJlIGEgbmV3IG5vdGUgZXZlcnkgdGltZSBiZWNhdXNlIG9mIGhvdyB0aGUgZ2FpbiBmdW5jdGlvbnMgd29ya1xuXHRcdFx0XHR0aGlzLm5vdGUgPSBuZXcgTm90ZSh0aGlzLmZyZXF1ZW5jeSk7XG5cdFx0XHRcdHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwbGF5aW5nJyk7XG5cdFx0XHRcdHRoaXMubm90ZS50d2Vha1N0YXJ0VGltZSgpO1xuXG5cdFx0XHRcdGxldCBub3RlQnV0dG9uID0gdGhpcy5ub3RlQnV0dG9uO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xuXHRcdFx0XHR9LCB0aGlzLnBhcmFtcy5pbnRlcnZhbFJhdGUpO1xuXHRcdFx0fSBcblx0XHR9XG5cblx0XHR0aGlzLnhDb3VudCsrO1xuXG5cdFx0aWYgKHRoaXMueENvdW50ID09IHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgKyAxKSB7XG5cdFx0XHR0aGlzLnhDb3VudCA9IDA7XG5cdFx0fVxuXHR9XG5cblx0YWxsT2ZmKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRsZXQgY29sdW1ucyA9IHRoaXMubm90ZUFycmF5O1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBjb2x1bW5zLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRsZXQgYnV0dG9ucyA9IGNvbHVtbnNbeF07XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGJ1dHRvbnMubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0aWYgKGJ1dHRvbnNbeV0ubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0YnV0dG9uc1t5XS50b2dnbGUoKTtcblx0XHRcdFx0XHRidXR0b25zW3ldLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uc1t5XS5ub3RlQnV0dG9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGluaXQoY29uZGl0aW9uKSB7XG5cdFx0dmFyIG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdHZhciBmaXJzdCA9IHRydWU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0bW91c2Vkb3duID0gdHJ1ZTtcblx0XHR9KTtcblxuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcblx0XHRcdG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdFx0Zmlyc3QgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0Zm9yICh0aGlzLnggPSAwOyB0aGlzLnggPCB0aGlzLm5vdGVBcnJheS5sZW5ndGg7IHRoaXMueCsrKSB7XG5cdFx0XHR0aGlzLmNvbHVtbiA9IHRoaXMubm90ZUFycmF5W3RoaXMueF07XG5cdFx0XHRcblx0XHRcdHRoaXMucGxheWVyQ29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHRoaXMucGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cblx0XHRcdHRoaXMuYXBwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucGxheWVyQ29sdW1uKTtcblxuXHRcdFx0Zm9yICh0aGlzLnkgPSAwOyB0aGlzLnkgPCB0aGlzLmNvbHVtbi5sZW5ndGg7IHRoaXMueSsrKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgYnV0dG9uID0gdGhpcy5jb2x1bW5bdGhpcy55XTtcblx0XHRcdFx0dmFyIHN0YXRlO1xuXG5cdFx0XHRcdGJ1dHRvbi5ub3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnRvZ2dsZSgpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1x0XG5cdFx0XHRcdFx0fSBcblxuXHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChtb3VzZWRvd24pIHtcblx0XHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5jbGFzc0xpc3QudmFsdWUgIT0gc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XHRcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRQbGF5ZXJJbnRlcnZhbCgpO1xuXHR9XG59XG5cbmNvbnN0IG11bHRpUGxheWVyID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgYXBwO1xuXHRsZXQgc2hhcmVkID0ge307XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQvLyBvcGVuIHNlcnZlclxuXHRcdGNvbm5lY3RUb1NlcnZlcigpLnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXJBbGwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFwcC5hbGxPZmYpO1xuXG5cdFx0XHQvLyB3aGF0IHRvIGRvIHdoZW4gdGhlIHNlcnZlciBzZW5kcyB1cGRhdGVzXG5cdFx0XHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG5cdFx0XHRcdGxldCB1cGRhdGUgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyB1cGRhdGUuY2FsbCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgY2hhbmdlIHRvIG1ha2Vcblx0XHRcdFx0aWYgKHVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuXHRcdFx0XHRcdHVwZGF0ZVBsYXllcih1cGRhdGUpO1x0XG5cdFx0XHRcdH0gaWYgKHVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG5cdFx0XHRcdFx0YXBwLmFsbE9mZigpO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1cblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQvLyBcdGFwcC5yZWZyZXNoQXBwKCk7XG5cdC8vIH1cblxuXG5cdGZ1bmN0aW9uIGNvbm5lY3RUb1NlcnZlcigpIHtcblxuXHRcdC8vIGdlbmVyYXRlIGEgbmV3IGFwcCBpbnN0YW5jZSB3aXRoIG11bHRpcGxheWVyIHNldHRpbmdzLCBidXQgZG9uJ3QgbW91bnQgaXQgdW50aWwgc2VydmVyIGNhbiByZXNwb25kXG4gICAgXHRhcHAgPSBuZXcgQXBwO1xuXG5cdFx0Ly8gcHJvbWlzZSBhbGxvd3Mgc2VydmVyIHRvIHNlbmQgaW5mbyBvbiBvdGhlciBwbGF5ZXIncyBib2FyZCBiZWZvcmUgdGhlIHVzZXIgXG5cdCAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cblx0ICAgICAgICAvLyB3YWl0IHVudGlsIHNlcnZlciByZXNwb25kcyBiZWZvcmUgZmluaXNoaW5nIGJ1aWxkXG5cdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICBcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuXHQgICAgICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHQgICBcdFx0XHRcdFx0YXBwLmluaXQoJ211bHRpJyk7XG5cdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcblx0ICAgICAgICBcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0ICAgICAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluaXRNZXNzYWdlLmFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0fVxuXG5cdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuXHQgICAgICAgIFx0XHRyZXNvbHZlKHNlcnZlcik7XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VydmVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxuXG5cblx0Ly8gdXBkYXRlIGhhbmRsZXJcblx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG5cdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG5cdFx0aWYgXHQoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMCkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDEpIHtcblx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblxuXHRzaGFyZWQuaW5pdCA9IGluaXQ7XG5cdC8vIHNoYXJlZC5yZWZyZXNoID0gcmVmcmVzaDtcblx0cmV0dXJuIHNoYXJlZDtcbn0oKSk7XG5cbm11bHRpUGxheWVyLmluaXQoKTsiXX0=
