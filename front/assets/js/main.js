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
		let r = Math.floor(Math.random() * ( to - from ) + from);
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
		this.updateParams = this.updateParams.bind(this);


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
		let trigger = e.srcElement;


		this.recordState()
		.then( this.clearPlayerInterval )
		.then(() => {
			document.getElementById('appPlayer').innerHTML = '';
		})
		.then(() => {
			return trigger.id = 'upOctave'
					? this.params.startingOctave++
					: trigger.id = 'downOctave'
					? this.params.startingOctave--
					: trigger.id = refreshButton
					? this.updateParams()
					: null;
		}).then(() => {
			console.log('update done');
			this.init();
		}).then( this.restoreState );

		

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

	updateParams() {
		let key = document.getElementById('key').value;
			this.params.key = key;
		let scaleType = document.getElementById('scaleType').value;
			this.params.scaleType = scaleType;
		let numberOfOctaves = document.getElementById('numberOfOctaves').value;
			this.params.numberOfOctaves = numberOfOctaves;

		return this.params;
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

		let mousedown = false;
		let first = true;
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
		let button = document.getElementById(message.id);

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
		document.getElementById('refreshButton').addEventListener('click', function(e) {
			e.preventDefault();
			console.log(e);
			app.refreshApp(e);
		})
	}
	
	return { init: init };	
}());

MultiPlayer.init();

