
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
<<<<<<< HEAD
		this.scaleType = this.params.scaleType;
=======
		this.rootNote = this.params.rootNote;
		this.scaleName = this.params.scaleName;
>>>>>>> origin/master
		this.numberOfOctaves = this.params.numberOfOctaves;
		this.startingIndex = frequencies.indexOf(this.rootNote);
		this.scale = [];
<<<<<<< HEAD
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
=======
>>>>>>> origin/master
	}

	generate() {
<<<<<<< HEAD
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
=======
		let x = this.startingIndex;

		const w = 2;
		const h = 1;
		const o = 13;

		// const stepArray = {
		// 	'major': [2, 2, 1, 2, 2, 2, 1],
		// 	'minor': []
		// }

		if (this.scaleName == 'major') {
			// R, W, W, H, W, W, W, H

			for (var i = 0; i < this.numberOfOctaves; i++) {

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				if (i == this.numberOfOctaves - 1) {
					this.scale.push(frequencies[x]);
				}
			}
		}

		if (this.scaleName == 'minor') { 
			// R, W, H, W, W, H, W, W

			for (var i = 0; i < this.numberOfOctaves; i++) {

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				if (i == this.numberOfOctaves - 1) {
					this.scale.push(frequencies[x]);
				}
			}
		}

		if (this.scaleName == 'minor_harmonic') { 
			// R, W, H, W, W, H, 1 1/2, H

			for (var i = 0; i < this.numberOfOctaves; i++) {
				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + h;

				this.scale.push(frequencies[x]);

				x = x + w + h;

				this.scale.push(frequencies[x]);

				x = x + h;

				if (i == this.numberOfOctaves - 1) {
					this.scale.push(frequencies[x]);
				}
			}
		}

		if (this.scaleName == 'pentatonic_major') {
			// W W 1-1/2 step W 1-1/2 step
			this.numberOfOctaves = this.numberOfOctaves*1.5;

			for (var i = 0; i < this.numberOfOctaves; i++) {
				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w + h;

				if (i == this.numberOfOctaves - 1) {
					this.scale.push(frequencies[x]);
				}
			}	
		}

		if (this.scaleName == 'pentatonic_minor') {
			// R, 1 1/2, W, W, 1 1/2, W
			this.numberOfOctaves = this.numberOfOctaves*1.5;

			for (var i = 0; i < this.numberOfOctaves; i++) {

				this.scale.push(frequencies[x]);

				x = x + w + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w;

				this.scale.push(frequencies[x]);

				x = x + w + h;

				this.scale.push(frequencies[x]);

				x = x + w;

				if (i == this.numberOfOctaves - 1) {
					this.scale.push(frequencies[x]);
				}
			}	
		}

		if (this.scaleName == 'fifths') {
			// R, 7
			this.numberOfOctaves = this.numberOfOctaves * 4.5;

			for (var i = 0; i < this.numberOfOctaves; i++) {
				this.scale.push(frequencies[x]);

				x = x + 4;

				if (i == this.numberOfOctaves) {
					this.scale.push(frequencies[x]);
				}

			}
		}

		if (this.scaleName == 'chord_major') {
			// R, 4, 3

			this.numberOfOctaves = this.numberOfOctaves * 3;

			for (var i = 0; i < this.numberOfOctaves; i++) {

				this.scale.push(frequencies[x]);

				x = x + 4;

				this.scale.push(frequencies[x]);

				x = x + 3;

				if (i == this.numberOfOctaves) {
					this.scale.push(frequencies[x]);
				}
			}
		}

		if (this.scaleName == 'chord_minor') {
			// R, 3, 4

			this.numberOfOctaves = this.numberOfOctaves * 3;

			for (var i = 0; i < this.numberOfOctaves; i++) {
				this.scale.push(frequencies[x]);

				x = x + 3;

				this.scale.push(frequencies[x]);

				x = x + 4;

				if (i == this.numberOfOctaves) {
					this.scale.push(frequencies[x]);
				}

			}
		}

		if (this.scaleName == 'chord_sus') {
			// R, 5, 2

			this.numberOfOctaves = this.numberOfOctaves * 3;

			for (var i = 0; i < this.numberOfOctaves; i++) {
				this.scale.push(frequencies[x]);

				x = x + 5;

				this.scale.push(frequencies[x]);

				x = x + 2;

				if (i == this.numberOfOctaves) {
					this.scale.push(frequencies[x]);
				}

>>>>>>> origin/master
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
<<<<<<< HEAD
					
=======
>>>>>>> origin/master

				arrayObject.noteButton = noteButton;

				this.notesArray[x][y] = arrayObject;
				
				index++;
			}

			column++;
		}
		
		return {notesArray: this.notesArray};
	}

	updateIndexArray(info) {
		console.log(info);

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
<<<<<<< HEAD
			'key': 'c',
			'startingOctave': 4,
			'scaleType': 'pentatonic_minor',
			'numberOfOctaves': 2,
			'bpm': 180,
			'signature': [4, 4],
			'duration': 5,
		}

		// check for parameter arguments 
=======
			rootNote: c2,
			scaleName: 'pentatonic_minor',
			numberOfOctaves: 2,
			bpm: 100,
			duration: 4,
			signature: [4, 4],
			numberOfOctaves: 2,
		};

>>>>>>> origin/master
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
<<<<<<< HEAD
		this.allOff = this.allOff.bind(this);
		this.init = this.init.bind(this);
