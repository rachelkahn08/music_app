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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXVkaW9DdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbnJldmVyYmpzLmV4dGVuZChhdWRpb0N0eCk7XG5cbnZhciByZXZlcmJVcmwgPSBcImh0dHA6Ly9yZXZlcmJqcy5vcmcvTGlicmFyeS9FcnJvbEJyaWNrd29ya3NLaWxuLm00YVwiO1xudmFyIHJldmVyYk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVSZXZlcmJGcm9tVXJsKHJldmVyYlVybCwgZnVuY3Rpb24oKSB7XG4gIHJldmVyYk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG59KTtcblxudmFyIHNlcnZlcjtcbnZhciB1c2VyID0ge307XG5cbmNsYXNzIE5vdGUge1xuXHRjb25zdHJ1Y3RvcihmcmVxdWVuY3kpIHtcblx0XHR0aGlzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcblx0XHR0aGlzLm9zY2lsbGF0b3IgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLnR5cGUgPSAnc2luZSc7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuZnJlcXVlbmN5OyAvLyB2YWx1ZSBpbiBoZXJ0elxuXG5cdFx0dGhpcy5nYWluTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjA7XG5cblx0XHR0aGlzLm9zY2lsbGF0b3IuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXHRcdHRoaXMuY29udGV4dCA9IGF1ZGlvQ3R4O1xuXHRcdHRoaXMuZGVsYXkgPSB0aGlzLnJhbmRvbUluUmFuZ2UoMSwgMyk7XG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5wbGF5LmJpbmQodGhpcyk7XG5cblx0fVxuXG5cdHJhbmRvbUluUmFuZ2UoZnJvbSwgdG8pIHtcblx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICggdG8gLSBmcm9tICkgKyBmcm9tKTtcblx0XHRcdHIgPSByLzEwMDA7XG5cdFx0cmV0dXJuIHI7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdGxldCBnYWluVmFsdWUgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiAodGhpcy5mcmVxdWVuY3kgPiAxMDAwKSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuODtcblx0XHR9XG5cblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoZ2FpblZhbHVlLCAodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMC4wOCArIHRoaXMuZGVsYXkpKTtcblx0XHQgICAgICAgIFxuXHRcdHRoaXMub3NjaWxsYXRvci5zdGFydCh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuc3RvcCgpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHRsZXQgc3RvcFRpbWUgPSB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAyO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKDAuMDAxLCBzdG9wVGltZSk7XG4gICAgICAgIHRoaXMub3NjaWxsYXRvci5zdG9wKHN0b3BUaW1lICsgMC4wNSk7XG5cdH1cblxuXHR0d2Vha1N0YXJ0VGltZSgpIHtcblx0XHRzZXRUaW1lb3V0KHRoaXMucGxheSwgdGhpcy5kZWxheSk7XG5cdH1cbn1cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLnNjYWxlVHlwZSA9IHRoaXMucGFyYW1zLnNjYWxlVHlwZTtcblx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMucGFyYW1zLm51bWJlck9mT2N0YXZlcztcblx0XHRcblxuXHRcdHRoaXMua2V5ID0gdGhpcy5wYXJhbXMua2V5O1xuXHRcdHRoaXMuc3RhcnRpbmdPY3RhdmUgPSB0aGlzLnBhcmFtcy5zdGFydGluZ09jdGF2ZTtcblxuXHRcdHRoaXMuc2NhbGUgPSBbXTtcblx0XHR0aGlzLmFsbFN0ZXBQYXR0ZXJucyA9IHtcblx0XHRcdCdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyLCAxLCBdLFxuXHRcdFx0J21pbm9yJzogWzIsIDEsIDIsIDIsIDEsIDIsIDIsIDJdLFxuXHRcdFx0J21pbm9yX2hhcm1vbmljJzogWzIsIDEsIDIsIDIsIDEsIDMsIDEsIF0sXG5cdFx0XHQncGVudGF0b25pY19tYWpvcic6IFsyLCAzLCAyLCAzLCAyLCAzLCBdLCAvLyB0aGlzIG9uZSBpcyBraW5kYSBmdWNrZWQgdXAgd2hlbiB0aGUgb2N0YXZlIHJlcGVhdHNcblx0XHRcdCdwZW50YXRvbmljX21pbm9yJzogWzMsIDIsIDIsIDMsIDIsIF0sXG5cdFx0XHQnZmlmdGhzJzogWzcsIDJdLFxuXHRcdFx0J2Nob3JkX21ham9yJzogWzQsIDMsIDIsIDNdLFxuXHRcdFx0J2Nob3JkX21pbm9yJzogWzMsIDQsIDJdLFxuXHRcdFx0J2Nob3JkX3N1cyc6IFs1LCAyLCAyXSxcblx0XHRcdCdjaHJvbWF0aWMnOiBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSxdXG5cdFx0fVxuXG5cdFx0Ly8gZXZlcnkgc2luZ2xlIG5vdGUgbmFtZSBzdGFydGluZyB3aXRoIGNcblx0XHR0aGlzLmNocm9tYXRpY05vdGVzID0gWydjJywgJ2MjJywgJ2QnLCdkIycsICdlJywgJ2YnLCAnZiMnLCdnJywgJ2cjJywgJ2EnLCAnYSMnLCdiJyxdO1xuXG5cdFx0Ly8gYXQgbGVhc3Qgb25lIG5vdGUgaGFzIHRvIGJlIGhhcmQtY29kZWQgZm9yIHRoZSBmb3JtdWxhIHRvIHdvcmtcblx0XHR0aGlzLmNGcmVxID0gMTYuMzU7XG5cblx0XHQvLyBzZWxlY3QgYSBzdGVwIHBhdHRlcm4gYmFzZWQgb24gcGFyYW1ldGVyc1xuXHRcdGZvciAobmFtZSBpbiB0aGlzLmFsbFN0ZXBQYXR0ZXJucykge1xuXHRcdFx0aWYgKHRoaXMuc2NhbGVUeXBlID09IG5hbWUpIHtcblx0XHRcdFx0dGhpcy5zdGVwQXJyYXkgPSB0aGlzLmFsbFN0ZXBQYXR0ZXJuc1tuYW1lXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBmaW5kcyBudW1iZXIgb2Ygc3RlcHMgdG8gcm9vdCBub3RlXG5cdFx0dGhpcy5zdGVwc1RvUm9vdCA9IHRoaXMuZ2VuZXJhdGVSb290RnJlcSh0aGlzLnN0YXJ0aW5nT2N0YXZlLCB0aGlzLmtleSk7XG5cdH1cblxuXHQvLyBmaW5kIHN0ZXBzIGJldHdlZW4gdHdvIG5vdGVzXG5cdGdlbmVyYXRlUm9vdEZyZXEob2N0YXZlLCBzdGFydGluZ05vdGUpIHtcblx0XHRsZXQgc3RlcHNUb1Jvb3QgPSAoMTIgKiBvY3RhdmUpICsgdGhpcy5jaHJvbWF0aWNOb3Rlcy5pbmRleE9mKHN0YXJ0aW5nTm90ZSk7XG5cdFx0cmV0dXJuIHN0ZXBzVG9Sb290O1xuXHR9XG5cblx0Ly8gZ2VuZXJhdGUgYSBzaW5nbGUgZnJlcXVlbmN5IGJhc2VkIG9uIHN0ZXBzIGZyb20gYzBcblx0Z2VuZXJhdGVGcmVxKG51bWJlck9mU3RlcHMpIHtcblxuXHRcdGNvbnN0IGEgPSAxLjA1OTQ2MzA5NDM1OTtcblx0XHRcblx0XHRsZXQgZiA9IHRoaXMuY0ZyZXE7XG5cdFx0bGV0IG4gPSBudW1iZXJPZlN0ZXBzO1xuXG5cdFx0bGV0IGZyZXF1ZW5jeSA9IGYgKiBNYXRoLnBvdyhhLCBuKTtcblxuXHRcdHJldHVybiAoIGZyZXF1ZW5jeSApO1xuXHR9XG5cblx0Ly8gZ2VuZXJhdGUgc2NhbGUgYnkgc3RlcHMgYW5kIHJvb3Rcblx0Z2VuZXJhdGUoKSB7XG5cdFx0dGhpcy5zY2FsZS5wdXNoKHRoaXMuZ2VuZXJhdGVGcmVxKHRoaXMuc3RlcHNUb1Jvb3QpKTtcblx0XHRsZXQgc3RlcHMgPSB0aGlzLnN0ZXBzVG9Sb290OyAvLyBtdWx0aXBseSByb290IGJ5IG51bWJlciBvZiBvY3RhdmVzXG5cdFx0bGV0IG9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcztcblxuXHRcdGlmICh0aGlzLnN0ZXBBcnJheS5sZW5ndGggPT0gMikge1xuXHRcdFx0b2N0YXZlcyA9IG9jdGF2ZXMgKiAzO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGVwQXJyYXkubGVuZ3RoIDwgNSkge1xuXHRcdFx0b2N0YXZlcyA9IG9jdGF2ZXMgKiAyO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IHgrKykge1xuXHRcdFx0XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RlcEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHN0ZXBzID0gc3RlcHMgKyAgdGhpcy5zdGVwQXJyYXlbaV07XG5cdFx0XHRcdGxldCBmcmVxID0gdGhpcy5nZW5lcmF0ZUZyZXEoc3RlcHMpO1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuc2NhbGU7XG5cdH1cbn1cblxuY2xhc3MgUGxheWVyR3JpZCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMubnVtYmVyT2ZCZWF0cyA9IHBhcmFtcy5udW1iZXJPZkJlYXRzO1xuXHRcdHRoaXMuc2NhbGUgPSBwYXJhbXMuc2NhbGU7XG5cdFx0dGhpcy5ub3Rlc0FycmF5ID0gW107XG5cdH1cblxuXHRnZW5lcmF0ZVBsYXllckFycmF5KCkge1xuXHRcdGxldCBpbmRleCA9IDA7XG5cdFx0bGV0IGNvbHVtbiA9IDA7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8PSB0aGlzLm51bWJlck9mQmVhdHM7IHgrKykge1xuXHRcdFx0Ly8gY29sdW1ucyAoYWxsIHRoZSBzYW1lIGluZGV4IG51bWJlcilcblx0XHRcdHRoaXMubm90ZXNBcnJheS5wdXNoKFtdKTtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNjYWxlLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdC8vIHJvd3MgKGluY3JlYXNlIGluZGV4IG51bWJlciBieSBvbmUpXG5cblx0XHRcdFx0dmFyIGNvbHVtblN0cmluZztcblx0XHRcdFx0dmFyIGluZGV4U3RyaW5nO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PSB0aGlzLnNjYWxlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb2x1bW4gPCAxMCkge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGAwJHtjb2x1bW59YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBjb2x1bW47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaW5kZXggPCAxMCkge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gYDAke2luZGV4fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBpbmRleDtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0bGV0IGFycmF5T2JqZWN0ID0ge307XG5cdFx0XHRcdGFycmF5T2JqZWN0LmlkID0gY29sdW1uU3RyaW5nKydfJytpbmRleFN0cmluZztcblx0XHRcdFx0YXJyYXlPYmplY3QuZnJlcXVlbmN5ID0gdGhpcy5zY2FsZVtpbmRleF07XG5cdFx0XHRcdGFycmF5T2JqZWN0LnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC51cGRhdGVJbmRleEFycmF5ID0gdGhpcy51cGRhdGVJbmRleEFycmF5LmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC54ID0gY29sdW1uO1xuXHRcdFx0XHRhcnJheU9iamVjdC55ID0gaW5kZXg7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlkID0gYXJyYXlPYmplY3QuaWQ7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2J1dHRvbicpO1xuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdGFycmF5T2JqZWN0Lm5vdGVCdXR0b24gPSBub3RlQnV0dG9uO1xuXG5cdFx0XHRcdHRoaXMubm90ZXNBcnJheVt4XVt5XSA9IGFycmF5T2JqZWN0O1xuXHRcdFx0XHRcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Y29sdW1uKys7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB7bm90ZXNBcnJheTogdGhpcy5ub3Rlc0FycmF5fTtcblxuXHR9XG5cblx0dXBkYXRlSW5kZXhBcnJheShpbmZvKSB7XG5cblx0XHRsZXQgb2JqID0ge307XG5cdFx0XHRvYmouY2FsbCA9ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jztcblx0XHRcdG9iai5pZCA9IGluZm8uaWQ7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRvYmoudmFsID0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9iai52YWwgPSAwO1xuXHRcdFx0fVxuXG5cdFx0Y29uc3Qgb2JqVG9TZW5kID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblxuXHRcdHNlcnZlci5zZW5kKG9ialRvU2VuZCk7XG5cdH1cblxuXHR0b2dnbGUoKSB7XG5cdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHQvLyBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGUgZmlyc3QgaW5pdCAmIGZvciBtdWx0aXBsYXllciBtb2RlXG5cdFx0dGhpcy5kZWZhdWx0UGFyYW1zID0ge1xuXHRcdFx0J2tleSc6ICdjJyxcblx0XHRcdCdzdGFydGluZ09jdGF2ZSc6IDMsXG5cdFx0XHQnc2NhbGVUeXBlJzogJ3BlbnRhdG9uaWNfbWlub3InLFxuXHRcdFx0J251bWJlck9mT2N0YXZlcyc6IDMsXG5cdFx0XHQnYnBtJzogMTUwLFxuXHRcdFx0J3NpZ25hdHVyZSc6IFs0LCA0XSxcblx0XHRcdCdkdXJhdGlvbic6IDgsXG5cdFx0XHQnYWN0aXZlTm90ZXMnOiBbXSxcblx0XHR9XG5cblx0XHQvLyBjaGVjayBmb3IgcGFyYW1ldGVyIGFyZ3VtZW50cyBcblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0Ly8gdXNlIGRlZmF1bHQgcGFyYW1zIGlmIG5vIGFyZ3VtZW50c1xuXHRcdFx0dGhpcy5wYXJhbXMgPSB0aGlzLmRlZmF1bHRQYXJhbXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHVzZSBhcmd1bWVudHNcblx0XHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdH1cblxuXHRcdC8vIC8vIGdyYWIgYWxsIGNvbnRyb2xzIHRvIHVzZSB0aHJvdWdob3V0IGFwcFxuXHRcdC8vIHRoaXMuY29udHJvbHMgPSB7XG5cdFx0Ly8gXHQnc2NhbGVTZWxlY3Rvcic6IHNjYWxlU2VsZWN0b3IsXG5cdFx0Ly8gXHQncm9vdFNlbGVjdG9yJzogcm9vdFNlbGVjdG9yLFxuXHRcdC8vIFx0J29jdGF2ZXNTZWxlY3Rvcic6IG9jdGF2ZXNOdW1TZWxlY3Rvcixcblx0XHQvLyBcdCd1cE9jdGF2ZSc6IHVwT2N0YXZlLFxuXHRcdC8vIFx0J2Rvd25PY3RhdmUnOiBkb3duT2N0YXZlXG5cdFx0Ly8gfVxuXG5cdFx0dGhpcy5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJyk7XG5cblx0XHQvLyBjYWxjdWxhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBiZWF0cyB0byBnZXQgdGhlIG51bWJlciBvZiBjb2x1bW5zXG5cdFx0dGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyA9IHRoaXMucGFyYW1zLnNpZ25hdHVyZVswXSAqIHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuXG5cdFx0Ly8gY2FsY3VsYXRlICYgZGVmaW5lIHRoZSBpbnRlcnZhbCByYXRlIGZvciB0aGUgcGxheWVyIGludGVydmFsXHRcblx0XHR0aGlzLnBhcmFtcy5pbnRlcnZhbFJhdGUgPSA2MDAwMCAvIHRoaXMucGFyYW1zLmJwbTtcblxuXHRcdFxuXHRcdHRoaXMuZ2VuZXJhdGVHcmlkID0gdGhpcy5nZW5lcmF0ZUdyaWQuYmluZCh0aGlzKTtcblx0XHR0aGlzLnNldFBsYXllckludGVydmFsID0gdGhpcy5zZXRQbGF5ZXJJbnRlcnZhbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbCA9IHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucGxheUNvbHVtbiA9IHRoaXMucGxheUNvbHVtbi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucmVmcmVzaEFwcCA9IHRoaXMucmVmcmVzaEFwcC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucmVjb3JkU3RhdGUgPSB0aGlzLnJlY29yZFN0YXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5yZXN0b3JlU3RhdGUgPSB0aGlzLnJlc3RvcmVTdGF0ZS5iaW5kKHRoaXMpO1xuXG5cblx0XHR0aGlzLnRlc3RQbGF5Q291bnQgPSAwO1xuXHR9XG5cblx0Z2VuZXJhdGVHcmlkKCkge1xuXHRcdC8vIGdlbmVyYXRlIHRoZSBmcmVxdWVuY3kgdmFsdWVzIG9mIHRoZSBwbGF5ZXIgYnV0dG9uc1xuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgdGhlIGdyaWQgZm9yIHRoZSBpbnRlcmZhY2Vcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXJHcmlkKHRoaXMucGFyYW1zKTtcblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblxuXHRcdC8vIFBsYXllckdyaWQgcmV0dXJucyB0aGUgYXJyYXkgb2Ygb2JqZWN0cyBmb3IgZWFjaCBub3RlIGJ1dHRvblxuXHRcdHRoaXMubm90ZUFycmF5ID0gdGhpcy5wbGF5ZXJBcnJheXMubm90ZXNBcnJheTtcblx0fVxuXG5cdHNldFBsYXllckludGVydmFsKCkge1xuXHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR0aGlzLnBsYXllckludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucGxheUNvbHVtbiwgdGhpcy5wYXJhbXMuaW50ZXJ2YWxSYXRlKTtcblx0fVxuXG5cdGNsZWFyUGxheWVySW50ZXJ2YWwoKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXJJbnRlcnZhbCk7XG5cdFx0XHRjb25zb2xlLmxvZygnY2xlYXInKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlZnJlc2hBcHAoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRsZXQgdHJpZ2dlciA9IGUuc3JjRWxlbWVudDtcblxuXG5cdFx0dGhpcy5yZWNvcmRTdGF0ZSgpXG5cdFx0LnRoZW4oIHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbCApXG5cdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpLmlubmVySFRNTCA9ICcnO1xuXHRcdH0pXG5cdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0aWYgKHRyaWdnZXIuaWQgPT0gJ3VwT2N0YXZlJykge1xuXHRcdFx0XHRpZiAodGhpcy5wYXJhbXMuc3RhcnRpbmdPY3RhdmUgPT0gMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnBhcmFtcy5zdGFydGluZ09jdGF2ZSsrO1x0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHJpZ2dlci5pZCA9PSAnZG93bk9jdGF2ZScpe1xuXHRcdFx0XHRpZiAodGhpcy5wYXJhbXMuc3RhcnRpbmdPY3RhdmUgPT0gMTApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5wYXJhbXMuc3RhcnRpbmdPY3RhdmUtLTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJhbXNbdHJpZ2dlci5pZF0gPSB0cmlnZ2VyLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4oIHRoaXMuZ2VuZXJhdGVHcmlkIClcblx0XHQudGhlbiggdGhpcy5yZXN0b3JlU3RhdGUgKTtcblxuXHRcdFxuXG5cdFx0Ly8gc2V0VGltZW91dCh0aGlzLnJlc3RvcmVTdGF0ZSwgMTAwMCk7XG5cblx0XHQvLyBnZXQgcmVjb3JkIG9mIGFsbCB0aGUgb24vb2ZmIGJ1dHRvbnNcblx0XHQvLyBob2xkIGl0XG5cdFx0Ly8gcmVjcmVhdGUgZ3JpZCBhcyBuZWVkZWRcblx0XHQvLyBjaGFuZ2UgYnBtIGlmIG5lZWRlZFxuXHRcdC8vIHdpbGwgbmVlZCBhIHBhdXNlIGZ1bmN0aW9uIHBlcmhhcHNcblx0XHQvLyBhZnRlciByZWNyZWF0aW5nIGV2ZXJ5dGhpbmcgcmVzZXQgdGhlIGJ1dHRvbnMgb24gb3Igb2ZmXG5cdFx0Ly8gdW5wYXVzZVxuXHRcdC8vIHRoaXMuY2xlYXJQbGF5ZXJJbnRlcnZhbCgpO1xuXHRcdC8vIHRoaXMuc2V0UGxheWVySW50ZXJ2YWwoKTtcblx0fVxuXG5cdHJlY29yZFN0YXRlKCkge1xuXHRcdGxldCBhY3RpdmVOb3RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY3RpdmUnKTsgXG5cdFx0bGV0IHNhdmVkTm90ZXMgPSB0aGlzLnBhcmFtcy5hY3RpdmVOb3Rlcztcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRzYXZlZE5vdGVzID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFjdGl2ZU5vdGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHNhdmVkTm90ZXMucHVzaChhY3RpdmVOb3Rlc1tpXS5pZCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZygncmVzb2x2aW5nJyk7XG5cdFx0XHRyZXNvbHZlKHNhdmVkTm90ZXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0cmVzdG9yZVN0YXRlKCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJhbXMuYWN0aXZlTm90ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucGFyYW1zLmFjdGl2ZU5vdGVzW2ldKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXHRwbGF5Q29sdW1uKCkge1xuXHRcdGxldCBjb2x1bW5zID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54Q291bnRdO1xuXHRcblx0XHRmb3IgKHRoaXMueUNvdW50ID0gMDsgdGhpcy55Q291bnQgPCBjb2x1bW5zLmxlbmd0aDsgdGhpcy55Q291bnQrKykge1xuXHRcdFx0bGV0IG5vdGVCdXR0b24gPSBjb2x1bW5zW3RoaXMueUNvdW50XS5ub3RlQnV0dG9uO1xuXHRcdFx0bGV0IGZyZXF1ZW5jeSA9IGNvbHVtbnNbdGhpcy55Q291bnRdLmZyZXF1ZW5jeTtcblxuXHRcdFx0aWYgKG5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHQvLyBpdCBoYXMgdG8gYmUgYSBuZXcgbm90ZSBldmVyeSB0aW1lIGJlY2F1c2Ugb2YgaG93IHRoZSBnYWluIGZ1bmN0aW9ucyB3b3JrXG5cdFx0XHRcdGxldCBub3RlID0gbmV3IE5vdGUoZnJlcXVlbmN5KTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0XHRub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xuXHRcdFx0XHR9LCB0aGlzLnBhcmFtcy5pbnRlcnZhbFJhdGUpO1xuXHRcdFx0fSBcblx0XHR9XG5cblx0XHR0aGlzLnhDb3VudCsrO1xuXG5cdFx0aWYgKHRoaXMueENvdW50ID09IHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgKyAxKSB7XG5cdFx0XHR0aGlzLnhDb3VudCA9IDA7XG5cdFx0fVxuXHR9XG5cblx0YWxsT2ZmKCkge1xuXG5cdFx0bGV0IGNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheTtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgY29sdW1ucy5sZW5ndGg7IHgrKykge1xuXG5cdFx0XHRsZXQgYnV0dG9ucyA9IGNvbHVtbnNbeF07XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGJ1dHRvbnMubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0aWYgKGJ1dHRvbnNbeV0ubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0YnV0dG9uc1t5XS50b2dnbGUoKTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmNvbmRpdGlvbiA9PSAnbXVsdGknICkge1xuXHRcdFx0XHRcdFx0YnV0dG9uc1t5XS51cGRhdGVJbmRleEFycmF5KGJ1dHRvbnNbeV0ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aW5pdChjb25kaXRpb24pIHtcblx0XHR0aGlzLmdlbmVyYXRlR3JpZCgpO1xuXG5cdFx0dmFyIG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdHZhciBmaXJzdCA9IHRydWU7XG5cdFx0dGhpcy5jb25kaXRpb24gPSBjb25kaXRpb247XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0bW91c2Vkb3duID0gdHJ1ZTtcblx0XHR9KTtcblxuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcblx0XHRcdG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdFx0Zmlyc3QgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0Zm9yICh0aGlzLnggPSAwOyB0aGlzLnggPCB0aGlzLm5vdGVBcnJheS5sZW5ndGg7IHRoaXMueCsrKSB7XG5cdFx0XHRsZXQgY29sdW1uID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54XTtcblx0XHRcdFxuXHRcdFx0bGV0IHBsYXllckNvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRwbGF5ZXJDb2x1bW4uY2xhc3NMaXN0LmFkZCgncGxheWVyX19jb2x1bW4nKTtcblxuXHRcdFx0dGhpcy5hcHBDb250YWluZXIuYXBwZW5kQ2hpbGQocGxheWVyQ29sdW1uKTtcblxuXHRcdFx0Zm9yICh0aGlzLnkgPSAwOyB0aGlzLnkgPCBjb2x1bW4ubGVuZ3RoOyB0aGlzLnkrKykge1xuXHRcdFx0XHRcblx0XHRcdFx0bGV0IGJ1dHRvbiA9IGNvbHVtblt0aGlzLnldO1xuXHRcdFx0XHR2YXIgc3RhdGU7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0YnV0dG9uLnRvZ2dsZSgpO1xuXHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XHRcblxuXHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChtb3VzZWRvd24pIHtcblx0XHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5jbGFzc0xpc3QudmFsdWUgIT0gc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XHRcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcblx0XHRcdFx0cGxheWVyQ29sdW1uLmFwcGVuZENoaWxkKGJ1dHRvbi5ub3RlQnV0dG9uKTtcblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdGlmIChjb25kaXRpb24gPT0gJzFwJykge1xuXHRcdFx0bGV0IGNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2VsZWN0Jyk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnRyb2xzW2ldLm9uY2hhbmdlID0gdGhpcy5yZWZyZXNoQXBwO1xuXHRcdFx0fVxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwT2N0YXZlJykub25jbGljayA9IHRoaXMucmVmcmVzaEFwcDtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb3duT2N0YXZlJykub25jbGljayA9IHRoaXMucmVmcmVzaEFwcDtcblx0XHR9XG5cblx0XHR0aGlzLnNldFBsYXllckludGVydmFsKCk7XG5cdH1cbn1cblxuY29uc3QgTXVsdGlQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciBhcHA7XG5cdGxldCBzaGFyZWQgPSB7fTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdC8vIG9wZW4gc2VydmVyXG5cdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckFsbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGFwcC5hbGxPZmYoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyB3aGF0IHRvIGRvIHdoZW4gdGhlIHNlcnZlciBzZW5kcyB1cGRhdGVzXG5cdFx0XHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG5cdFx0XHRcdGxldCB1cGRhdGUgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyB1cGRhdGUuY2FsbCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgY2hhbmdlIHRvIG1ha2Vcblx0XHRcdFx0aWYgKHVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuXHRcdFx0XHRcdHVwZGF0ZVBsYXllcih1cGRhdGUpO1x0XG5cdFx0XHRcdH0gaWYgKHVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG5cdFx0XHRcdFx0YXBwLmFsbE9mZigpO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1cblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWZyZXNoKCkge1xuXHRcdGFwcC5yZWZyZXNoQXBwKCk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGNvbm5lY3RUb1NlcnZlcigpIHtcblxuXHRcdC8vIGdlbmVyYXRlIGEgbmV3IGFwcCBpbnN0YW5jZSB3aXRoIG11bHRpcGxheWVyIHNldHRpbmdzLCBidXQgZG9uJ3QgbW91bnQgaXQgdW50aWwgc2VydmVyIGNhbiByZXNwb25kXG4gICAgXHRhcHAgPSBuZXcgQXBwO1xuXG5cdFx0Ly8gcHJvbWlzZSBhbGxvd3Mgc2VydmVyIHRvIHNlbmQgaW5mbyBvbiBvdGhlciBwbGF5ZXIncyBib2FyZCBiZWZvcmUgdGhlIHVzZXIgXG5cdCAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cblx0ICAgICAgICAvLyB3YWl0IHVudGlsIHNlcnZlciByZXNwb25kcyBiZWZvcmUgZmluaXNoaW5nIGJ1aWxkXG5cdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICBcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuXHQgICAgICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHQgICBcdFx0XHRcdFx0YXBwLmluaXQoJ211bHRpJyk7XG5cdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcblx0ICAgICAgICBcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0ICAgICAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluaXRNZXNzYWdlLmFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0fVxuXG5cdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuXHQgICAgICAgIFx0XHRyZXNvbHZlKHNlcnZlcik7XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VydmVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxuXG5cblx0Ly8gdXBkYXRlIGhhbmRsZXJcblx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG5cdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG5cdFx0aWYgXHQoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMCkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDEpIHtcblx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblxuXHRzaGFyZWQuaW5pdCA9IGluaXQ7XG5cdHNoYXJlZC5yZWZyZXNoID0gcmVmcmVzaDtcblx0cmV0dXJuIHNoYXJlZDtcbn0oKSk7XG5cbmNvbnN0IFNpbmdsZVBsYXllciA9IChmdW5jdGlvbigpIHtcblx0bGV0IGFwcCA9IG5ldyBBcHA7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRhcHAuaW5pdCgnMXAnKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXJBbGwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFwcC5hbGxPZmYoKTtcblx0XHR9KTtcblx0fVxuXHRcblx0cmV0dXJuIHsgaW5pdDogaW5pdCB9O1x0XG59KCkpO1xuXG5TaW5nbGVQbGF5ZXIuaW5pdCgpO1xuXG4vLyBNdWx0aVBsYXllci5pbml0KCk7Il19