// MultiPlayer.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xucmV2ZXJianMuZXh0ZW5kKGF1ZGlvQ3R4KTtcblxudmFyIHJldmVyYlVybCA9IFwiaHR0cDovL3JldmVyYmpzLm9yZy9MaWJyYXJ5L0Vycm9sQnJpY2t3b3Jrc0tpbG4ubTRhXCI7XG52YXIgcmV2ZXJiTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZVJldmVyYkZyb21VcmwocmV2ZXJiVXJsLCBmdW5jdGlvbigpIHtcbiAgcmV2ZXJiTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbn0pO1xuXG52YXIgc2VydmVyO1xudmFyIHVzZXIgPSB7fTtcblxuY2xhc3MgTm90ZSB7XG5cdGNvbnN0cnVjdG9yKGZyZXF1ZW5jeSkge1xuXHRcdHRoaXMuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xuXHRcdHRoaXMub3NjaWxsYXRvciA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHR0aGlzLm9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcblx0XHR0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gdGhpcy5mcmVxdWVuY3k7IC8vIHZhbHVlIGluIGhlcnR6XG5cblx0XHR0aGlzLmdhaW5Ob2RlID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuMDtcblxuXHRcdHRoaXMub3NjaWxsYXRvci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cdFx0dGhpcy5jb250ZXh0ID0gYXVkaW9DdHg7XG5cdFx0dGhpcy5kZWxheSA9IHRoaXMucmFuZG9tSW5SYW5nZSgxLCAzKTtcblx0XHR0aGlzLnBsYXkgPSB0aGlzLnBsYXkuYmluZCh0aGlzKTtcblxuXHR9XG5cblx0cmFuZG9tSW5SYW5nZShmcm9tLCB0bykge1xuXHRcdGxldCByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCB0byAtIGZyb20gKSArIGZyb20pO1xuXHRcdFx0ciA9IHIvMTAwMDtcblx0XHRyZXR1cm4gcjtcblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0bGV0IGdhaW5WYWx1ZSA9IHVuZGVmaW5lZDtcblxuXHRcdGlmICh0aGlzLmZyZXF1ZW5jeSA+IDEwMDApIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuNztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2FpblZhbHVlID0gMC44O1xuXHRcdH1cblxuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShnYWluVmFsdWUsICh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAwLjA4ICsgdGhpcy5kZWxheSkpO1xuXHRcdCAgICAgICAgXG5cdFx0dGhpcy5vc2NpbGxhdG9yLnN0YXJ0KHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdGxldCBzdG9wVGltZSA9IHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDI7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMC4wMDEsIHN0b3BUaW1lKTtcbiAgICAgICAgdGhpcy5vc2NpbGxhdG9yLnN0b3Aoc3RvcFRpbWUgKyAwLjA1KTtcblx0fVxuXG5cdHR3ZWFrU3RhcnRUaW1lKCkge1xuXHRcdHNldFRpbWVvdXQodGhpcy5wbGF5LCB0aGlzLmRlbGF5KTtcblx0fVxufVxuXG5jbGFzcyBTY2FsZSB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMucGFyYW1zID0gcGFyYW1zO1xuXHRcdHRoaXMuc2NhbGVUeXBlID0gdGhpcy5wYXJhbXMuc2NhbGVUeXBlO1xuXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdFxuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnBhcmFtcy5rZXk7XG5cdFx0dGhpcy5zdGFydGluZ09jdGF2ZSA9IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlO1xuXG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHRcdHRoaXMuYWxsU3RlcFBhdHRlcm5zID0ge1xuXHRcdFx0J21ham9yJzogWzIsIDIsIDEsIDIsIDIsIDIsIDEsIF0sXG5cdFx0XHQnbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgMiwgMiwgMl0sXG5cdFx0XHQnbWlub3JfaGFybW9uaWMnOiBbMiwgMSwgMiwgMiwgMSwgMywgMSwgXSxcblx0XHRcdCdwZW50YXRvbmljX21ham9yJzogWzIsIDMsIDIsIDMsIDIsIDMsIF0sIC8vIHRoaXMgb25lIGlzIGtpbmRhIGZ1Y2tlZCB1cCB3aGVuIHRoZSBvY3RhdmUgcmVwZWF0c1xuXHRcdFx0J3BlbnRhdG9uaWNfbWlub3InOiBbMywgMiwgMiwgMywgMiwgXSxcblx0XHRcdCdmaWZ0aHMnOiBbNywgMl0sXG5cdFx0XHQnY2hvcmRfbWFqb3InOiBbNCwgMywgMiwgM10sXG5cdFx0XHQnY2hvcmRfbWlub3InOiBbMywgNCwgMl0sXG5cdFx0XHQnY2hvcmRfc3VzJzogWzUsIDIsIDJdLFxuXHRcdFx0J2Nocm9tYXRpYyc6IFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLF1cblx0XHR9XG5cblx0XHQvLyBldmVyeSBzaW5nbGUgbm90ZSBuYW1lIHN0YXJ0aW5nIHdpdGggY1xuXHRcdHRoaXMuY2hyb21hdGljTm90ZXMgPSBbJ2MnLCAnYyMnLCAnZCcsJ2QjJywgJ2UnLCAnZicsICdmIycsJ2cnLCAnZyMnLCAnYScsICdhIycsJ2InLF07XG5cblx0XHQvLyBhdCBsZWFzdCBvbmUgbm90ZSBoYXMgdG8gYmUgaGFyZC1jb2RlZCBmb3IgdGhlIGZvcm11bGEgdG8gd29ya1xuXHRcdHRoaXMuY0ZyZXEgPSAxNi4zNTtcblxuXHRcdC8vIHNlbGVjdCBhIHN0ZXAgcGF0dGVybiBiYXNlZCBvbiBwYXJhbWV0ZXJzXG5cdFx0Zm9yIChuYW1lIGluIHRoaXMuYWxsU3RlcFBhdHRlcm5zKSB7XG5cdFx0XHRpZiAodGhpcy5zY2FsZVR5cGUgPT0gbmFtZSkge1xuXHRcdFx0XHR0aGlzLnN0ZXBBcnJheSA9IHRoaXMuYWxsU3RlcFBhdHRlcm5zW25hbWVdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZpbmRzIG51bWJlciBvZiBzdGVwcyB0byByb290IG5vdGVcblx0XHR0aGlzLnN0ZXBzVG9Sb290ID0gdGhpcy5nZW5lcmF0ZVJvb3RGcmVxKHRoaXMuc3RhcnRpbmdPY3RhdmUsIHRoaXMua2V5KTtcblx0fVxuXG5cdC8vIGZpbmQgc3RlcHMgYmV0d2VlbiB0d28gbm90ZXNcblx0Z2VuZXJhdGVSb290RnJlcShvY3RhdmUsIHN0YXJ0aW5nTm90ZSkge1xuXHRcdGxldCBzdGVwc1RvUm9vdCA9ICgxMiAqIG9jdGF2ZSkgKyB0aGlzLmNocm9tYXRpY05vdGVzLmluZGV4T2Yoc3RhcnRpbmdOb3RlKTtcblx0XHRyZXR1cm4gc3RlcHNUb1Jvb3Q7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBhIHNpbmdsZSBmcmVxdWVuY3kgYmFzZWQgb24gc3RlcHMgZnJvbSBjMFxuXHRnZW5lcmF0ZUZyZXEobnVtYmVyT2ZTdGVwcykge1xuXG5cdFx0Y29uc3QgYSA9IDEuMDU5NDYzMDk0MzU5O1xuXHRcdFxuXHRcdGxldCBmID0gdGhpcy5jRnJlcTtcblx0XHRsZXQgbiA9IG51bWJlck9mU3RlcHM7XG5cblx0XHRsZXQgZnJlcXVlbmN5ID0gZiAqIE1hdGgucG93KGEsIG4pO1xuXG5cdFx0cmV0dXJuICggZnJlcXVlbmN5ICk7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBzY2FsZSBieSBzdGVwcyBhbmQgcm9vdFxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNjYWxlLnB1c2godGhpcy5nZW5lcmF0ZUZyZXEodGhpcy5zdGVwc1RvUm9vdCkpO1xuXHRcdGxldCBzdGVwcyA9IHRoaXMuc3RlcHNUb1Jvb3Q7IC8vIG11bHRpcGx5IHJvb3QgYnkgbnVtYmVyIG9mIG9jdGF2ZXNcblx0XHRsZXQgb2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzO1xuXG5cdFx0aWYgKHRoaXMuc3RlcEFycmF5Lmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDM7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0ZXBBcnJheS5sZW5ndGggPCA1KSB7XG5cdFx0XHRvY3RhdmVzID0gb2N0YXZlcyAqIDI7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLm51bWJlck9mT2N0YXZlczsgeCsrKSB7XG5cdFx0XHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyArICB0aGlzLnN0ZXBBcnJheVtpXTtcblx0XHRcdFx0bGV0IGZyZXEgPSB0aGlzLmdlbmVyYXRlRnJlcShzdGVwcyk7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0fVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblx0fVxuXG5cdGdlbmVyYXRlUGxheWVyQXJyYXkoKSB7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHRsZXQgY29sdW1uID0gMDtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDw9IHRoaXMubnVtYmVyT2ZCZWF0czsgeCsrKSB7XG5cdFx0XHQvLyBjb2x1bW5zIChhbGwgdGhlIHNhbWUgaW5kZXggbnVtYmVyKVxuXHRcdFx0dGhpcy5ub3Rlc0FycmF5LnB1c2goW10pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2NhbGUubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0Ly8gcm93cyAoaW5jcmVhc2UgaW5kZXggbnVtYmVyIGJ5IG9uZSlcblxuXHRcdFx0XHR2YXIgY29sdW1uU3RyaW5nO1xuXHRcdFx0XHR2YXIgaW5kZXhTdHJpbmc7XG5cblx0XHRcdFx0aWYgKGluZGV4ID09IHRoaXMuc2NhbGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbHVtbiA8IDEwKSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gYDAke2NvbHVtbn1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGNvbHVtbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpbmRleCA8IDEwKSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBgMCR7aW5kZXh9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGluZGV4O1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRsZXQgYXJyYXlPYmplY3QgPSB7fTtcblx0XHRcdFx0YXJyYXlPYmplY3QuaWQgPSBjb2x1bW5TdHJpbmcrJ18nK2luZGV4U3RyaW5nO1xuXHRcdFx0XHRhcnJheU9iamVjdC5mcmVxdWVuY3kgPSB0aGlzLnNjYWxlW2luZGV4XTtcblx0XHRcdFx0YXJyYXlPYmplY3QudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXG5cdH1cblxuXHR1cGRhdGVJbmRleEFycmF5KGluZm8pIHtcblxuXHRcdGxldCBvYmogPSB7fTtcblx0XHRcdG9iai5jYWxsID0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknO1xuXHRcdFx0b2JqLmlkID0gaW5mby5pZDtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdG9iai52YWwgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b2JqLnZhbCA9IDA7XG5cdFx0XHR9XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0c2VydmVyLnNlbmQob2JqVG9TZW5kKTtcblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdC8vIGRlZmF1bHQgc2V0dGluZ3MgZm9yIHRoZSBmaXJzdCBpbml0ICYgZm9yIG11bHRpcGxheWVyIG1vZGVcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHQna2V5JzogJ2MnLFxuXHRcdFx0J3N0YXJ0aW5nT2N0YXZlJzogMyxcblx0XHRcdCdzY2FsZVR5cGUnOiAncGVudGF0b25pY19taW5vcicsXG5cdFx0XHQnbnVtYmVyT2ZPY3RhdmVzJzogMyxcblx0XHRcdCdicG0nOiAxNTAsXG5cdFx0XHQnc2lnbmF0dXJlJzogWzQsIDRdLFxuXHRcdFx0J2R1cmF0aW9uJzogOCxcblx0XHRcdCdhY3RpdmVOb3Rlcyc6IFtdLFxuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGZvciBwYXJhbWV0ZXIgYXJndW1lbnRzIFxuXHRcdGlmICghcGFyYW1zKSB7XG5cdFx0XHQvLyB1c2UgZGVmYXVsdCBwYXJhbXMgaWYgbm8gYXJndW1lbnRzXG5cdFx0XHR0aGlzLnBhcmFtcyA9IHRoaXMuZGVmYXVsdFBhcmFtcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdXNlIGFyZ3VtZW50c1xuXHRcdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XG5cdFx0fVxuXG5cdFx0Ly8gLy8gZ3JhYiBhbGwgY29udHJvbHMgdG8gdXNlIHRocm91Z2hvdXQgYXBwXG5cdFx0Ly8gdGhpcy5jb250cm9scyA9IHtcblx0XHQvLyBcdCdzY2FsZVNlbGVjdG9yJzogc2NhbGVTZWxlY3Rvcixcblx0XHQvLyBcdCdyb290U2VsZWN0b3InOiByb290U2VsZWN0b3IsXG5cdFx0Ly8gXHQnb2N0YXZlc1NlbGVjdG9yJzogb2N0YXZlc051bVNlbGVjdG9yLFxuXHRcdC8vIFx0J3VwT2N0YXZlJzogdXBPY3RhdmUsXG5cdFx0Ly8gXHQnZG93bk9jdGF2ZSc6IGRvd25PY3RhdmVcblx0XHQvLyB9XG5cblx0XHR0aGlzLmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBQbGF5ZXInKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSB0aGUgdG90YWwgbnVtYmVyIG9mIGJlYXRzIHRvIGdldCB0aGUgbnVtYmVyIG9mIGNvbHVtbnNcblx0XHR0aGlzLnBhcmFtcy5udW1iZXJPZkJlYXRzID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzBdICogdGhpcy5wYXJhbXMuZHVyYXRpb247XG5cblx0XHQvLyBjYWxjdWxhdGUgJiBkZWZpbmUgdGhlIGludGVydmFsIHJhdGUgZm9yIHRoZSBwbGF5ZXIgaW50ZXJ2YWxcdFxuXHRcdHRoaXMucGFyYW1zLmludGVydmFsUmF0ZSA9IDYwMDAwIC8gdGhpcy5wYXJhbXMuYnBtO1xuXG5cdFx0XG5cdFx0dGhpcy5nZW5lcmF0ZUdyaWQgPSB0aGlzLmdlbmVyYXRlR3JpZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuc2V0UGxheWVySW50ZXJ2YWwgPSB0aGlzLnNldFBsYXllckludGVydmFsLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5jbGVhclBsYXllckludGVydmFsID0gdGhpcy5jbGVhclBsYXllckludGVydmFsLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5wbGF5Q29sdW1uID0gdGhpcy5wbGF5Q29sdW1uLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5yZWZyZXNoQXBwID0gdGhpcy5yZWZyZXNoQXBwLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5yZWNvcmRTdGF0ZSA9IHRoaXMucmVjb3JkU3RhdGUuYmluZCh0aGlzKTtcblx0XHR0aGlzLnJlc3RvcmVTdGF0ZSA9IHRoaXMucmVzdG9yZVN0YXRlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy51cGRhdGVQYXJhbXMgPSB0aGlzLnVwZGF0ZVBhcmFtcy5iaW5kKHRoaXMpO1xuXG5cblx0XHR0aGlzLnRlc3RQbGF5Q291bnQgPSAwO1xuXHR9XG5cblx0Z2VuZXJhdGVHcmlkKCkge1xuXHRcdC8vIGdlbmVyYXRlIHRoZSBmcmVxdWVuY3kgdmFsdWVzIG9mIHRoZSBwbGF5ZXIgYnV0dG9uc1xuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0Ly8gZ2VuZXJhdGUgdGhlIGdyaWQgZm9yIHRoZSBpbnRlcmZhY2Vcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXJHcmlkKHRoaXMucGFyYW1zKTtcblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblxuXHRcdC8vIFBsYXllckdyaWQgcmV0dXJucyB0aGUgYXJyYXkgb2Ygb2JqZWN0cyBmb3IgZWFjaCBub3RlIGJ1dHRvblxuXHRcdHRoaXMubm90ZUFycmF5ID0gdGhpcy5wbGF5ZXJBcnJheXMubm90ZXNBcnJheTtcblx0fVxuXG5cdHNldFBsYXllckludGVydmFsKCkge1xuXHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR0aGlzLnBsYXllckludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucGxheUNvbHVtbiwgdGhpcy5wYXJhbXMuaW50ZXJ2YWxSYXRlKTtcblx0fVxuXG5cdGNsZWFyUGxheWVySW50ZXJ2YWwoKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXJJbnRlcnZhbCk7XG5cdFx0XHRjb25zb2xlLmxvZygnY2xlYXInKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cdHJlZnJlc2hBcHAoZSkge1xuXHRcdGxldCB0cmlnZ2VyID0gZS5zcmNFbGVtZW50O1xuXG5cblx0XHR0aGlzLnJlY29yZFN0YXRlKClcblx0XHQudGhlbiggdGhpcy5jbGVhclBsYXllckludGVydmFsIClcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJykuaW5uZXJIVE1MID0gJyc7XG5cdFx0fSlcblx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRyZXR1cm4gdHJpZ2dlci5pZCA9ICd1cE9jdGF2ZSdcblx0XHRcdFx0XHQ/IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlKytcblx0XHRcdFx0XHQ6IHRyaWdnZXIuaWQgPSAnZG93bk9jdGF2ZSdcblx0XHRcdFx0XHQ/IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlLS1cblx0XHRcdFx0XHQ6IHRyaWdnZXIuaWQgPSByZWZyZXNoQnV0dG9uXG5cdFx0XHRcdFx0PyB0aGlzLnVwZGF0ZVBhcmFtcygpXG5cdFx0XHRcdFx0OiBudWxsO1xuXHRcdH0pLnRoZW4oKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ3VwZGF0ZSBkb25lJyk7XG5cdFx0XHR0aGlzLmluaXQoKTtcblx0XHR9KS50aGVuKCB0aGlzLnJlc3RvcmVTdGF0ZSApO1xuXG5cdFx0XG5cblx0XHQvLyBzZXRUaW1lb3V0KHRoaXMucmVzdG9yZVN0YXRlLCAxMDAwKTtcblxuXHRcdC8vIGdldCByZWNvcmQgb2YgYWxsIHRoZSBvbi9vZmYgYnV0dG9uc1xuXHRcdC8vIGhvbGQgaXRcblx0XHQvLyByZWNyZWF0ZSBncmlkIGFzIG5lZWRlZFxuXHRcdC8vIGNoYW5nZSBicG0gaWYgbmVlZGVkXG5cdFx0Ly8gd2lsbCBuZWVkIGEgcGF1c2UgZnVuY3Rpb24gcGVyaGFwc1xuXHRcdC8vIGFmdGVyIHJlY3JlYXRpbmcgZXZlcnl0aGluZyByZXNldCB0aGUgYnV0dG9ucyBvbiBvciBvZmZcblx0XHQvLyB1bnBhdXNlXG5cdFx0Ly8gdGhpcy5jbGVhclBsYXllckludGVydmFsKCk7XG5cdFx0Ly8gdGhpcy5zZXRQbGF5ZXJJbnRlcnZhbCgpO1xuXHR9XG5cblx0dXBkYXRlUGFyYW1zKCkge1xuXHRcdGxldCBrZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna2V5JykudmFsdWU7XG5cdFx0XHR0aGlzLnBhcmFtcy5rZXkgPSBrZXk7XG5cdFx0bGV0IHNjYWxlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2FsZVR5cGUnKS52YWx1ZTtcblx0XHRcdHRoaXMucGFyYW1zLnNjYWxlVHlwZSA9IHNjYWxlVHlwZTtcblx0XHRsZXQgbnVtYmVyT2ZPY3RhdmVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ251bWJlck9mT2N0YXZlcycpLnZhbHVlO1xuXHRcdFx0dGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzID0gbnVtYmVyT2ZPY3RhdmVzO1xuXG5cdFx0cmV0dXJuIHRoaXMucGFyYW1zO1xuXHR9XG5cblx0cmVjb3JkU3RhdGUoKSB7XG5cdFx0bGV0IGFjdGl2ZU5vdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpOyBcblx0XHRsZXQgc2F2ZWROb3RlcyA9IHRoaXMucGFyYW1zLmFjdGl2ZU5vdGVzO1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHNhdmVkTm90ZXMgPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlTm90ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c2F2ZWROb3Rlcy5wdXNoKGFjdGl2ZU5vdGVzW2ldLmlkKTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKCdyZXNvbHZpbmcnKTtcblx0XHRcdHJlc29sdmUoc2F2ZWROb3Rlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRyZXN0b3JlU3RhdGUoKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcmFtcy5hY3RpdmVOb3Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wYXJhbXMuYWN0aXZlTm90ZXNbaV0pLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdH1cblx0fVxuXG5cdHBsYXlDb2x1bW4oKSB7XG5cdFx0bGV0IGNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhDb3VudF07XG5cdFxuXHRcdGZvciAodGhpcy55Q291bnQgPSAwOyB0aGlzLnlDb3VudCA8IGNvbHVtbnMubGVuZ3RoOyB0aGlzLnlDb3VudCsrKSB7XG5cdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtbnNbdGhpcy55Q291bnRdLm5vdGVCdXR0b247XG5cdFx0XHRsZXQgZnJlcXVlbmN5ID0gY29sdW1uc1t0aGlzLnlDb3VudF0uZnJlcXVlbmN5O1xuXG5cdFx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdC8vIGl0IGhhcyB0byBiZSBhIG5ldyBub3RlIGV2ZXJ5IHRpbWUgYmVjYXVzZSBvZiBob3cgdGhlIGdhaW4gZnVuY3Rpb25zIHdvcmtcblx0XHRcdFx0bGV0IG5vdGUgPSBuZXcgTm90ZShmcmVxdWVuY3kpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuXHRcdFx0XHRcdG5vdGUudHdlYWtTdGFydFRpbWUoKTtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG5cdFx0XHRcdH0sIHRoaXMucGFyYW1zLmludGVydmFsUmF0ZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyArIDEpIHtcblx0XHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR9XG5cdH1cblxuXHRhbGxPZmYoKSB7XG5cblx0XHRsZXQgY29sdW1ucyA9IHRoaXMubm90ZUFycmF5O1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBjb2x1bW5zLmxlbmd0aDsgeCsrKSB7XG5cblx0XHRcdGxldCBidXR0b25zID0gY29sdW1uc1t4XTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgYnV0dG9ucy5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHRpZiAoYnV0dG9uc1t5XS5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRidXR0b25zW3ldLnRvZ2dsZSgpO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuY29uZGl0aW9uID09ICdtdWx0aScgKSB7XG5cdFx0XHRcdFx0XHRidXR0b25zW3ldLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uc1t5XS5ub3RlQnV0dG9uKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpbml0KGNvbmRpdGlvbikge1xuXHRcdHRoaXMuZ2VuZXJhdGVHcmlkKCk7XG5cblx0XHRsZXQgbW91c2Vkb3duID0gZmFsc2U7XG5cdFx0bGV0IGZpcnN0ID0gdHJ1ZTtcblx0XHR0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRtb3VzZWRvd24gPSB0cnVlO1xuXHRcdH0pO1xuXG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bW91c2Vkb3duID0gZmFsc2U7XG5cdFx0XHRmaXJzdCA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRmb3IgKHRoaXMueCA9IDA7IHRoaXMueCA8IHRoaXMubm90ZUFycmF5Lmxlbmd0aDsgdGhpcy54KyspIHtcblx0XHRcdGxldCBjb2x1bW4gPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhdO1xuXHRcdFx0XG5cdFx0XHRsZXQgcGxheWVyQ29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHBsYXllckNvbHVtbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2NvbHVtbicpO1xuXG5cdFx0XHR0aGlzLmFwcENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJDb2x1bW4pO1xuXG5cdFx0XHRmb3IgKHRoaXMueSA9IDA7IHRoaXMueSA8IGNvbHVtbi5sZW5ndGg7IHRoaXMueSsrKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgYnV0dG9uID0gY29sdW1uW3RoaXMueV07XG5cdFx0XHRcdHZhciBzdGF0ZTtcblxuXHRcdFx0XHRidXR0b24ubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0Zmlyc3QgPSBmYWxzZTtcdFxuXG5cdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRidXR0b24ubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKG1vdXNlZG93bikge1xuXHRcdFx0XHRcdFx0aWYgKGZpcnN0KSB7XG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0XHRcdGZpcnN0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1x0XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmNsYXNzTGlzdC52YWx1ZSAhPSBzdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdGJ1dHRvbi50b2dnbGUoKTtcdFxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PSAnbXVsdGknKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRidXR0b24udXBkYXRlSW5kZXhBcnJheShidXR0b24ubm90ZUJ1dHRvbik7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFxuXHRcdFx0XHRwbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmRpdGlvbiA9PSAnMXAnKSB7XG5cdFx0XHRsZXQgY29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzZWxlY3QnKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY29udHJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29udHJvbHNbaV0ub25jaGFuZ2UgPSB0aGlzLnJlZnJlc2hBcHA7XG5cdFx0XHR9XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBPY3RhdmUnKS5vbmNsaWNrID0gdGhpcy5yZWZyZXNoQXBwO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rvd25PY3RhdmUnKS5vbmNsaWNrID0gdGhpcy5yZWZyZXNoQXBwO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0UGxheWVySW50ZXJ2YWwoKTtcblx0fVxufVxuXG5jb25zdCBNdWx0aVBsYXllciA9IChmdW5jdGlvbigpIHtcblx0dmFyIGFwcDtcblx0bGV0IHNoYXJlZCA9IHt9O1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Ly8gb3BlbiBzZXJ2ZXJcblx0XHRjb25uZWN0VG9TZXJ2ZXIoKS50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyQWxsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0YXBwLmFsbE9mZigpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHdoYXQgdG8gZG8gd2hlbiB0aGUgc2VydmVyIHNlbmRzIHVwZGF0ZXNcblx0XHRcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHRcdFx0bGV0IHVwZGF0ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIHVwZGF0ZS5jYWxsIGRlc2NyaWJlcyB0aGUgdHlwZSBvZiBjaGFuZ2UgdG8gbWFrZVxuXHRcdFx0XHRpZiAodXBkYXRlLmNhbGwgPT0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknKSB7XG5cdFx0XHRcdFx0dXBkYXRlUGxheWVyKHVwZGF0ZSk7XHRcblx0XHRcdFx0fSBpZiAodXBkYXRlLmNhbGwgPT0gJ25ld19wYXJ0bmVyX3NldCcpIHtcblx0XHRcdFx0XHRhcHAuYWxsT2ZmKCk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNvbm5lY3RUb1NlcnZlcigpIHtcblxuXHRcdC8vIGdlbmVyYXRlIGEgbmV3IGFwcCBpbnN0YW5jZSB3aXRoIG11bHRpcGxheWVyIHNldHRpbmdzLCBidXQgZG9uJ3QgbW91bnQgaXQgdW50aWwgc2VydmVyIGNhbiByZXNwb25kXG4gICAgXHRhcHAgPSBuZXcgQXBwO1xuXG5cdFx0Ly8gcHJvbWlzZSBhbGxvd3Mgc2VydmVyIHRvIHNlbmQgaW5mbyBvbiBvdGhlciBwbGF5ZXIncyBib2FyZCBiZWZvcmUgdGhlIHVzZXIgXG5cdCAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cblx0ICAgICAgICAvLyB3YWl0IHVudGlsIHNlcnZlciByZXNwb25kcyBiZWZvcmUgZmluaXNoaW5nIGJ1aWxkXG5cdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICBcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuXHQgICAgICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHQgICBcdFx0XHRcdFx0YXBwLmluaXQoJ211bHRpJyk7XG5cdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcblx0ICAgICAgICBcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0ICAgICAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluaXRNZXNzYWdlLmFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuXHQgICAgICAgIFx0XHRcdH1cblx0ICAgICAgICBcdFx0fVxuXG5cdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuXHQgICAgICAgIFx0XHRyZXNvbHZlKHNlcnZlcik7XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VydmVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxuXG5cblx0Ly8gdXBkYXRlIGhhbmRsZXJcblx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0bGV0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG5cdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG5cdFx0aWYgXHQoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMCkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdH0gZWxzZSBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDEpIHtcblx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblxuXHRzaGFyZWQuaW5pdCA9IGluaXQ7XG5cdHJldHVybiBzaGFyZWQ7XG59KCkpO1xuXG5jb25zdCBTaW5nbGVQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cdGxldCBhcHAgPSBuZXcgQXBwO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0YXBwLmluaXQoJzFwJyk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyQWxsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhcHAuYWxsT2ZmKCk7XG5cdFx0fSk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZnJlc2hCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0YXBwLnJlZnJlc2hBcHAoZSk7XG5cdFx0fSlcblx0fVxuXHRcblx0cmV0dXJuIHsgaW5pdDogaW5pdCB9O1x0XG59KCkpO1xuXG5NdWx0aVBsYXllci5pbml0KCk7XG5cbi8vIE11bHRpUGxheWVyLmluaXQoKTsiXX0=