=======
		this.refreshApp = this.refreshApp;

		this.appContainer = document.getElementById('appPlayer');
	}

	refreshApp() {
		this.appContainer.innerHTML = '';
>>>>>>> origin/master

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
					if (!mousedown && first) {
						button.toggle();
						state = button.noteButton.classList.value;
						first = false;	
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
									console.log('multi');
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
<<<<<<< HEAD
	var app;
	let shared = {};
=======
>>>>>>> origin/master

	function init() {

		// open server
		connectToServer().then(function(server) {

			// what to do when the server sends updates
			server.onmessage = function(message) {

				let update = JSON.parse(message.data);
				
				// update.call describes the type of change to make
				if (update.call == 'update_toggle_array') {
					updatePlayer(update);	
				} if (update.call == 'new_partner_set') {
					console.log(update);
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
    	var app = new App;

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

<<<<<<< HEAD
multiPlayer.init();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG5yZXZlcmJqcy5leHRlbmQoYXVkaW9DdHgpO1xuXG52YXIgcmV2ZXJiVXJsID0gXCJodHRwOi8vcmV2ZXJianMub3JnL0xpYnJhcnkvRXJyb2xCcmlja3dvcmtzS2lsbi5tNGFcIjtcbnZhciByZXZlcmJOb2RlID0gYXVkaW9DdHguY3JlYXRlUmV2ZXJiRnJvbVVybChyZXZlcmJVcmwsIGZ1bmN0aW9uKCkge1xuICByZXZlcmJOb2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xufSk7XG5cbnZhciBzZXJ2ZXI7XG52YXIgdXNlciA9IHt9O1xudmFyIHBsYXllckludGVydmFsO1xuXG5jbGFzcyBOb3RlIHtcblx0Y29uc3RydWN0b3IoZnJlcXVlbmN5KSB7XG5cdFx0dGhpcy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XG5cdFx0dGhpcy5vc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdHRoaXMub3NjaWxsYXRvci50eXBlID0gJ3NpbmUnO1xuXHRcdHRoaXMub3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSB0aGlzLmZyZXF1ZW5jeTsgLy8gdmFsdWUgaW4gaGVydHpcblxuXHRcdHRoaXMuZ2Fpbk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC4wO1xuXG5cdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5nYWluTm9kZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblx0XHR0aGlzLmNvbnRleHQgPSBhdWRpb0N0eDtcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5yYW5kb21JblJhbmdlKDEsIDMpO1xuXHRcdHRoaXMucGxheSA9IHRoaXMucGxheS5iaW5kKHRoaXMpO1xuXG5cdH1cblxuXHRyYW5kb21JblJhbmdlKGZyb20sIHRvKSB7XG5cdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoIHRvIC0gZnJvbSApICsgZnJvbSk7XG5cdFx0XHRyID0gci8xMDAwO1xuXHRcdHJldHVybiByO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHRsZXQgZ2FpblZhbHVlID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYgKHRoaXMuZnJlcXVlbmN5ID4gMTAwMCkge1xuXHRcdFx0Z2FpblZhbHVlID0gMC43O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjg7XG5cdFx0fVxuXG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGdhaW5WYWx1ZSwgKHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDAuMDggKyB0aGlzLmRlbGF5KSk7XG5cdFx0ICAgICAgICBcblx0XHR0aGlzLm9zY2lsbGF0b3Iuc3RhcnQodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLnN0b3AoKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0bGV0IHN0b3BUaW1lID0gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMjtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMSwgc3RvcFRpbWUpO1xuICAgICAgICB0aGlzLm9zY2lsbGF0b3Iuc3RvcChzdG9wVGltZSArIDAuMDUpO1xuXHR9XG5cblx0dHdlYWtTdGFydFRpbWUoKSB7XG5cdFx0c2V0VGltZW91dCh0aGlzLnBsYXksIHRoaXMuZGVsYXkpO1xuXHR9XG59XG5cblxuXG5jbGFzcyBTY2FsZSB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdHRoaXMuc2NhbGVUeXBlID0gdGhpcy5wYXJhbXMuc2NhbGVUeXBlO1xuXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdFxuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnBhcmFtcy5rZXk7XG5cdFx0dGhpcy5zdGFydGluZ09jdGF2ZSA9IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlO1xuXG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHRcdHRoaXMuYWxsU3RlcFBhdHRlcm5zID0ge1xuXHRcdFx0J21ham9yJzogWzIsIDIsIDEsIDIsIDIsIDIsIDEsIF0sXG5cdFx0XHQnbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgMiwgMiwgMl0sXG5cdFx0XHQnbWlub3JfaGFybW9uaWMnOiBbMiwgMSwgMiwgMiwgMSwgMywgMSwgXSxcblx0XHRcdCdwZW50YXRvbmljX21ham9yJzogWzIsIDMsIDIsIDMsIDIsIDMsIF0sIC8vIHRoaXMgb25lIGlzIGtpbmRhIGZ1Y2tlZCB1cCB3aGVuIHRoZSBvY3RhdmUgcmVwZWF0c1xuXHRcdFx0J3BlbnRhdG9uaWNfbWlub3InOiBbMywgMiwgMiwgMywgMiwgXSxcblx0XHRcdCdmaWZ0aHMnOiBbNywgMl0sXG5cdFx0XHQnY2hvcmRfbWFqb3InOiBbNCwgMywgMiwgM10sXG5cdFx0XHQnY2hvcmRfbWlub3InOiBbMywgNCwgMl0sXG5cdFx0XHQnY2hvcmRfc3VzJzogWzUsIDIsIDJdLFxuXHRcdFx0J2Nocm9tYXRpYyc6IFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLF1cblx0XHR9XG5cblx0XHQvLyBldmVyeSBzaW5nbGUgbm90ZSBuYW1lIHN0YXJ0aW5nIHdpdGggY1xuXHRcdHRoaXMuY2hyb21hdGljTm90ZXMgPSBbJ2MnLCAnYyMnLCAnZCcsJ2QjJywgJ2UnLCAnZicsICdmIycsJ2cnLCAnZyMnLCAnYScsICdhIycsJ2InLF07XG5cblx0XHQvLyBhdCBsZWFzdCBvbmUgbm90ZSBoYXMgdG8gYmUgaGFyZC1jb2RlZCBmb3IgdGhlIGZvcm11bGEgdG8gd29ya1xuXHRcdHRoaXMuY0ZyZXEgPSAxNi4zNTtcblxuXHRcdC8vIHNlbGVjdCBhIHN0ZXAgcGF0dGVybiBiYXNlZCBvbiBwYXJhbWV0ZXJzXG5cdFx0Zm9yIChuYW1lIGluIHRoaXMuYWxsU3RlcFBhdHRlcm5zKSB7XG5cdFx0XHRpZiAodGhpcy5zY2FsZVR5cGUgPT0gbmFtZSkge1xuXHRcdFx0XHR0aGlzLnN0ZXBBcnJheSA9IHRoaXMuYWxsU3RlcFBhdHRlcm5zW25hbWVdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZpbmRzIG51bWJlciBvZiBzdGVwcyB0byByb290IG5vdGVcblx0XHR0aGlzLnN0ZXBzVG9Sb290ID0gdGhpcy5nZW5lcmF0ZVJvb3RGcmVxKHRoaXMuc3RhcnRpbmdPY3RhdmUsIHRoaXMua2V5KTtcblx0fVxuXG5cdC8vIGZpbmQgc3RlcHMgYmV0d2VlbiB0d28gbm90ZXNcblx0Z2VuZXJhdGVSb290RnJlcShvY3RhdmUsIHN0YXJ0aW5nTm90ZSkge1xuXHRcdGxldCBzdGVwc1RvUm9vdCA9ICgxMiAqIG9jdGF2ZSkgKyB0aGlzLmNocm9tYXRpY05vdGVzLmluZGV4T2Yoc3RhcnRpbmdOb3RlKTtcblx0XHRyZXR1cm4gc3RlcHNUb1Jvb3Q7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBhIHNpbmdsZSBmcmVxdWVuY3kgYmFzZWQgb24gc3RlcHMgZnJvbSBjMFxuXHRnZW5lcmF0ZUZyZXEobnVtYmVyT2ZTdGVwcykge1xuXG5cdFx0Y29uc3QgYSA9IDEuMDU5NDYzMDk0MzU5O1xuXHRcdFxuXHRcdGxldCBmID0gdGhpcy5jRnJlcTtcblx0XHRsZXQgbiA9IG51bWJlck9mU3RlcHM7XG5cblx0XHRsZXQgZnJlcXVlbmN5ID0gZiAqIE1hdGgucG93KGEsIG4pO1xuXG5cdFx0cmV0dXJuICggZnJlcXVlbmN5ICk7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBzY2FsZSBieSBzdGVwcyBhbmQgcm9vdFxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNjYWxlLnB1c2godGhpcy5nZW5lcmF0ZUZyZXEodGhpcy5zdGVwc1RvUm9vdCkpO1xuXHRcdGxldCBzdGVwcyA9IHRoaXMuc3RlcHNUb1Jvb3Q7IC8vIG11bHRpcGx5IHJvb3QgYnkgbnVtYmVyIG9mIG9jdGF2ZXNcblx0XHRsZXQgb2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzO1xuXG5cdFx0aWYgKHRoaXMuc3RlcEFycmF5Lmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDM7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0ZXBBcnJheS5sZW5ndGggPCA1KSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDI7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLm51bWJlck9mT2N0YXZlczsgeCsrKSB7XG5cdFx0XHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyArICB0aGlzLnN0ZXBBcnJheVtpXTtcblx0XHRcdFx0bGV0IGZyZXEgPSB0aGlzLmdlbmVyYXRlRnJlcShzdGVwcyk7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0fVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblx0fVxuXG5cdGdlbmVyYXRlUGxheWVyQXJyYXkoKSB7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHRsZXQgY29sdW1uID0gMDtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDw9IHRoaXMubnVtYmVyT2ZCZWF0czsgeCsrKSB7XG5cdFx0XHQvLyBjb2x1bW5zIChhbGwgdGhlIHNhbWUgaW5kZXggbnVtYmVyKVxuXHRcdFx0dGhpcy5ub3Rlc0FycmF5LnB1c2goW10pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2NhbGUubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0Ly8gcm93cyAoaW5jcmVhc2UgaW5kZXggbnVtYmVyIGJ5IG9uZSlcblxuXHRcdFx0XHR2YXIgY29sdW1uU3RyaW5nO1xuXHRcdFx0XHR2YXIgaW5kZXhTdHJpbmc7XG5cblx0XHRcdFx0aWYgKGluZGV4ID09IHRoaXMuc2NhbGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbHVtbiA8IDEwKSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gYDAke2NvbHVtbn1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGNvbHVtbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpbmRleCA8IDEwKSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBgMCR7aW5kZXh9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGluZGV4O1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRsZXQgYXJyYXlPYmplY3QgPSB7fTtcblx0XHRcdFx0YXJyYXlPYmplY3QuaWQgPSBjb2x1bW5TdHJpbmcrJ18nK2luZGV4U3RyaW5nO1xuXHRcdFx0XHRhcnJheU9iamVjdC5mcmVxdWVuY3kgPSB0aGlzLnNjYWxlW2luZGV4XTtcblx0XHRcdFx0YXJyYXlPYmplY3QudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXG5cdH1cblxuXHR1cGRhdGVJbmRleEFycmF5KGluZm8pIHtcblxuXHRcdGxldCBvYmogPSB7fTtcblx0XHRcdG9iai5jYWxsID0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknO1xuXHRcdFx0b2JqLmlkID0gaW5mby5pZDtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdG9iai52YWwgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b2JqLnZhbCA9IDA7XG5cdFx0XHR9XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0c2VydmVyLnNlbmQob2JqVG9TZW5kKTtcblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdC8vIGRlZmF1bHQgc2V0dGluZ3MgZm9yIHRoZSBmaXJzdCBpbml0ICYgZm9yIG11bHRpcGxheWVyIG1vZGVcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHQna2V5JzogJ2MnLFxuXHRcdFx0J3N0YXJ0aW5nT2N0YXZlJzogNCxcblx0XHRcdCdzY2FsZVR5cGUnOiAncGVudGF0b25pY19taW5vcicsXG5cdFx0XHQnbnVtYmVyT2ZPY3RhdmVzJzogMixcblx0XHRcdCdicG0nOiAxODAsXG5cdFx0XHQnc2lnbmF0dXJlJzogWzQsIDRdLFxuXHRcdFx0J2R1cmF0aW9uJzogNSxcblx0XHR9XG5cblx0XHQvLyBjaGVjayBmb3IgcGFyYW1ldGVyIGFyZ3VtZW50cyBcblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0Ly8gdXNlIGRlZmF1bHQgcGFyYW1zIGlmIG5vIGFyZ3VtZW50c1xuXHRcdFx0dGhpcy5wYXJhbXMgPSB0aGlzLmRlZmF1bHRQYXJhbXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVzZSBhcmd1bWVudHNcblx0XHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdH1cblxuXHRcdHRoaXMuYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpO1xuXG5cdFx0Ly8gY2FsY3VsYXRlIHRoZSB0b3RhbCBudW1iZXIgb2YgYmVhdHMgdG8gZ2V0IHRoZSBudW1iZXIgb2YgY29sdW1uc1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5zaWduYXR1cmVbMF0gKiB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcblxuXHRcdC8vIGNhbGN1bGF0ZSAmIGRlZmluZSB0aGUgaW50ZXJ2YWwgcmF0ZSBmb3IgdGhlIHBsYXllciBpbnRlcnZhbFx0XG5cdFx0dGhpcy5wYXJhbXMuaW50ZXJ2YWxSYXRlID0gNjAwMDAgLyB0aGlzLnBhcmFtcy5icG07XG5cblx0XHQvLyBnZW5lcmF0ZSB0aGUgZnJlcXVlbmN5IHZhbHVlcyBvZiB0aGUgcGxheWVyIGJ1dHRvbnNcblx0XHR0aGlzLnNjYWxlID0gbmV3IFNjYWxlKHRoaXMucGFyYW1zKTtcblx0XHR0aGlzLnBhcmFtcy5zY2FsZSA9IHRoaXMuc2NhbGUuZ2VuZXJhdGUoKTtcblxuXHRcdC8vIGdlbmVyYXRlIHRoZSBncmlkIGZvciB0aGUgaW50ZXJmYWNlXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cdFx0dGhpcy5wbGF5ZXJBcnJheXMgPSB0aGlzLnBsYXllci5nZW5lcmF0ZVBsYXllckFycmF5KCk7XG5cblx0XHQvLyBQbGF5ZXJHcmlkIHJldHVybnMgdGhlIGFycmF5IG9mIG9iamVjdHMgZm9yIGVhY2ggbm90ZSBidXR0b25cblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLnNldFBsYXllckludGVydmFsID0gdGhpcy5zZXRQbGF5ZXJJbnRlcnZhbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucGxheUNvbHVtbiA9IHRoaXMucGxheUNvbHVtbi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuYWxsT2ZmID0gdGhpcy5hbGxPZmYuYmluZCh0aGlzKTtcblx0XHR0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcblxuXHRcdHRoaXMudGVzdFBsYXlDb3VudCA9IDA7XG5cdH1cblxuXHRzZXRQbGF5ZXJJbnRlcnZhbCgpIHtcblx0XHR0aGlzLnhDb3VudCA9IDA7XG5cdFx0cGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5wbGF5Q29sdW1uLCB0aGlzLnBhcmFtcy5pbnRlcnZhbFJhdGUpO1xuXHR9XG5cblx0Ly8gY2xlYXJQbGF5ZXJJbnRlcnZhbCgpIHtcblx0Ly8gXHR3aW5kb3cuY2xlYXJJbnRlcnZhbChwbGF5ZXJJbnRlcnZhbCk7XG5cdC8vIH1cblxuXHQvLyB0ZXN0SW50ZXJ2YWwoKSB7XG5cdC8vIFx0Y29uc29sZS5sb2codGhpcy5jbGVhclBsYXllckludGVydmFsKTtcblx0Ly8gfVxuXG5cdC8vIHJlZnJlc2hBcHAoKSB7XG5cdC8vIFx0dGhpcy5jbGVhclBsYXllckludGVydmFsKCk7XG5cdC8vIFx0dGhpcy5zZXRQbGF5ZXJJbnRlcnZhbCgpO1xuXHQvLyB9XG5cblx0cGxheUNvbHVtbigpIHtcblx0XHR0aGlzLnRlc3RQbGF5Q291bnQrKztcblx0XHR0aGlzLmNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhDb3VudF07XG5cdFxuXHRcdGZvciAodGhpcy55Q291bnQgPSAwOyB0aGlzLnlDb3VudCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IHRoaXMueUNvdW50KyspIHtcblx0XHRcdHRoaXMubm90ZUJ1dHRvbiA9IHRoaXMuY29sdW1uc1t0aGlzLnlDb3VudF0ubm90ZUJ1dHRvbjtcblx0XHRcdHRoaXMuZnJlcXVlbmN5ID0gdGhpcy5jb2x1bW5zW3RoaXMueUNvdW50XS5mcmVxdWVuY3k7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHQvLyBpdCBoYXMgdG8gYmUgYSBuZXcgbm90ZSBldmVyeSB0aW1lIGJlY2F1c2Ugb2YgaG93IHRoZSBnYWluIGZ1bmN0aW9ucyB3b3JrXG5cdFx0XHRcdHRoaXMubm90ZSA9IG5ldyBOb3RlKHRoaXMuZnJlcXVlbmN5KTtcblx0XHRcdFx0dGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0dGhpcy5ub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG5cdFx0XHRcdH0sIHRoaXMucGFyYW1zLmludGVydmFsUmF0ZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyArIDEpIHtcblx0XHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR9XG5cdH1cblxuXHRhbGxPZmYoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGxldCBjb2x1bW5zID0gdGhpcy5ub3RlQXJyYXk7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGNvbHVtbnMubGVuZ3RoOyB4KyspIHtcblx0XHRcdGxldCBidXR0b25zID0gY29sdW1uc1t4XTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgYnV0dG9ucy5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHRpZiAoYnV0dG9uc1t5XS5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRidXR0b25zW3ldLnRvZ2dsZSgpO1xuXHRcdFx0XHRcdGJ1dHRvbnNbeV0udXBkYXRlSW5kZXhBcnJheShidXR0b25zW3ldLm5vdGVCdXR0b24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aW5pdChjb25kaXRpb24pIHtcblx0XHR2YXIgbW91c2Vkb3duID0gZmFsc2U7XG5cdFx0dmFyIGZpcnN0ID0gdHJ1ZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRtb3VzZWRvd24gPSB0cnVlO1xuXHRcdH0pO1xuXG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bW91c2Vkb3duID0gZmFsc2U7XG5cdFx0XHRmaXJzdCA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRmb3IgKHRoaXMueCA9IDA7IHRoaXMueCA8IHRoaXMubm90ZUFycmF5Lmxlbmd0aDsgdGhpcy54KyspIHtcblx0XHRcdHRoaXMuY29sdW1uID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54XTtcblx0XHRcdFxuXHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uY2xhc3NMaXN0LmFkZCgncGxheWVyX19jb2x1bW4nKTtcblxuXHRcdFx0dGhpcy5hcHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wbGF5ZXJDb2x1bW4pO1xuXG5cdFx0XHRmb3IgKHRoaXMueSA9IDA7IHRoaXMueSA8IHRoaXMuY29sdW1uLmxlbmd0aDsgdGhpcy55KyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzLmNvbHVtblt0aGlzLnldO1xuXHRcdFx0XHR2YXIgc3RhdGU7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IGJ1dHRvbi5ub3RlQnV0dG9uLmNsYXNzTGlzdC52YWx1ZTtcblx0XHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XHRcblx0XHRcdFx0XHR9IFxuXG5cdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRidXR0b24ubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKG1vdXNlZG93bikge1xuXHRcdFx0XHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1x0XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmNsYXNzTGlzdC52YWx1ZSAhPSBzdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcdFxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnBsYXllckNvbHVtbi5hcHBlbmRDaGlsZChidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFBsYXllckludGVydmFsKCk7XG5cdH1cbn1cblxuY29uc3QgbXVsdGlQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciBhcHA7XG5cdGxldCBzaGFyZWQgPSB7fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdC8vIG9wZW4gc2VydmVyXG5cdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckFsbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXBwLmFsbE9mZik7XG5cblx0XHRcdC8vIHdoYXQgdG8gZG8gd2hlbiB0aGUgc2VydmVyIHNlbmRzIHVwZGF0ZXNcblx0XHRcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHRcdFx0bGV0IHVwZGF0ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIHVwZGF0ZS5jYWxsIGRlc2NyaWJlcyB0aGUgdHlwZSBvZiBjaGFuZ2UgdG8gbWFrZVxuXHRcdFx0XHRpZiAodXBkYXRlLmNhbGwgPT0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknKSB7XG5cdFx0XHRcdFx0dXBkYXRlUGxheWVyKHVwZGF0ZSk7XHRcblx0XHRcdFx0fSBpZiAodXBkYXRlLmNhbGwgPT0gJ25ld19wYXJ0bmVyX3NldCcpIHtcblx0XHRcdFx0XHRhcHAuYWxsT2ZmKCk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdC8vIFx0YXBwLnJlZnJlc2hBcHAoKTtcblx0Ly8gfVxuXG5cblx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG5cdFx0Ly8gZ2VuZXJhdGUgYSBuZXcgYXBwIGluc3RhbmNlIHdpdGggbXVsdGlwbGF5ZXIgc2V0dGluZ3MsIGJ1dCBkb24ndCBtb3VudCBpdCB1bnRpbCBzZXJ2ZXIgY2FuIHJlc3BvbmRcbiAgICBcdGFwcCA9IG5ldyBBcHA7XG5cblx0XHQvLyBwcm9taXNlIGFsbG93cyBzZXJ2ZXIgdG8gc2VuZCBpbmZvIG9uIG90aGVyIHBsYXllcidzIGJvYXJkIGJlZm9yZSB0aGUgdXNlciBcblx0ICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuXHQgICAgXHQvLyBjcmVhdGUgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlclxuXHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHQgICAgICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcblx0ICAgICAgICBzZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgIFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuXHQgICAgICAgIFx0XHQvLyBwYXJzZSBpbml0aWFsIG1lc3NhZ2Vcblx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdCAgICAgICAgXHRcdC8vIGNoZWNrIHdoZXRoZXIgam9pbmluZyBleGlzdGluZyBnYW1lIG9yIHN0YXJ0aW5nIG5ldyBvbmVcblx0ICAgICAgICBcdFx0aWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ251bGwnKSB7XG5cdCAgIFx0XHRcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHQgICAgICAgIFx0XHRcdGFwcC5pbml0KCdtdWx0aScpO1xuXHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuXHQgICAgICAgIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdE1lc3NhZ2UuYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICBcdFx0XHRcdHVwZGF0ZVBsYXllcihpbml0TWVzc2FnZS5hcnJheVtpXSk7XG5cdCAgICAgICAgXHRcdFx0fVxuXHQgICAgICAgIFx0XHR9XG5cblx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG5cdCAgICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHQgICAgICAgICAgICByZWplY3QoZXJyKTtcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG5cblxuXHQvLyB1cGRhdGUgaGFuZGxlclxuXHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG5cdFx0Ly8gdGFyZ2V0IHNwZWNpZmljYWxseSB0aGUgYnV0dG9uIHRoYXQgaXMgY2hhbmdpbmdcblx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWVzc2FnZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMSkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIHRydWUgYW5kIGJ1dHRvbiBpcyBmYWxzZSwgc2V0IGJ1dHRvbiB0byB0cnVlIGJ5IGFkZGluZyAnYWN0aXZlJyB0byBjbGFzc2xpc3Rcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXG5cdHNoYXJlZC5pbml0ID0gaW5pdDtcblx0Ly8gc2hhcmVkLnJlZnJlc2ggPSByZWZyZXNoO1xuXHRyZXR1cm4gc2hhcmVkO1xufSgpKTtcblxubXVsdGlQbGF5ZXIuaW5pdCgpO1xuIl19
=======
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgYXVkaW9DdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbnJldmVyYmpzLmV4dGVuZChhdWRpb0N0eCk7XG5cbnZhciByZXZlcmJVcmwgPSBcImh0dHA6Ly9yZXZlcmJqcy5vcmcvTGlicmFyeS9FcnJvbEJyaWNrd29ya3NLaWxuLm00YVwiO1xudmFyIHJldmVyYk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVSZXZlcmJGcm9tVXJsKHJldmVyYlVybCwgZnVuY3Rpb24oKSB7XG4gIHJldmVyYk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG59KTtcblxudmFyIHNlcnZlcjtcbnZhciB1c2VyID0ge307XG5cblxuY29uc3QgZnJlcXVlbmNpZXMgPSBbXHRcblx0MTMwLjgxLFxuXHQxMzguNTksXG5cdDE0Ni44Myxcblx0MTU1LjU2LFxuXHQxNjQuODEsXG5cdDE3NC42MSxcblx0MTg1LjAwLFxuXHQxOTYuMDAsXG5cdDIwNy42NSxcblx0MjIwLjAwLFxuXHQyMzMuMDgsXG5cdDI0Ni45NCxcblx0MjYxLjYzLFxuXHQyNzcuMTgsXG5cdDI5My42Nixcblx0MzExLjEzLFxuXHQzMjkuNjMsXG5cdDM0OS4yMyxcblx0MzY5Ljk5LFxuXHQzOTIuMDAsXG5cdDQxNS4zMCxcblx0NDQwLjAwLFxuXHQ0NjYuMTYsXG5cdDQ5My44OCxcblx0NTIzLjI1LFxuXHQ1NTQuMzcsXG5cdDU4Ny4zMyxcblx0NjIyLjI1LFxuXHQ2NTkuMjUsXG5cdDY5OC40Nixcblx0NzM5Ljk5LFxuXHQ3ODMuOTksXG5cdDgzMC42MSxcblx0ODgwLjAwLFxuXHQ5MzIuMzMsXG5cdDk4Ny43Nyxcblx0MTA0Ni41MCxcblx0MTEwOC43Myxcblx0MTE3NC42Nixcblx0MTI0NC41MSxcblx0MTMxOC41MSxcblx0MTM5Ni45MSxcblx0MTQ3OS45OCxcblx0MTU2Ny45OCxcblx0MTY2MS4yMixcblx0MTc2MC4wMCxcblx0MTg2NC42Nixcblx0MTk3NS41Myxcbl07XG5cbmNvbnN0IFx0YzIgPSBmcmVxdWVuY2llc1swXSxcblx0XHRjczIgPSBmcmVxdWVuY2llc1sxXSxcblx0XHRkMiA9IGZyZXF1ZW5jaWVzWzJdLFxuXHRcdGRzMiA9IGZyZXF1ZW5jaWVzWzNdLFxuXHRcdFxuXHRcdGUyID0gZnJlcXVlbmNpZXNbNF0sXG5cdFx0ZjIgPSBmcmVxdWVuY2llc1s1XSxcblx0XHRmczIgPSBmcmVxdWVuY2llc1s2XSxcblx0XHRnMiA9IGZyZXF1ZW5jaWVzWzddLFxuXHRcdGdzMiA9IGZyZXF1ZW5jaWVzWzhdLFxuXHRcdGEyID0gZnJlcXVlbmNpZXNbOV0sXG5cdFx0YXMyID0gZnJlcXVlbmNpZXNbMTBdLFxuXHRcdFxuXHRcdGIyID0gZnJlcXVlbmNpZXNbMTFdLFxuXHRcdGMzID0gZnJlcXVlbmNpZXNbMTJdLFxuXHRcdGNzMyA9IGZyZXF1ZW5jaWVzWzEzXSxcblx0XHRkMyA9IGZyZXF1ZW5jaWVzWzE0XSxcblx0XHRkczMgPSBmcmVxdWVuY2llc1sxNV0sXG5cdFx0XG5cdFx0ZTMgPSBmcmVxdWVuY2llc1sxNl0sXG5cdFx0ZjMgPSBmcmVxdWVuY2llc1sxN10sXG5cdFx0ZnMzID0gZnJlcXVlbmNpZXNbMThdLFxuXHRcdGczID0gZnJlcXVlbmNpZXNbMTldLFxuXHRcdGdzMyA9IGZyZXF1ZW5jaWVzWzIwXSxcblx0XHRhMyA9IGZyZXF1ZW5jaWVzWzIxXSxcblx0XHRhczMgPSBmcmVxdWVuY2llc1syMl0sXG5cdFx0XG5cdFx0YjMgPSBmcmVxdWVuY2llc1syM10sXG5cdFx0YzQgPSBmcmVxdWVuY2llc1syNF0sXG5cdFx0Y3M0ID0gZnJlcXVlbmNpZXNbMjVdLFxuXHRcdGQ0ID0gZnJlcXVlbmNpZXNbMjZdLFxuXHRcdGRzNCA9IGZyZXF1ZW5jaWVzWzI3XSxcblx0XHRcblx0XHRlNCA9IGZyZXF1ZW5jaWVzWzI4XSxcblx0XHRmNCA9IGZyZXF1ZW5jaWVzWzI5XSxcblx0XHRmczQgPSBmcmVxdWVuY2llc1szMF0sXG5cdFx0ZzQgPSBmcmVxdWVuY2llc1szMV0sXG5cdFx0Z3M0ID0gZnJlcXVlbmNpZXNbMzJdLFxuXHRcdGE0ID0gZnJlcXVlbmNpZXNbMzNdLFxuXHRcdGFzNCA9IGZyZXF1ZW5jaWVzWzM0XSxcblx0XHRcblx0XHRiNCA9IGZyZXF1ZW5jaWVzWzM1XSxcblx0XHRjNSA9IGZyZXF1ZW5jaWVzWzM2XSxcblx0XHRjczUgPSBmcmVxdWVuY2llc1szN10sXG5cdFx0ZDUgPSBmcmVxdWVuY2llc1szOF0sXG5cdFx0ZHM1ID0gZnJlcXVlbmNpZXNbMzldLFxuXHRcdFxuXHRcdGU1ID0gZnJlcXVlbmNpZXNbNDBdLFxuXHRcdGY1ID0gZnJlcXVlbmNpZXNbNDFdLFxuXHRcdGZzNSA9IGZyZXF1ZW5jaWVzWzQyXSxcblx0XHRnNSA9IGZyZXF1ZW5jaWVzWzQzXSxcblx0XHRnczUgPSBmcmVxdWVuY2llc1s0NF0sXG5cdFx0YTUgPSBmcmVxdWVuY2llc1s0NV0sXG5cdFx0YXM1ID0gZnJlcXVlbmNpZXNbNDZdLFxuXHRcdFxuXHRcdGI1ID0gZnJlcXVlbmNpZXNbNDddLFxuXHRcdGM2ID0gZnJlcXVlbmNpZXNbNDhdLFxuXHRcdGNzNiA9IGZyZXF1ZW5jaWVzWzQ5XSxcblx0XHRkNiA9IGZyZXF1ZW5jaWVzWzUwXSxcblx0XHRkczYgPSBmcmVxdWVuY2llc1s1MV0sXG5cdFx0XG5cdFx0ZTYgPSBmcmVxdWVuY2llc1s1Ml0sXG5cdFx0ZjYgPSBmcmVxdWVuY2llc1s1M10sXG5cdFx0ZnM2ID0gZnJlcXVlbmNpZXNbNTRdLFxuXHRcdGc2ID0gZnJlcXVlbmNpZXNbNTVdLFxuXHRcdGdzNiA9IGZyZXF1ZW5jaWVzWzU2XSxcblx0XHRhNiA9IGZyZXF1ZW5jaWVzWzU3XSxcblx0XHRhczYgPSBmcmVxdWVuY2llc1s1OF0sXG5cdFx0XG5cdFx0YjYgPSBmcmVxdWVuY2llc1s1OV07XG5cbmNsYXNzIE5vdGUge1xuXHRjb25zdHJ1Y3RvcihmcmVxdWVuY3kpIHtcblx0XHR0aGlzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcblx0XHR0aGlzLm9zY2lsbGF0b3IgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLnR5cGUgPSAnc2luZSc7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuZnJlcXVlbmN5OyAvLyB2YWx1ZSBpbiBoZXJ0elxuXG5cdFx0dGhpcy5nYWluTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjA7XG5cblx0XHR0aGlzLm9zY2lsbGF0b3IuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXHRcdHRoaXMuY29udGV4dCA9IGF1ZGlvQ3R4O1xuXHRcdHRoaXMuZGVsYXkgPSB0aGlzLnJhbmRvbUluUmFuZ2UoMSwgMyk7XG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5wbGF5LmJpbmQodGhpcyk7XG5cblx0fVxuXG5cdHJhbmRvbUluUmFuZ2UoZnJvbSwgdG8pIHtcblx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICggdG8gLSBmcm9tICkgKyBmcm9tKTtcblx0XHRcdHIgPSByLzEwMDA7XG5cdFx0cmV0dXJuIHI7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdGxldCBnYWluVmFsdWUgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiAodGhpcy5mcmVxdWVuY3kgPiAxMDAwKSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuODtcblx0XHR9XG5cblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoZ2FpblZhbHVlLCAodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMC4wOCArIHRoaXMuZGVsYXkpKTtcblx0XHQgICAgICAgIFxuXHRcdHRoaXMub3NjaWxsYXRvci5zdGFydCh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuc3RvcCgpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHRsZXQgc3RvcFRpbWUgPSB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAyO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKDAuMDAxLCBzdG9wVGltZSk7XG4gICAgICAgIHRoaXMub3NjaWxsYXRvci5zdG9wKHN0b3BUaW1lICsgMC4wNSk7XG5cdH1cblxuXHR0d2Vha1N0YXJ0VGltZSgpIHtcblx0XHRzZXRUaW1lb3V0KHRoaXMucGxheSwgdGhpcy5kZWxheSk7XG5cdH1cbn1cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLnJvb3ROb3RlID0gdGhpcy5wYXJhbXMucm9vdE5vdGU7XG5cdFx0dGhpcy5zY2FsZU5hbWUgPSB0aGlzLnBhcmFtcy5zY2FsZU5hbWU7XG5cdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLnBhcmFtcy5udW1iZXJPZk9jdGF2ZXM7XG5cdFx0dGhpcy5zdGFydGluZ0luZGV4ID0gZnJlcXVlbmNpZXMuaW5kZXhPZih0aGlzLnJvb3ROb3RlKTtcblx0XHR0aGlzLnNjYWxlID0gW107XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHRsZXQgeCA9IHRoaXMuc3RhcnRpbmdJbmRleDtcblxuXHRcdGNvbnN0IHcgPSAyO1xuXHRcdGNvbnN0IGggPSAxO1xuXHRcdGNvbnN0IG8gPSAxMztcblxuXHRcdC8vIGNvbnN0IHN0ZXBBcnJheSA9IHtcblx0XHQvLyBcdCdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyLCAxXSxcblx0XHQvLyBcdCdtaW5vcic6IFtdXG5cdFx0Ly8gfVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtYWpvcicpIHtcblx0XHRcdC8vIFIsIFcsIFcsIEgsIFcsIFcsIFcsIEhcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3InKSB7IFxuXHRcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgVywgV1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtaW5vcl9oYXJtb25pYycpIHsgXG5cdFx0XHQvLyBSLCBXLCBILCBXLCBXLCBILCAxIDEvMiwgSFxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWFqb3InKSB7XG5cdFx0XHQvLyBXIFcgMS0xLzIgc3RlcCBXIDEtMS8yIHN0ZXBcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAxIDEvMiwgVywgVywgMSAxLzIsIFdcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnZmlmdGhzJykge1xuXHRcdFx0Ly8gUiwgN1xuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDQuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9tYWpvcicpIHtcblx0XHRcdC8vIFIsIDQsIDNcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyAzO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnY2hvcmRfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAzLCA0XG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDM7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDQ7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2Nob3JkX3N1cycpIHtcblx0XHRcdC8vIFIsIDUsIDJcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNTtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgMjtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNjYWxlO1xuXHR9XG59XG5cbmNsYXNzIFBsYXllckdyaWQge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLm51bWJlck9mQmVhdHMgPSBwYXJhbXMubnVtYmVyT2ZCZWF0cztcblx0XHR0aGlzLnNjYWxlID0gcGFyYW1zLnNjYWxlO1xuXHRcdHRoaXMubm90ZXNBcnJheSA9IFtdO1xuXHR9XG5cblx0Z2VuZXJhdGVQbGF5ZXJBcnJheSgpIHtcblx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdGxldCBjb2x1bW4gPSAwO1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPD0gdGhpcy5udW1iZXJPZkJlYXRzOyB4KyspIHtcblx0XHRcdC8vY29sdW1ucyAoYWxsIHRoZSBzYW1lIGluZGV4IG51bWJlcilcblx0XHRcdHRoaXMubm90ZXNBcnJheS5wdXNoKFtdKTtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNjYWxlLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdC8vcm93cyAoaW5jcmVhc2UgaW5kZXggbnVtYmVyIGJ5IG9uZSlcblxuXHRcdFx0XHR2YXIgY29sdW1uU3RyaW5nO1xuXHRcdFx0XHR2YXIgaW5kZXhTdHJpbmc7XG5cblx0XHRcdFx0aWYgKGluZGV4ID09IHRoaXMuc2NhbGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbHVtbiA8IDEwKSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gYDAke2NvbHVtbn1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGNvbHVtbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpbmRleCA8IDEwKSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBgMCR7aW5kZXh9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGluZGV4O1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRsZXQgYXJyYXlPYmplY3QgPSB7fTtcblx0XHRcdFx0YXJyYXlPYmplY3QuaWQgPSBjb2x1bW5TdHJpbmcrJ18nK2luZGV4U3RyaW5nO1xuXHRcdFx0XHRhcnJheU9iamVjdC5mcmVxdWVuY3kgPSB0aGlzLnNjYWxlW2luZGV4XTtcblx0XHRcdFx0YXJyYXlPYmplY3QudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHQvLyBub3RlQnV0dG9uLmlubmVySFRNTCA9IGFycmF5T2JqZWN0LmZyZXF1ZW5jeTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXHR9XG5cblx0dXBkYXRlSW5kZXhBcnJheShpbmZvKSB7XG5cdFx0Y29uc29sZS5sb2coaW5mbyk7XG5cblx0XHRsZXQgb2JqID0ge307XG5cdFx0XHRvYmouY2FsbCA9ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jztcblx0XHRcdG9iai5pZCA9IGluZm8uaWQ7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRvYmoudmFsID0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9iai52YWwgPSAwO1xuXHRcdFx0fVxuXG5cdFx0Y29uc3Qgb2JqVG9TZW5kID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblxuXHRcdHNlcnZlci5zZW5kKG9ialRvU2VuZCk7XG5cdH1cblxuXHR0b2dnbGUoKSB7XG5cdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHRyb290Tm90ZTogYzIsXG5cdFx0XHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHRcdGJwbTogMTAwLFxuXHRcdFx0ZHVyYXRpb246IDQsXG5cdFx0XHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHR9O1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR9XG5cblx0XHR0aGlzLnBhcmFtcy5iZWF0cyA9IHRoaXMucGFyYW1zLnNpZ25hdHVyZVswXTtcblx0XHR0aGlzLnBhcmFtcy5tZWFzdXJlID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzFdO1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5kdXJhdGlvbip0aGlzLnBhcmFtcy5iZWF0cztcblx0XHR0aGlzLnBhcmFtcy50aW1lID0gdGhpcy5wYXJhbXMuYnBtICogNDtcblxuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLnNldFBsYXlJbnRlcnZhbCA9IHRoaXMuc2V0UGxheUludGVydmFsLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5wbGF5Q29sdW1uID0gdGhpcy5wbGF5Q29sdW1uLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5yZWZyZXNoQXBwID0gdGhpcy5yZWZyZXNoQXBwO1xuXG5cdFx0dGhpcy5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJyk7XG5cdH1cblxuXHRyZWZyZXNoQXBwKCkge1xuXHRcdHRoaXMuYXBwQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG5cdFx0dGhpcy5nZW5lcmF0ZUFwcCgpO1xuXHR9XG5cblx0c2V0UGxheUludGVydmFsKCkge1xuXHRcdHRoaXMueENvdW50ID0gMDtcblxuXHRcdGlmICh0aGlzLnBsYXllckludGVydmFsKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMucGxheWVySW50ZXJ2YWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBsYXllckludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucGxheUNvbHVtbiwgdGhpcy5wYXJhbXMudGltZSk7XG5cdFx0fVxuXHR9XG5cblx0cGxheUNvbHVtbigpIHtcblxuXHRcdHRoaXMuY29sdW1ucyA9IHRoaXMubm90ZUFycmF5W3RoaXMueENvdW50XTtcblx0XG5cdFx0Zm9yICh0aGlzLnlDb3VudCA9IDA7IHRoaXMueUNvdW50IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgdGhpcy55Q291bnQrKykge1xuXHRcdFx0dGhpcy5ub3RlQnV0dG9uID0gdGhpcy5jb2x1bW5zW3RoaXMueUNvdW50XS5ub3RlQnV0dG9uO1xuXHRcdFx0dGhpcy5mcmVxdWVuY3kgPSB0aGlzLmNvbHVtbnNbdGhpcy55Q291bnRdLmZyZXF1ZW5jeTtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdC8vIGl0IGhhcyB0byBiZSBhIG5ldyBub3RlIGV2ZXJ5IHRpbWUgYmVjYXVzZSBvZiBob3cgdGhlIGdhaW4gZnVuY3Rpb25zIHdvcmtcblx0XHRcdFx0dGhpcy5ub3RlID0gbmV3IE5vdGUodGhpcy5mcmVxdWVuY3kpO1xuXHRcdFx0XHR0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuXHRcdFx0XHR0aGlzLm5vdGUudHdlYWtTdGFydFRpbWUoKTtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXlpbmcnKTtcblx0XHRcdFx0fSwgdGhpcy5wYXJhbXMudGltZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyArIDEpIHtcblx0XHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR9XG5cdH1cblxuXHRpbml0KGNvbmRpdGlvbikge1xuXHRcdHZhciBtb3VzZWRvd24gPSBmYWxzZTtcblx0XHR2YXIgZmlyc3QgPSB0cnVlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdG1vdXNlZG93biA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bW91c2Vkb3duID0gZmFsc2U7XG5cdFx0XHRmaXJzdCA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRmb3IgKHRoaXMueCA9IDA7IHRoaXMueCA8IHRoaXMubm90ZUFycmF5Lmxlbmd0aDsgdGhpcy54KyspIHtcblx0XHRcdHRoaXMuY29sdW1uID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54XTtcblx0XHRcdFxuXHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uY2xhc3NMaXN0LmFkZCgncGxheWVyX19jb2x1bW4nKTtcblxuXHRcdFx0dGhpcy5hcHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wbGF5ZXJDb2x1bW4pO1xuXG5cdFx0XHRmb3IgKHRoaXMueSA9IDA7IHRoaXMueSA8IHRoaXMuY29sdW1uLmxlbmd0aDsgdGhpcy55KyspIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxldCBidXR0b24gPSB0aGlzLmNvbHVtblt0aGlzLnldO1xuXHRcdFx0XHR2YXIgc3RhdGU7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCFtb3VzZWRvd24gJiYgZmlyc3QpIHtcblx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcblx0XHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdFx0Zmlyc3QgPSBmYWxzZTtcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChtb3VzZWRvd24pIHtcblx0XHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5jbGFzc0xpc3QudmFsdWUgIT0gc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XHRcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ211bHRpJyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRoaXMucGxheWVyQ29sdW1uLmFwcGVuZENoaWxkKGJ1dHRvbi5ub3RlQnV0dG9uKTtcblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0UGxheUludGVydmFsKCk7XG5cdH1cbn1cblxuY29uc3QgbXVsdGlQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdC8vIG9wZW4gc2VydmVyXG5cdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblxuXHRcdFx0Ly8gd2hhdCB0byBkbyB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgdXBkYXRlc1xuXHRcdFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuXHRcdFx0XHRsZXQgdXBkYXRlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gdXBkYXRlLmNhbGwgZGVzY3JpYmVzIHRoZSB0eXBlIG9mIGNoYW5nZSB0byBtYWtlXG5cdFx0XHRcdGlmICh1cGRhdGUuY2FsbCA9PSAndXBkYXRlX3RvZ2dsZV9hcnJheScpIHtcblx0XHRcdFx0XHR1cGRhdGVQbGF5ZXIodXBkYXRlKTtcdFxuXHRcdFx0XHR9IGlmICh1cGRhdGUuY2FsbCA9PSAnbmV3X3BhcnRuZXJfc2V0Jykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHVwZGF0ZSk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG5cdFx0Ly8gZ2VuZXJhdGUgYSBuZXcgYXBwIGluc3RhbmNlIHdpdGggbXVsdGlwbGF5ZXIgc2V0dGluZ3MsIGJ1dCBkb24ndCBtb3VudCBpdCB1bnRpbCBzZXJ2ZXIgY2FuIHJlc3BvbmRcbiAgICBcdHZhciBhcHAgPSBuZXcgQXBwO1xuXG5cdFx0Ly8gcHJvbWlzZSBhbGxvd3Mgc2VydmVyIHRvIHNlbmQgaW5mbyBvbiBvdGhlciBwbGF5ZXIncyBib2FyZCBiZWZvcmUgdGhlIHVzZXIgXG5cdCAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cblx0ICAgICAgICAvLyB3YWl0IHVudGlsIHNlcnZlciByZXNwb25kcyBiZWZvcmUgZmluaXNoaW5nIGJ1aWxkXG5cdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICBcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuXHQgICAgICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHQgICBcdFx0XHRcdFx0YXBwLmluaXQoJ211bHRpJyk7XG5cdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcblx0ICAgICAgICBcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0ICAgICAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluaXRNZXNzYWdlLmFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0fVxuXG5cdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuXHQgICAgICAgIFx0XHRyZXNvbHZlKHNlcnZlcik7XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VydmVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxuXG5cblx0Ly8gdXBkYXRlIGhhbmRsZXJcblx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG5cdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG5cdFx0aWYgXHQoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMCkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDEpIHtcblx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuICh7aW5pdCA6IGluaXQgfSk7XG59KCkpO1xuIl19
>>>>>>> origin/master
