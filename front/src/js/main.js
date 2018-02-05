var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioCtx);

var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(audioCtx.destination);
});

var server;
var user = {};

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
			'startingOctave': 3,
			'scaleType': 'pentatonic_minor',
			'numberOfOctaves': 3,
			'bpm': 150,
			'signature': [4, 4],
			'duration': 8,
			'activeNotes': [],
		}

		// check for parameter arguments 
		if (!params) {
			// use default params if no arguments
			this.params = this.defaultParams;
		} else {
			// use arguments
			this.params = params;
		}

		// // grab all controls to use throughout app
		// this.controls = {
		// 	'scaleSelector': scaleSelector,
		// 	'rootSelector': rootSelector,
		// 	'octavesSelector': octavesNumSelector,
		// 	'upOctave': upOctave,
		// 	'downOctave': downOctave
		// }

		this.appContainer = document.getElementById('appPlayer');

		// calculate the total number of beats to get the number of columns
		this.params.numberOfBeats = this.params.signature[0] * this.params.duration;

		// calculate & define the interval rate for the player interval	
		this.params.intervalRate = 60000 / this.params.bpm;

		
		this.generateGrid = this.generateGrid.bind(this);
		this.setPlayerInterval = this.setPlayerInterval.bind(this);
		this.clearPlayerInterval = this.clearPlayerInterval.bind(this);
		this.playColumn = this.playColumn.bind(this);
		this.init = this.init.bind(this);
		this.refreshApp = this.refreshApp.bind(this);
		this.recordState = this.recordState.bind(this);
		this.restoreState = this.restoreState.bind(this);


		this.testPlayCount = 0;
	}

	generateGrid() {
		// generate the frequency values of the player buttons
		this.scale = new Scale(this.params);
		this.params.scale = this.scale.generate();

		// generate the grid for the interface
		this.player = new PlayerGrid(this.params);
		this.playerArrays = this.player.generatePlayerArray();

		// PlayerGrid returns the array of objects for each note button
		this.noteArray = this.playerArrays.notesArray;
	}

	setPlayerInterval() {
		this.xCount = 0;
		this.playerInterval = window.setInterval(this.playColumn, this.params.intervalRate);
	}

	clearPlayerInterval() {
		return new Promise((resolve, reject) => {
			clearInterval(this.playerInterval);
			console.log('clear');
			resolve();
		});
	}

	refreshApp(e) {
		e.preventDefault();
		let trigger = e.srcElement;


		this.recordState()
		.then( this.clearPlayerInterval )
		.then(() => {
			document.getElementById('appPlayer').innerHTML = '';
		})
		.then(() => {
			if (trigger.id == 'upOctave') {
				if (this.params.startingOctave == 0) {
					return;
				} else {
					this.params.startingOctave++;	
				}
			} else if (trigger.id == 'downOctave'){
				if (this.params.startingOctave == 10) {
					return;
				} else {
					this.params.startingOctave--;
				}
			} else {
				this.params[trigger.id] = trigger.value;
			}
		}).then( this.generateGrid )
		.then( this.restoreState );

		

		// setTimeout(this.restoreState, 1000);

		// get record of all the on/off buttons
		// hold it
		// recreate grid as needed
		// change bpm if needed
		// will need a pause function perhaps
		// after recreating everything reset the buttons on or off
		// unpause
		// this.clearPlayerInterval();
		// this.setPlayerInterval();
	}

	recordState() {
		let activeNotes = document.querySelectorAll('.active'); 
		let savedNotes = this.params.activeNotes;
		return new Promise(function(resolve, reject) {
			savedNotes = [];
			for (var i = 0; i < activeNotes.length; i++) {
				savedNotes.push(activeNotes[i].id);
			}
			console.log('resolving');
			resolve(savedNotes);
		});
	}

	restoreState() {
		for (var i = 0; i < this.params.activeNotes.length; i++) {
			document.getElementById(this.params.activeNotes[i]).classList.add('active');
		}
	}

	playColumn() {
		let columns = this.noteArray[this.xCount];
	
		for (this.yCount = 0; this.yCount < columns.length; this.yCount++) {
			let noteButton = columns[this.yCount].noteButton;
			let frequency = columns[this.yCount].frequency;

			if (noteButton.classList.contains('active')) {
				// it has to be a new note every time because of how the gain functions work
				let note = new Note(frequency);
					noteButton.classList.add('playing');
					note.tweakStartTime();
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

	allOff() {

		let columns = this.noteArray;

		for (var x = 0; x < columns.length; x++) {

			let buttons = columns[x];
			for (var y = 0; y < buttons.length; y++) {
				if (buttons[y].noteButton.classList.contains('active')) {
					buttons[y].toggle();

					if (this.condition == 'multi' ) {
						buttons[y].updateIndexArray(buttons[y].noteButton);
					}
				}
			}
		}
	}

	init(condition) {
		this.generateGrid();

		var mousedown = false;
		var first = true;
		this.condition = condition;

		window.addEventListener('mousedown', function(e) {
			mousedown = true;
		});


		window.addEventListener('mouseup', function() {
			mousedown = false;
			first = true;
		});

		for (this.x = 0; this.x < this.noteArray.length; this.x++) {
			let column = this.noteArray[this.x];
			
			let playerColumn = document.createElement('div');
				playerColumn.classList.add('player__column');

			this.appContainer.appendChild(playerColumn);

			for (this.y = 0; this.y < column.length; this.y++) {
				
				let button = column[this.y];
				var state;

				button.noteButton.addEventListener('mousedown', function() {
					button.toggle();
					state = button.noteButton.classList.value;
					first = false;	

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

				
				playerColumn.appendChild(button.noteButton);
			}	
		}

		if (condition == '1p') {
			let controls = document.querySelectorAll('select');
			for (var i = 0; i < controls.length; i++) {
				controls[i].onchange = this.refreshApp;
			}
			document.getElementById('upOctave').onclick = this.refreshApp;
			document.getElementById('downOctave').onclick = this.refreshApp;
		}

		this.setPlayerInterval();
	}
}

const MultiPlayer = (function() {
	var app;
	let shared = {};

	function init() {
		// open server
		connectToServer().then(function(server) {
			document.getElementById('clearAll').addEventListener('click', function(e) {
				e.preventDefault();
				app.allOff();
			});

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

	function refresh() {
		app.refreshApp();
	}


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
	shared.refresh = refresh;
	return shared;
}());

const SinglePlayer = (function() {
	let app = new App;

	function init() {
		app.init('1p');
		document.getElementById('clearAll').addEventListener('click', function(e) {
			e.preventDefault();
			app.allOff();
		});
	}
	
	return { init: init };	
}());

SinglePlayer.init();

// MultiPlayer.init();