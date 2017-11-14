var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioCtx);

var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(audioCtx.destination);
});

var server;
var user = {};


const frequencies = [	
	130.81,
	138.59,
	146.83,
	155.56,
	164.81,
	174.61,
	185.00,
	196.00,
	207.65,
	220.00,
	233.08,
	246.94,
	261.63,
	277.18,
	293.66,
	311.13,
	329.63,
	349.23,
	369.99,
	392.00,
	415.30,
	440.00,
	466.16,
	493.88,
	523.25,
	554.37,
	587.33,
	622.25,
	659.25,
	698.46,
	739.99,
	783.99,
	830.61,
	880.00,
	932.33,
	987.77,
	1046.50,
	1108.73,
	1174.66,
	1244.51,
	1318.51,
	1396.91,
	1479.98,
	1567.98,
	1661.22,
	1760.00,
	1864.66,
	1975.53,
];

const 	c2 = frequencies[0],
		cs2 = frequencies[1],
		d2 = frequencies[2],
		ds2 = frequencies[3],
		
		e2 = frequencies[4],
		f2 = frequencies[5],
		fs2 = frequencies[6],
		g2 = frequencies[7],
		gs2 = frequencies[8],
		a2 = frequencies[9],
		as2 = frequencies[10],
		
		b2 = frequencies[11],
		c3 = frequencies[12],
		cs3 = frequencies[13],
		d3 = frequencies[14],
		ds3 = frequencies[15],
		
		e3 = frequencies[16],
		f3 = frequencies[17],
		fs3 = frequencies[18],
		g3 = frequencies[19],
		gs3 = frequencies[20],
		a3 = frequencies[21],
		as3 = frequencies[22],
		
		b3 = frequencies[23],
		c4 = frequencies[24],
		cs4 = frequencies[25],
		d4 = frequencies[26],
		ds4 = frequencies[27],
		
		e4 = frequencies[28],
		f4 = frequencies[29],
		fs4 = frequencies[30],
		g4 = frequencies[31],
		gs4 = frequencies[32],
		a4 = frequencies[33],
		as4 = frequencies[34],
		
		b4 = frequencies[35],
		c5 = frequencies[36],
		cs5 = frequencies[37],
		d5 = frequencies[38],
		ds5 = frequencies[39],
		
		e5 = frequencies[40],
		f5 = frequencies[41],
		fs5 = frequencies[42],
		g5 = frequencies[43],
		gs5 = frequencies[44],
		a5 = frequencies[45],
		as5 = frequencies[46],
		
		b5 = frequencies[47],
		c6 = frequencies[48],
		cs6 = frequencies[49],
		d6 = frequencies[50],
		ds6 = frequencies[51],
		
		e6 = frequencies[52],
		f6 = frequencies[53],
		fs6 = frequencies[54],
		g6 = frequencies[55],
		gs6 = frequencies[56],
		a6 = frequencies[57],
		as6 = frequencies[58],
		
		b6 = frequencies[59];

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
		this.rootNote = this.params.rootNote;
		this.scaleName = this.params.scaleName;
		this.numberOfOctaves = this.params.numberOfOctaves;
		this.startingIndex = frequencies.indexOf(this.rootNote);
		this.scale = [];
	}

	generate() {
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
		// this.updateIndexArray = this.updateIndexArray.bind(this);
	}

	generatePlayerArray() {
		let index = 0;
		let column = 0;

		for (var x = 0; x <= this.numberOfBeats; x++) {
			//columns (all the same index number)
			this.notesArray.push([]);

			for (var y = 0; y < this.scale.length; y++) {
				//rows (increase index number by one)

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
				arrayObject.multiplayerToggle = this.multiplayerToggle.bind(arrayObject);
				arrayObject.x = column;
				arrayObject.y = index;

				let noteButton = document.createElement('button');
					noteButton.id = arrayObject.id;
					noteButton.innerHTML = arrayObject.frequency;
					noteButton.classList.add('player__button');

				arrayObject.noteButton = noteButton;

				this.notesArray[x][y] = arrayObject;
				
				index++;
			}

			column++;
		}
		
		return {notesArray: this.notesArray};
	}

	multiplayerToggle(info) {
		
		this.toggle();

		let obj = {};
			obj.call = 'update_toggle_array';
			obj.id = this.id;

		if (this.noteButton.classList.contains('active')) {
			obj.val = 1;
		} else {
			obj.val = 0;
		}

		const objToSend = JSON.stringify(obj);

		this.server.send(objToSend);
		console.log(obj);

	}

	toggle() {
		// e.preventDefault();

		let noteButton = this.noteButton;
		if (noteButton.classList.contains('active')) {
			noteButton.classList.remove('active');
			// this.updateIndexArray(this, 0);
		} else {
			noteButton.classList.add('active');
			// this.updateIndexArray(this, 1);
		}
	}
}

class App {
	constructor(params) {
		this.defaultParams = {
			rootNote: c2,
			scaleName: 'pentatonic_minor',
			numberOfOctaves: 2,
			bpm: 100,
			duration: 4,
			signature: [4, 4],
			numberOfOctaves: 2,
		};

		if (!params) {
			this.params = this.defaultParams;
		} else {
			this.params = params;
		}

		this.params.beats = this.params.signature[0];
		this.params.measure = this.params.signature[1];
		this.params.numberOfBeats = this.params.duration*this.params.beats;
		this.params.time = this.params.bpm * 4;

		this.scale = new Scale(this.params);
		this.params.scale = this.scale.generate();

		this.player = new PlayerGrid(this.params);

		this.playerArrays = this.player.generatePlayerArray();
		this.noteArray = this.playerArrays.notesArray;

		this.generateApp = this.generateApp.bind(this);
		this.setPlayInterval = this.setPlayInterval.bind(this);
		this.playColumn = this.playColumn.bind(this);
		this.refreshApp = this.refreshApp;

		this.appContainer = document.getElementById('appPlayer');
	}

	generateApp(condition) {

		for (this.x = 0; this.x < this.noteArray.length; this.x++) {
			this.column = this.noteArray[this.x];
			
			this.playerColumn = document.createElement('div');
				this.playerColumn.classList.add('player__column');

			this.appContainer.appendChild(this.playerColumn);

			for (this.y = 0; this.y < this.column.length; this.y++) {
				this.noteButton = this.column[this.y].noteButton;
					if (condition == 'multi') {
						this.noteButton.addEventListener('click', this.column[this.y].multiplayerToggle);
					} else {
						this.noteButton.addEventListener('click', this.column[this.y].toggle);
					}
				this.playerColumn.appendChild(this.noteButton);
			}	
		}

		this.setPlayInterval();
	}

	refreshApp() {
		this.appContainer.innerHTML = '';

		this.generateApp();
	}

	setPlayInterval() {
		this.xCount = 0;

		if (this.playerInterval) {
			clearInterval(this.playerInterval);
		} else {
			this.playerInterval = window.setInterval(this.playColumn, this.params.time);
		}
	}

	playColumn() {

		this.columns = this.noteArray[this.xCount];
	
		for (this.yCount = 0; this.yCount < this.columns.length; this.yCount++) {
			this.noteButton = this.columns[this.yCount].noteButton;
			this.frequency = this.columns[this.yCount].frequency;

			if (this.noteButton.classList.contains('active')) {
				this.note = new Note(this.frequency);
				this.noteButton.classList.add('playing');
				this.note.tweakStartTime();

				let noteButton = this.noteButton;

				setTimeout(() => {
					noteButton.classList.remove('playing');
				}, this.params.time);
			} 
		}

		this.xCount++;

		if (this.xCount == this.params.numberOfBeats + 1) {
			this.xCount = 0;
		}
	}

	init() {
		this.generateApp();
	}
}

class MultiplayerApp extends App {
	constructor(params) {
		super(params);
		this.connectToServer = this.connectToServer.bind(this);
		this.listenForUpdates = this.listenForUpdates.bind(this);
		this.updatePlayer = this.updatePlayer.bind(this);
		// console.log(this.noteArray);
	}

	connectToServer() {
		// delay initial construction of the app until after initial parameters have been set
		
		// create live connection to server
	    this.server = new WebSocket('ws://localhost:1357');

		return (
		    // wait until server responds before finishing build
		    this.server.onopen = function() {

		    	// receive and react to server response
		    	this.server.onmessage = function(message) {

		    		// parse initial message
		    		let initMessage = JSON.parse(message.data);

		    		// check whether joining existing game or starting new one
		    		if (initMessage.call == 'null') {
		    			return;
		    		} else if (initMessage.call == 'init') {
		    			// if joining new existing, update player to reflect existing conditions
		    			for (var i = 0; i < initMessage.array.length; i++) {
		    				this.updatePlayer(initMessage.array[i]);
		    			}
		    		}

		    		// start loop to play notes
		    		this.super.setPlayInterval();
		    	}
		    }).then(this.listenForUpdates);
	}

	listenForUpdates() {
		return (
			// set functions for how to react to all messages after
			this.server.onmessage = function(message) {
				this.update = JSON.parse(message.data);
				
				// update.call describes the type of change to make
				if (this.update.call == 'update_toggle_array') {
					this.button.id = this.update.id;
					this.updatePlayer();	
				} if (this.update.call == 'new_partner_set') {
					console.log();
				}	
			}
		).then(
			this.server.catch = function(err) {
				console.log(err);
			}
		);
	}

	updatePlayer() {
		// target specifically the button that is changing
		this.button = document.getElementById(this.update.id);

		// compare classList vals to the new vals 
		if 	(this.button.classList.contains('active') && this.update.val == 0) {
			// if val is false and button is true, set button to false by removing 'active' from classlist
			this.button.classList.remove('active');
		} else if (!this.button.classList.contains('active') && this.update.val == 1) {
			// if val is true and button is false, set button to true by adding 'active' to classlist
			this.button.classList.add('active');
		}
	}
}

class SinglePlayerApp extends App {
	constructor(params) {
		super(params);
		// this.generateApp = this.params.generateApp.bind(this);
		
		this.options = {};

		this.singlePlayerControls = document.getElementById('playerOptions');
		this.rebuildApp = this.rebuildApp.bind(this);
		// this.singlePlayerControls.classList.remove('hidden');
		this.menuSubmit = document.getElementById('menuSubmit');
		this.menuSubmit.addEventListener('click', this.rebuildApp);


		this.options.scaleSelector = document.getElementById('scaleSelector');
		this.options.rootSelector = document.getElementById('rootSelector');
		this.options.octavesSelector = document.getElementById('octavesNumSelector');
		
	}

	//activate single player controls
	rebuildApp(e) {
		e.preventDefault();
		console.log('rebuild');
		console.dir(this.options);
	}

}

// var localApp = new SinglePlayerApp;
// 	localApp.generateApp();

var multiApp = new MultiplayerApp;
	multiApp.generateApp('multi');


// function multiPlayerInit() {

// 	function connectToServer() {

// 		// delay initial construction of the app until after initial parameters have been set
// 	    return new Promise(function(resolve, reject) {

// 	    	// create live connection to server
// 	        server = new WebSocket('ws://localhost:1357');

// 	        // wait until server responds before finishing build
// 	        server.onopen = function() {

// 	        	// receive and react to server response
// 	        	server.onmessage = function(message) {

// 	        		// parse initial message
// 	        		let initMessage = JSON.parse(message.data);

// 	        		// check whether joining existing game or starting new one
// 	        		if (initMessage.call == 'null') {
// 	        			return;
// 	        		} else if (initMessage.call == 'init') {
// 	        			// if joining new existing, update player to reflect existing conditions
// 	        			for (var i = 0; i < initMessage.array.length; i++) {
// 	        				updatePlayer(initMessage.array[i]);
// 	        			}
// 	        		}

// 	        		// start loop to play notes
// 	        		playNotes();

// 	        		// finish pre-init
// 	        		resolve(server);
// 	        	}
// 	        }

// 	        server.onerror = function(err) {
// 	            reject(err);
// 	        }
// 	    })
// 	}

// 	// once pre-init has been completed
// 	connectToServer().then(function(server) {

// 		// set functions for how to react to all messages after
// 		server.onmessage = function(message) {

// 			let update = JSON.parse(message.data);
			
// 			// update.call describes the type of change to make
// 			if (update.call == 'update_toggle_array') {
// 				updatePlayer(update);	
// 			} if (update.call == 'new_partner_set') {
// 				console.log(update);
// 			}	
// 		}
// 	}).catch(function(err) {
// 		console.log(err);
// 	});

// 	// update handler
// 	function updatePlayer(message) {

// 		// target specifically the button that is changing
// 		var button = document.getElementById(message.id);

// 		// compare classList vals to the new vals 
// 		if 	(button.classList.contains('active') && message.val == 0) {
// 			// if val is false and button is true, set button to false by removing 'active' from classlist
// 			button.classList.remove('active');
// 		} else if (!button.classList.contains('active') && message.val == 1) {
// 			// if val is true and button is false, set button to true by adding 'active' to classlist
// 			button.classList.add('active');
// 		}
// 	}
// }

// var App = (function(params) {
// 	let shared = {};

// 	const defaultParams = {
// 		rootNote: c2,
// 		scaleName: 'pentatonic_minor',
// 		numberOfOctaves: 2,
// 		bpm: 100,
// 		duration: 2,
// 		signature: [4, 4],
// 		numberOfOctaves: 2,
// 	};

// 	if (!params) {
// 		params = defaultParams;
// 	} 

// 	params.beats = params.signature[0];
// 	params.measure = params.signature[1];
// 	params.numberOfBeats = params.duration*params.beats;

// 	const scale = new Scale(params);

// 	params.scale = scale.generate();

// 	let 	player = new Player(params);
// 			playerArrays = player.generatePlayerArray();
// 	const 	noteArray = playerArrays.notesArray,
// 			idArray = playerArrays.idArray;

// 	function generatePlayer() {
// 		var appPlayer = document.getElementById('appPlayer');

// 		for (var x = 0; x < noteArray.length; x++) {
// 			var column = noteArray[x];
			
// 			var playerColumn = document.createElement('div');
// 				playerColumn.classList.add('player__column');

// 			appPlayer.appendChild(playerColumn);

// 			for (var y = 0; y < column.length; y++) {
// 				let noteButton = column[y].noteButton;
// 					noteButton.addEventListener('click', column[y].toggle);

// 				playerColumn.appendChild(noteButton);
// 			}

			
// 		}
// 	}

// 	function playNotes() {

// 		let x = 0;

// 		var playerInterval = window.setInterval(playColumn, time);

// 		function playColumn() {
// 			let columns = noteArray[x];

			
// 			for (var y = 0; y < columns.length; y++) {
// 				let noteButton = columns[y].noteButton,
// 					frequency = columns[y].frequency;

// 				if (noteButton.classList.contains('active')) {
					
// 					noteButton.classList.add('playing');
// 					var note = new Note(frequency);
// 					note.tweakStartTime();

// 					setTimeout(function() {
// 						noteButton.classList.remove('playing');
// 					}, 500);
// 				} 
// 			}

// 			x++;

// 			if (x == params.numberOfBeats) {
// 				x = 0;
// 			}
// 		}
// 	}

// 	function multiPlayerInit() {

// 		function connectToServer() {

// 			// delay initial construction of the app until after initial parameters have been set
// 		    return new Promise(function(resolve, reject) {

// 		    	// create live connection to server
// 		        server = new WebSocket('ws://localhost:1357');

// 		        // wait until server responds before finishing build
// 		        server.onopen = function() {

// 		        	// receive and react to server response
// 		        	server.onmessage = function(message) {

// 		        		// parse initial message
// 		        		let initMessage = JSON.parse(message.data);

// 		        		// check whether joining existing game or starting new one
// 		        		if (initMessage.call == 'null') {
// 		        			return;
// 		        		} else if (initMessage.call == 'init') {
// 		        			// if joining new existing, update player to reflect existing conditions
// 		        			for (var i = 0; i < initMessage.array.length; i++) {
// 		        				updatePlayer(initMessage.array[i]);
// 		        			}
// 		        		}

// 		        		// start loop to play notes
// 		        		playNotes();

// 		        		// finish pre-init
// 		        		resolve(server);
// 		        	}
// 		        }

// 		        server.onerror = function(err) {
// 		            reject(err);
// 		        }
// 		    })
// 		}

// 		// once pre-init has been completed
// 		connectToServer().then(function(server) {

// 			// set functions for how to react to all messages after
// 			server.onmessage = function(message) {

// 				let update = JSON.parse(message.data);
				
// 				// update.call describes the type of change to make
// 				if (update.call == 'update_toggle_array') {
// 					updatePlayer(update);	
// 				} if (update.call == 'new_partner_set') {
// 					console.log(update);
// 				}	
// 			}
// 		}).catch(function(err) {
// 			console.log(err);
// 		});

// 		// update handler
// 		function updatePlayer(message) {

// 			// target specifically the button that is changing
// 			var button = document.getElementById(message.id);

// 			// compare classList vals to the new vals 
// 			if 	(button.classList.contains('active') && message.val == 0) {
// 				// if val is false and button is true, set button to false by removing 'active' from classlist
// 				button.classList.remove('active');
// 			} else if (!button.classList.contains('active') && message.val == 1) {
// 				// if val is true and button is false, set button to true by adding 'active' to classlist
// 				button.classList.add('active');
// 			}
// 		}
// 	}
	

// 	function init() {
// 		// build an empty player
// 		generatePlayer();

// 		// populate it
// 		multiPlayerInit();
// 	}

// 	shared.init = init;
// 	return shared;
// }());

// App.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG5yZXZlcmJqcy5leHRlbmQoYXVkaW9DdHgpO1xuXG52YXIgcmV2ZXJiVXJsID0gXCJodHRwOi8vcmV2ZXJianMub3JnL0xpYnJhcnkvRXJyb2xCcmlja3dvcmtzS2lsbi5tNGFcIjtcbnZhciByZXZlcmJOb2RlID0gYXVkaW9DdHguY3JlYXRlUmV2ZXJiRnJvbVVybChyZXZlcmJVcmwsIGZ1bmN0aW9uKCkge1xuICByZXZlcmJOb2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xufSk7XG5cbnZhciBzZXJ2ZXI7XG52YXIgdXNlciA9IHt9O1xuXG5cbmNvbnN0IGZyZXF1ZW5jaWVzID0gW1x0XG5cdDEzMC44MSxcblx0MTM4LjU5LFxuXHQxNDYuODMsXG5cdDE1NS41Nixcblx0MTY0LjgxLFxuXHQxNzQuNjEsXG5cdDE4NS4wMCxcblx0MTk2LjAwLFxuXHQyMDcuNjUsXG5cdDIyMC4wMCxcblx0MjMzLjA4LFxuXHQyNDYuOTQsXG5cdDI2MS42Myxcblx0Mjc3LjE4LFxuXHQyOTMuNjYsXG5cdDMxMS4xMyxcblx0MzI5LjYzLFxuXHQzNDkuMjMsXG5cdDM2OS45OSxcblx0MzkyLjAwLFxuXHQ0MTUuMzAsXG5cdDQ0MC4wMCxcblx0NDY2LjE2LFxuXHQ0OTMuODgsXG5cdDUyMy4yNSxcblx0NTU0LjM3LFxuXHQ1ODcuMzMsXG5cdDYyMi4yNSxcblx0NjU5LjI1LFxuXHQ2OTguNDYsXG5cdDczOS45OSxcblx0NzgzLjk5LFxuXHQ4MzAuNjEsXG5cdDg4MC4wMCxcblx0OTMyLjMzLFxuXHQ5ODcuNzcsXG5cdDEwNDYuNTAsXG5cdDExMDguNzMsXG5cdDExNzQuNjYsXG5cdDEyNDQuNTEsXG5cdDEzMTguNTEsXG5cdDEzOTYuOTEsXG5cdDE0NzkuOTgsXG5cdDE1NjcuOTgsXG5cdDE2NjEuMjIsXG5cdDE3NjAuMDAsXG5cdDE4NjQuNjYsXG5cdDE5NzUuNTMsXG5dO1xuXG5jb25zdCBcdGMyID0gZnJlcXVlbmNpZXNbMF0sXG5cdFx0Y3MyID0gZnJlcXVlbmNpZXNbMV0sXG5cdFx0ZDIgPSBmcmVxdWVuY2llc1syXSxcblx0XHRkczIgPSBmcmVxdWVuY2llc1szXSxcblx0XHRcblx0XHRlMiA9IGZyZXF1ZW5jaWVzWzRdLFxuXHRcdGYyID0gZnJlcXVlbmNpZXNbNV0sXG5cdFx0ZnMyID0gZnJlcXVlbmNpZXNbNl0sXG5cdFx0ZzIgPSBmcmVxdWVuY2llc1s3XSxcblx0XHRnczIgPSBmcmVxdWVuY2llc1s4XSxcblx0XHRhMiA9IGZyZXF1ZW5jaWVzWzldLFxuXHRcdGFzMiA9IGZyZXF1ZW5jaWVzWzEwXSxcblx0XHRcblx0XHRiMiA9IGZyZXF1ZW5jaWVzWzExXSxcblx0XHRjMyA9IGZyZXF1ZW5jaWVzWzEyXSxcblx0XHRjczMgPSBmcmVxdWVuY2llc1sxM10sXG5cdFx0ZDMgPSBmcmVxdWVuY2llc1sxNF0sXG5cdFx0ZHMzID0gZnJlcXVlbmNpZXNbMTVdLFxuXHRcdFxuXHRcdGUzID0gZnJlcXVlbmNpZXNbMTZdLFxuXHRcdGYzID0gZnJlcXVlbmNpZXNbMTddLFxuXHRcdGZzMyA9IGZyZXF1ZW5jaWVzWzE4XSxcblx0XHRnMyA9IGZyZXF1ZW5jaWVzWzE5XSxcblx0XHRnczMgPSBmcmVxdWVuY2llc1syMF0sXG5cdFx0YTMgPSBmcmVxdWVuY2llc1syMV0sXG5cdFx0YXMzID0gZnJlcXVlbmNpZXNbMjJdLFxuXHRcdFxuXHRcdGIzID0gZnJlcXVlbmNpZXNbMjNdLFxuXHRcdGM0ID0gZnJlcXVlbmNpZXNbMjRdLFxuXHRcdGNzNCA9IGZyZXF1ZW5jaWVzWzI1XSxcblx0XHRkNCA9IGZyZXF1ZW5jaWVzWzI2XSxcblx0XHRkczQgPSBmcmVxdWVuY2llc1syN10sXG5cdFx0XG5cdFx0ZTQgPSBmcmVxdWVuY2llc1syOF0sXG5cdFx0ZjQgPSBmcmVxdWVuY2llc1syOV0sXG5cdFx0ZnM0ID0gZnJlcXVlbmNpZXNbMzBdLFxuXHRcdGc0ID0gZnJlcXVlbmNpZXNbMzFdLFxuXHRcdGdzNCA9IGZyZXF1ZW5jaWVzWzMyXSxcblx0XHRhNCA9IGZyZXF1ZW5jaWVzWzMzXSxcblx0XHRhczQgPSBmcmVxdWVuY2llc1szNF0sXG5cdFx0XG5cdFx0YjQgPSBmcmVxdWVuY2llc1szNV0sXG5cdFx0YzUgPSBmcmVxdWVuY2llc1szNl0sXG5cdFx0Y3M1ID0gZnJlcXVlbmNpZXNbMzddLFxuXHRcdGQ1ID0gZnJlcXVlbmNpZXNbMzhdLFxuXHRcdGRzNSA9IGZyZXF1ZW5jaWVzWzM5XSxcblx0XHRcblx0XHRlNSA9IGZyZXF1ZW5jaWVzWzQwXSxcblx0XHRmNSA9IGZyZXF1ZW5jaWVzWzQxXSxcblx0XHRmczUgPSBmcmVxdWVuY2llc1s0Ml0sXG5cdFx0ZzUgPSBmcmVxdWVuY2llc1s0M10sXG5cdFx0Z3M1ID0gZnJlcXVlbmNpZXNbNDRdLFxuXHRcdGE1ID0gZnJlcXVlbmNpZXNbNDVdLFxuXHRcdGFzNSA9IGZyZXF1ZW5jaWVzWzQ2XSxcblx0XHRcblx0XHRiNSA9IGZyZXF1ZW5jaWVzWzQ3XSxcblx0XHRjNiA9IGZyZXF1ZW5jaWVzWzQ4XSxcblx0XHRjczYgPSBmcmVxdWVuY2llc1s0OV0sXG5cdFx0ZDYgPSBmcmVxdWVuY2llc1s1MF0sXG5cdFx0ZHM2ID0gZnJlcXVlbmNpZXNbNTFdLFxuXHRcdFxuXHRcdGU2ID0gZnJlcXVlbmNpZXNbNTJdLFxuXHRcdGY2ID0gZnJlcXVlbmNpZXNbNTNdLFxuXHRcdGZzNiA9IGZyZXF1ZW5jaWVzWzU0XSxcblx0XHRnNiA9IGZyZXF1ZW5jaWVzWzU1XSxcblx0XHRnczYgPSBmcmVxdWVuY2llc1s1Nl0sXG5cdFx0YTYgPSBmcmVxdWVuY2llc1s1N10sXG5cdFx0YXM2ID0gZnJlcXVlbmNpZXNbNThdLFxuXHRcdFxuXHRcdGI2ID0gZnJlcXVlbmNpZXNbNTldO1xuXG5jbGFzcyBOb3RlIHtcblx0Y29uc3RydWN0b3IoZnJlcXVlbmN5KSB7XG5cdFx0dGhpcy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XG5cdFx0dGhpcy5vc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdHRoaXMub3NjaWxsYXRvci50eXBlID0gJ3NpbmUnO1xuXHRcdHRoaXMub3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSB0aGlzLmZyZXF1ZW5jeTsgLy8gdmFsdWUgaW4gaGVydHpcblxuXHRcdHRoaXMuZ2Fpbk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC4wO1xuXG5cdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5nYWluTm9kZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblx0XHR0aGlzLmNvbnRleHQgPSBhdWRpb0N0eDtcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5yYW5kb21JblJhbmdlKDEsIDMpO1xuXHRcdHRoaXMucGxheSA9IHRoaXMucGxheS5iaW5kKHRoaXMpO1xuXG5cdH1cblxuXHRyYW5kb21JblJhbmdlKGZyb20sIHRvKSB7XG5cdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoIHRvIC0gZnJvbSApICsgZnJvbSk7XG5cdFx0XHRyID0gci8xMDAwO1xuXHRcdHJldHVybiByO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHRsZXQgZ2FpblZhbHVlID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYgKHRoaXMuZnJlcXVlbmN5ID4gMTAwMCkge1xuXHRcdFx0Z2FpblZhbHVlID0gMC43O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjg7XG5cdFx0fVxuXG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGdhaW5WYWx1ZSwgKHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDAuMDggKyB0aGlzLmRlbGF5KSk7XG5cdFx0ICAgICAgICBcblx0XHR0aGlzLm9zY2lsbGF0b3Iuc3RhcnQodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLnN0b3AoKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0bGV0IHN0b3BUaW1lID0gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMjtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMSwgc3RvcFRpbWUpO1xuICAgICAgICB0aGlzLm9zY2lsbGF0b3Iuc3RvcChzdG9wVGltZSArIDAuMDUpO1xuXHR9XG5cblx0dHdlYWtTdGFydFRpbWUoKSB7XG5cdFx0c2V0VGltZW91dCh0aGlzLnBsYXksIHRoaXMuZGVsYXkpO1xuXHR9XG59XG5cbmNsYXNzIFNjYWxlIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XG5cdFx0dGhpcy5yb290Tm90ZSA9IHRoaXMucGFyYW1zLnJvb3ROb3RlO1xuXHRcdHRoaXMuc2NhbGVOYW1lID0gdGhpcy5wYXJhbXMuc2NhbGVOYW1lO1xuXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdHRoaXMuc3RhcnRpbmdJbmRleCA9IGZyZXF1ZW5jaWVzLmluZGV4T2YodGhpcy5yb290Tm90ZSk7XG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHR9XG5cblx0Z2VuZXJhdGUoKSB7XG5cdFx0bGV0IHggPSB0aGlzLnN0YXJ0aW5nSW5kZXg7XG5cblx0XHRjb25zdCB3ID0gMjtcblx0XHRjb25zdCBoID0gMTtcblx0XHRjb25zdCBvID0gMTM7XG5cblx0XHQvLyBjb25zdCBzdGVwQXJyYXkgPSB7XG5cdFx0Ly8gXHQnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMiwgMV0sXG5cdFx0Ly8gXHQnbWlub3InOiBbXVxuXHRcdC8vIH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWFqb3InKSB7XG5cdFx0XHQvLyBSLCBXLCBXLCBILCBXLCBXLCBXLCBIXG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ21pbm9yJykgeyBcblx0XHRcdC8vIFIsIFcsIEgsIFcsIFcsIEgsIFcsIFdcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3JfaGFybW9uaWMnKSB7IFxuXHRcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgMSAxLzIsIEhcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdwZW50YXRvbmljX21ham9yJykge1xuXHRcdFx0Ly8gVyBXIDEtMS8yIHN0ZXAgVyAxLTEvMiBzdGVwXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzKjEuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdwZW50YXRvbmljX21pbm9yJykge1xuXHRcdFx0Ly8gUiwgMSAxLzIsIFcsIFcsIDEgMS8yLCBXXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzKjEuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2ZpZnRocycpIHtcblx0XHRcdC8vIFIsIDdcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiA0LjU7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnY2hvcmRfbWFqb3InKSB7XG5cdFx0XHQvLyBSLCA0LCAzXG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgMztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2Nob3JkX21pbm9yJykge1xuXHRcdFx0Ly8gUiwgMywgNFxuXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzICogMztcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyAzO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9zdXMnKSB7XG5cdFx0XHQvLyBSLCA1LCAyXG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDU7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDI7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0fVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblx0XHQvLyB0aGlzLnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZCh0aGlzKTtcblx0fVxuXG5cdGdlbmVyYXRlUGxheWVyQXJyYXkoKSB7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHRsZXQgY29sdW1uID0gMDtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDw9IHRoaXMubnVtYmVyT2ZCZWF0czsgeCsrKSB7XG5cdFx0XHQvL2NvbHVtbnMgKGFsbCB0aGUgc2FtZSBpbmRleCBudW1iZXIpXG5cdFx0XHR0aGlzLm5vdGVzQXJyYXkucHVzaChbXSk7XG5cblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5zY2FsZS5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHQvL3Jvd3MgKGluY3JlYXNlIGluZGV4IG51bWJlciBieSBvbmUpXG5cblx0XHRcdFx0dmFyIGNvbHVtblN0cmluZztcblx0XHRcdFx0dmFyIGluZGV4U3RyaW5nO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PSB0aGlzLnNjYWxlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb2x1bW4gPCAxMCkge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGAwJHtjb2x1bW59YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBjb2x1bW47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaW5kZXggPCAxMCkge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gYDAke2luZGV4fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBpbmRleDtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0bGV0IGFycmF5T2JqZWN0ID0ge307XG5cdFx0XHRcdGFycmF5T2JqZWN0LmlkID0gY29sdW1uU3RyaW5nKydfJytpbmRleFN0cmluZztcblx0XHRcdFx0YXJyYXlPYmplY3QuZnJlcXVlbmN5ID0gdGhpcy5zY2FsZVtpbmRleF07XG5cdFx0XHRcdGFycmF5T2JqZWN0LnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC5tdWx0aXBsYXllclRvZ2dsZSA9IHRoaXMubXVsdGlwbGF5ZXJUb2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlubmVySFRNTCA9IGFycmF5T2JqZWN0LmZyZXF1ZW5jeTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXHR9XG5cblx0bXVsdGlwbGF5ZXJUb2dnbGUoaW5mbykge1xuXHRcdFxuXHRcdHRoaXMudG9nZ2xlKCk7XG5cblx0XHRsZXQgb2JqID0ge307XG5cdFx0XHRvYmouY2FsbCA9ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jztcblx0XHRcdG9iai5pZCA9IHRoaXMuaWQ7XG5cblx0XHRpZiAodGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG9iai52YWwgPSAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmoudmFsID0gMDtcblx0XHR9XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0dGhpcy5zZXJ2ZXIuc2VuZChvYmpUb1NlbmQpO1xuXHRcdGNvbnNvbGUubG9nKG9iaik7XG5cblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHQvLyBlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0Ly8gdGhpcy51cGRhdGVJbmRleEFycmF5KHRoaXMsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0Ly8gdGhpcy51cGRhdGVJbmRleEFycmF5KHRoaXMsIDEpO1xuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHRyb290Tm90ZTogYzIsXG5cdFx0XHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHRcdGJwbTogMTAwLFxuXHRcdFx0ZHVyYXRpb246IDQsXG5cdFx0XHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHR9O1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR9XG5cblx0XHR0aGlzLnBhcmFtcy5iZWF0cyA9IHRoaXMucGFyYW1zLnNpZ25hdHVyZVswXTtcblx0XHR0aGlzLnBhcmFtcy5tZWFzdXJlID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzFdO1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5kdXJhdGlvbip0aGlzLnBhcmFtcy5iZWF0cztcblx0XHR0aGlzLnBhcmFtcy50aW1lID0gdGhpcy5wYXJhbXMuYnBtICogNDtcblxuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLmdlbmVyYXRlQXBwID0gdGhpcy5nZW5lcmF0ZUFwcC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuc2V0UGxheUludGVydmFsID0gdGhpcy5zZXRQbGF5SW50ZXJ2YWwuYmluZCh0aGlzKTtcblx0XHR0aGlzLnBsYXlDb2x1bW4gPSB0aGlzLnBsYXlDb2x1bW4uYmluZCh0aGlzKTtcblx0XHR0aGlzLnJlZnJlc2hBcHAgPSB0aGlzLnJlZnJlc2hBcHA7XG5cblx0XHR0aGlzLmFwcENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBQbGF5ZXInKTtcblx0fVxuXG5cdGdlbmVyYXRlQXBwKGNvbmRpdGlvbikge1xuXG5cdFx0Zm9yICh0aGlzLnggPSAwOyB0aGlzLnggPCB0aGlzLm5vdGVBcnJheS5sZW5ndGg7IHRoaXMueCsrKSB7XG5cdFx0XHR0aGlzLmNvbHVtbiA9IHRoaXMubm90ZUFycmF5W3RoaXMueF07XG5cdFx0XHRcblx0XHRcdHRoaXMucGxheWVyQ29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHRoaXMucGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cblx0XHRcdHRoaXMuYXBwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucGxheWVyQ29sdW1uKTtcblxuXHRcdFx0Zm9yICh0aGlzLnkgPSAwOyB0aGlzLnkgPCB0aGlzLmNvbHVtbi5sZW5ndGg7IHRoaXMueSsrKSB7XG5cdFx0XHRcdHRoaXMubm90ZUJ1dHRvbiA9IHRoaXMuY29sdW1uW3RoaXMueV0ubm90ZUJ1dHRvbjtcblx0XHRcdFx0XHRpZiAoY29uZGl0aW9uID09ICdtdWx0aScpIHtcblx0XHRcdFx0XHRcdHRoaXMubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY29sdW1uW3RoaXMueV0ubXVsdGlwbGF5ZXJUb2dnbGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNvbHVtblt0aGlzLnldLnRvZ2dsZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnBsYXllckNvbHVtbi5hcHBlbmRDaGlsZCh0aGlzLm5vdGVCdXR0b24pO1xuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRQbGF5SW50ZXJ2YWwoKTtcblx0fVxuXG5cdHJlZnJlc2hBcHAoKSB7XG5cdFx0dGhpcy5hcHBDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cblx0XHR0aGlzLmdlbmVyYXRlQXBwKCk7XG5cdH1cblxuXHRzZXRQbGF5SW50ZXJ2YWwoKSB7XG5cdFx0dGhpcy54Q291bnQgPSAwO1xuXG5cdFx0aWYgKHRoaXMucGxheWVySW50ZXJ2YWwpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXJJbnRlcnZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5wbGF5Q29sdW1uLCB0aGlzLnBhcmFtcy50aW1lKTtcblx0XHR9XG5cdH1cblxuXHRwbGF5Q29sdW1uKCkge1xuXG5cdFx0dGhpcy5jb2x1bW5zID0gdGhpcy5ub3RlQXJyYXlbdGhpcy54Q291bnRdO1xuXHRcblx0XHRmb3IgKHRoaXMueUNvdW50ID0gMDsgdGhpcy55Q291bnQgPCB0aGlzLmNvbHVtbnMubGVuZ3RoOyB0aGlzLnlDb3VudCsrKSB7XG5cdFx0XHR0aGlzLm5vdGVCdXR0b24gPSB0aGlzLmNvbHVtbnNbdGhpcy55Q291bnRdLm5vdGVCdXR0b247XG5cdFx0XHR0aGlzLmZyZXF1ZW5jeSA9IHRoaXMuY29sdW1uc1t0aGlzLnlDb3VudF0uZnJlcXVlbmN5O1xuXG5cdFx0XHRpZiAodGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0dGhpcy5ub3RlID0gbmV3IE5vdGUodGhpcy5mcmVxdWVuY3kpO1xuXHRcdFx0XHR0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuXHRcdFx0XHR0aGlzLm5vdGUudHdlYWtTdGFydFRpbWUoKTtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXlpbmcnKTtcblx0XHRcdFx0fSwgdGhpcy5wYXJhbXMudGltZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyArIDEpIHtcblx0XHRcdHRoaXMueENvdW50ID0gMDtcblx0XHR9XG5cdH1cblxuXHRpbml0KCkge1xuXHRcdHRoaXMuZ2VuZXJhdGVBcHAoKTtcblx0fVxufVxuXG5jbGFzcyBNdWx0aXBsYXllckFwcCBleHRlbmRzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHN1cGVyKHBhcmFtcyk7XG5cdFx0dGhpcy5jb25uZWN0VG9TZXJ2ZXIgPSB0aGlzLmNvbm5lY3RUb1NlcnZlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMubGlzdGVuRm9yVXBkYXRlcyA9IHRoaXMubGlzdGVuRm9yVXBkYXRlcy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMudXBkYXRlUGxheWVyID0gdGhpcy51cGRhdGVQbGF5ZXIuYmluZCh0aGlzKTtcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLm5vdGVBcnJheSk7XG5cdH1cblxuXHRjb25uZWN0VG9TZXJ2ZXIoKSB7XG5cdFx0Ly8gZGVsYXkgaW5pdGlhbCBjb25zdHJ1Y3Rpb24gb2YgdGhlIGFwcCB1bnRpbCBhZnRlciBpbml0aWFsIHBhcmFtZXRlcnMgaGF2ZSBiZWVuIHNldFxuXHRcdFxuXHRcdC8vIGNyZWF0ZSBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyXG5cdCAgICB0aGlzLnNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHRcdHJldHVybiAoXG5cdFx0ICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcblx0XHQgICAgdGhpcy5zZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0XHQgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0XHQgICAgXHR0aGlzLnNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHQgICAgXHRcdC8vIHBhcnNlIGluaXRpYWwgbWVzc2FnZVxuXHRcdCAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdFx0ICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdFx0ICAgIFx0XHRpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnbnVsbCcpIHtcblx0XHQgICAgXHRcdFx0cmV0dXJuO1xuXHRcdCAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHRcdCAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0XHQgICAgXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbml0TWVzc2FnZS5hcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdCAgICBcdFx0XHRcdHRoaXMudXBkYXRlUGxheWVyKGluaXRNZXNzYWdlLmFycmF5W2ldKTtcblx0XHQgICAgXHRcdFx0fVxuXHRcdCAgICBcdFx0fVxuXG5cdFx0ICAgIFx0XHQvLyBzdGFydCBsb29wIHRvIHBsYXkgbm90ZXNcblx0XHQgICAgXHRcdHRoaXMuc3VwZXIuc2V0UGxheUludGVydmFsKCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KS50aGVuKHRoaXMubGlzdGVuRm9yVXBkYXRlcyk7XG5cdH1cblxuXHRsaXN0ZW5Gb3JVcGRhdGVzKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQvLyBzZXQgZnVuY3Rpb25zIGZvciBob3cgdG8gcmVhY3QgdG8gYWxsIG1lc3NhZ2VzIGFmdGVyXG5cdFx0XHR0aGlzLnNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdFx0XHRcdHRoaXMudXBkYXRlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gdXBkYXRlLmNhbGwgZGVzY3JpYmVzIHRoZSB0eXBlIG9mIGNoYW5nZSB0byBtYWtlXG5cdFx0XHRcdGlmICh0aGlzLnVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuXHRcdFx0XHRcdHRoaXMuYnV0dG9uLmlkID0gdGhpcy51cGRhdGUuaWQ7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVQbGF5ZXIoKTtcdFxuXHRcdFx0XHR9IGlmICh0aGlzLnVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coKTtcblx0XHRcdFx0fVx0XG5cdFx0XHR9XG5cdFx0KS50aGVuKFxuXHRcdFx0dGhpcy5zZXJ2ZXIuY2F0Y2ggPSBmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dXBkYXRlUGxheWVyKCkge1xuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0dGhpcy5idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnVwZGF0ZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdCh0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIHRoaXMudXBkYXRlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHR0aGlzLmJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9IGVsc2UgaWYgKCF0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIHRoaXMudXBkYXRlLnZhbCA9PSAxKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgdHJ1ZSBhbmQgYnV0dG9uIGlzIGZhbHNlLCBzZXQgYnV0dG9uIHRvIHRydWUgYnkgYWRkaW5nICdhY3RpdmUnIHRvIGNsYXNzbGlzdFxuXHRcdFx0dGhpcy5idXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbmNsYXNzIFNpbmdsZVBsYXllckFwcCBleHRlbmRzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHN1cGVyKHBhcmFtcyk7XG5cdFx0Ly8gdGhpcy5nZW5lcmF0ZUFwcCA9IHRoaXMucGFyYW1zLmdlbmVyYXRlQXBwLmJpbmQodGhpcyk7XG5cdFx0XG5cdFx0dGhpcy5vcHRpb25zID0ge307XG5cblx0XHR0aGlzLnNpbmdsZVBsYXllckNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllck9wdGlvbnMnKTtcblx0XHR0aGlzLnJlYnVpbGRBcHAgPSB0aGlzLnJlYnVpbGRBcHAuYmluZCh0aGlzKTtcblx0XHQvLyB0aGlzLnNpbmdsZVBsYXllckNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXHRcdHRoaXMubWVudVN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51U3VibWl0Jyk7XG5cdFx0dGhpcy5tZW51U3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5yZWJ1aWxkQXBwKTtcblxuXG5cdFx0dGhpcy5vcHRpb25zLnNjYWxlU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NhbGVTZWxlY3RvcicpO1xuXHRcdHRoaXMub3B0aW9ucy5yb290U2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdFNlbGVjdG9yJyk7XG5cdFx0dGhpcy5vcHRpb25zLm9jdGF2ZXNTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvY3RhdmVzTnVtU2VsZWN0b3InKTtcblx0XHRcblx0fVxuXG5cdC8vYWN0aXZhdGUgc2luZ2xlIHBsYXllciBjb250cm9sc1xuXHRyZWJ1aWxkQXBwKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Y29uc29sZS5sb2coJ3JlYnVpbGQnKTtcblx0XHRjb25zb2xlLmRpcih0aGlzLm9wdGlvbnMpO1xuXHR9XG5cbn1cblxuLy8gdmFyIGxvY2FsQXBwID0gbmV3IFNpbmdsZVBsYXllckFwcDtcbi8vIFx0bG9jYWxBcHAuZ2VuZXJhdGVBcHAoKTtcblxudmFyIG11bHRpQXBwID0gbmV3IE11bHRpcGxheWVyQXBwO1xuXHRtdWx0aUFwcC5nZW5lcmF0ZUFwcCgnbXVsdGknKTtcblxuXG4vLyBmdW5jdGlvbiBtdWx0aVBsYXllckluaXQoKSB7XG5cbi8vIFx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG4vLyBcdFx0Ly8gZGVsYXkgaW5pdGlhbCBjb25zdHJ1Y3Rpb24gb2YgdGhlIGFwcCB1bnRpbCBhZnRlciBpbml0aWFsIHBhcmFtZXRlcnMgaGF2ZSBiZWVuIHNldFxuLy8gXHQgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4vLyBcdCAgICBcdC8vIGNyZWF0ZSBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyXG4vLyBcdCAgICAgICAgc2VydmVyID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6MTM1NycpO1xuXG4vLyBcdCAgICAgICAgLy8gd2FpdCB1bnRpbCBzZXJ2ZXIgcmVzcG9uZHMgYmVmb3JlIGZpbmlzaGluZyBidWlsZFxuLy8gXHQgICAgICAgIHNlcnZlci5vbm9wZW4gPSBmdW5jdGlvbigpIHtcblxuLy8gXHQgICAgICAgIFx0Ly8gcmVjZWl2ZSBhbmQgcmVhY3QgdG8gc2VydmVyIHJlc3BvbnNlXG4vLyBcdCAgICAgICAgXHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG4vLyBcdCAgICAgICAgXHRcdC8vIHBhcnNlIGluaXRpYWwgbWVzc2FnZVxuLy8gXHQgICAgICAgIFx0XHRsZXQgaW5pdE1lc3NhZ2UgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cbi8vIFx0ICAgICAgICBcdFx0Ly8gY2hlY2sgd2hldGhlciBqb2luaW5nIGV4aXN0aW5nIGdhbWUgb3Igc3RhcnRpbmcgbmV3IG9uZVxuLy8gXHQgICAgICAgIFx0XHRpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnbnVsbCcpIHtcbi8vIFx0ICAgICAgICBcdFx0XHRyZXR1cm47XG4vLyBcdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcbi8vIFx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcbi8vIFx0ICAgICAgICBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGluaXRNZXNzYWdlLmFycmF5Lmxlbmd0aDsgaSsrKSB7XG4vLyBcdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuLy8gXHQgICAgICAgIFx0XHRcdH1cbi8vIFx0ICAgICAgICBcdFx0fVxuXG4vLyBcdCAgICAgICAgXHRcdC8vIHN0YXJ0IGxvb3AgdG8gcGxheSBub3Rlc1xuLy8gXHQgICAgICAgIFx0XHRwbGF5Tm90ZXMoKTtcblxuLy8gXHQgICAgICAgIFx0XHQvLyBmaW5pc2ggcHJlLWluaXRcbi8vIFx0ICAgICAgICBcdFx0cmVzb2x2ZShzZXJ2ZXIpO1xuLy8gXHQgICAgICAgIFx0fVxuLy8gXHQgICAgICAgIH1cblxuLy8gXHQgICAgICAgIHNlcnZlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4vLyBcdCAgICAgICAgICAgIHJlamVjdChlcnIpO1xuLy8gXHQgICAgICAgIH1cbi8vIFx0ICAgIH0pXG4vLyBcdH1cblxuLy8gXHQvLyBvbmNlIHByZS1pbml0IGhhcyBiZWVuIGNvbXBsZXRlZFxuLy8gXHRjb25uZWN0VG9TZXJ2ZXIoKS50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXG4vLyBcdFx0Ly8gc2V0IGZ1bmN0aW9ucyBmb3IgaG93IHRvIHJlYWN0IHRvIGFsbCBtZXNzYWdlcyBhZnRlclxuLy8gXHRcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cbi8vIFx0XHRcdGxldCB1cGRhdGUgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRcbi8vIFx0XHRcdC8vIHVwZGF0ZS5jYWxsIGRlc2NyaWJlcyB0aGUgdHlwZSBvZiBjaGFuZ2UgdG8gbWFrZVxuLy8gXHRcdFx0aWYgKHVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuLy8gXHRcdFx0XHR1cGRhdGVQbGF5ZXIodXBkYXRlKTtcdFxuLy8gXHRcdFx0fSBpZiAodXBkYXRlLmNhbGwgPT0gJ25ld19wYXJ0bmVyX3NldCcpIHtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcbi8vIFx0XHRcdH1cdFxuLy8gXHRcdH1cbi8vIFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4vLyBcdFx0Y29uc29sZS5sb2coZXJyKTtcbi8vIFx0fSk7XG5cbi8vIFx0Ly8gdXBkYXRlIGhhbmRsZXJcbi8vIFx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuLy8gXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG4vLyBcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG4vLyBcdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG4vLyBcdFx0aWYgXHQoYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMCkge1xuLy8gXHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuLy8gXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuLy8gXHRcdH0gZWxzZSBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDEpIHtcbi8vIFx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG4vLyBcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9XG5cbi8vIHZhciBBcHAgPSAoZnVuY3Rpb24ocGFyYW1zKSB7XG4vLyBcdGxldCBzaGFyZWQgPSB7fTtcblxuLy8gXHRjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuLy8gXHRcdHJvb3ROb3RlOiBjMixcbi8vIFx0XHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcbi8vIFx0XHRudW1iZXJPZk9jdGF2ZXM6IDIsXG4vLyBcdFx0YnBtOiAxMDAsXG4vLyBcdFx0ZHVyYXRpb246IDIsXG4vLyBcdFx0c2lnbmF0dXJlOiBbNCwgNF0sXG4vLyBcdFx0bnVtYmVyT2ZPY3RhdmVzOiAyLFxuLy8gXHR9O1xuXG4vLyBcdGlmICghcGFyYW1zKSB7XG4vLyBcdFx0cGFyYW1zID0gZGVmYXVsdFBhcmFtcztcbi8vIFx0fSBcblxuLy8gXHRwYXJhbXMuYmVhdHMgPSBwYXJhbXMuc2lnbmF0dXJlWzBdO1xuLy8gXHRwYXJhbXMubWVhc3VyZSA9IHBhcmFtcy5zaWduYXR1cmVbMV07XG4vLyBcdHBhcmFtcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLmR1cmF0aW9uKnBhcmFtcy5iZWF0cztcblxuLy8gXHRjb25zdCBzY2FsZSA9IG5ldyBTY2FsZShwYXJhbXMpO1xuXG4vLyBcdHBhcmFtcy5zY2FsZSA9IHNjYWxlLmdlbmVyYXRlKCk7XG5cbi8vIFx0bGV0IFx0cGxheWVyID0gbmV3IFBsYXllcihwYXJhbXMpO1xuLy8gXHRcdFx0cGxheWVyQXJyYXlzID0gcGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcbi8vIFx0Y29uc3QgXHRub3RlQXJyYXkgPSBwbGF5ZXJBcnJheXMubm90ZXNBcnJheSxcbi8vIFx0XHRcdGlkQXJyYXkgPSBwbGF5ZXJBcnJheXMuaWRBcnJheTtcblxuLy8gXHRmdW5jdGlvbiBnZW5lcmF0ZVBsYXllcigpIHtcbi8vIFx0XHR2YXIgYXBwUGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpO1xuXG4vLyBcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBub3RlQXJyYXkubGVuZ3RoOyB4KyspIHtcbi8vIFx0XHRcdHZhciBjb2x1bW4gPSBub3RlQXJyYXlbeF07XG5cdFx0XHRcbi8vIFx0XHRcdHZhciBwbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbi8vIFx0XHRcdFx0cGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cbi8vIFx0XHRcdGFwcFBsYXllci5hcHBlbmRDaGlsZChwbGF5ZXJDb2x1bW4pO1xuXG4vLyBcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbi5sZW5ndGg7IHkrKykge1xuLy8gXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtblt5XS5ub3RlQnV0dG9uO1xuLy8gXHRcdFx0XHRcdG5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb2x1bW5beV0udG9nZ2xlKTtcblxuLy8gXHRcdFx0XHRwbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQobm90ZUJ1dHRvbik7XG4vLyBcdFx0XHR9XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuXG4vLyBcdGZ1bmN0aW9uIHBsYXlOb3RlcygpIHtcblxuLy8gXHRcdGxldCB4ID0gMDtcblxuLy8gXHRcdHZhciBwbGF5ZXJJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChwbGF5Q29sdW1uLCB0aW1lKTtcblxuLy8gXHRcdGZ1bmN0aW9uIHBsYXlDb2x1bW4oKSB7XG4vLyBcdFx0XHRsZXQgY29sdW1ucyA9IG5vdGVBcnJheVt4XTtcblxuXHRcdFx0XG4vLyBcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbnMubGVuZ3RoOyB5KyspIHtcbi8vIFx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBjb2x1bW5zW3ldLm5vdGVCdXR0b24sXG4vLyBcdFx0XHRcdFx0ZnJlcXVlbmN5ID0gY29sdW1uc1t5XS5mcmVxdWVuY3k7XG5cbi8vIFx0XHRcdFx0aWYgKG5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdFxuLy8gXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuLy8gXHRcdFx0XHRcdHZhciBub3RlID0gbmV3IE5vdGUoZnJlcXVlbmN5KTtcbi8vIFx0XHRcdFx0XHRub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cbi8vIFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG4vLyBcdFx0XHRcdFx0fSwgNTAwKTtcbi8vIFx0XHRcdFx0fSBcbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0eCsrO1xuXG4vLyBcdFx0XHRpZiAoeCA9PSBwYXJhbXMubnVtYmVyT2ZCZWF0cykge1xuLy8gXHRcdFx0XHR4ID0gMDtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHRmdW5jdGlvbiBtdWx0aVBsYXllckluaXQoKSB7XG5cbi8vIFx0XHRmdW5jdGlvbiBjb25uZWN0VG9TZXJ2ZXIoKSB7XG5cbi8vIFx0XHRcdC8vIGRlbGF5IGluaXRpYWwgY29uc3RydWN0aW9uIG9mIHRoZSBhcHAgdW50aWwgYWZ0ZXIgaW5pdGlhbCBwYXJhbWV0ZXJzIGhhdmUgYmVlbiBzZXRcbi8vIFx0XHQgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4vLyBcdFx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcbi8vIFx0XHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuLy8gXHRcdCAgICAgICAgLy8gd2FpdCB1bnRpbCBzZXJ2ZXIgcmVzcG9uZHMgYmVmb3JlIGZpbmlzaGluZyBidWlsZFxuLy8gXHRcdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG4vLyBcdFx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuLy8gXHRcdCAgICAgICAgXHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG4vLyBcdFx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG4vLyBcdFx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG4vLyBcdFx0ICAgICAgICBcdFx0Ly8gY2hlY2sgd2hldGhlciBqb2luaW5nIGV4aXN0aW5nIGdhbWUgb3Igc3RhcnRpbmcgbmV3IG9uZVxuLy8gXHRcdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuLy8gXHRcdCAgICAgICAgXHRcdFx0cmV0dXJuO1xuLy8gXHRcdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcbi8vIFx0XHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuLy8gXHRcdCAgICAgICAgXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbml0TWVzc2FnZS5hcnJheS5sZW5ndGg7IGkrKykge1xuLy8gXHRcdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuLy8gXHRcdCAgICAgICAgXHRcdFx0fVxuLy8gXHRcdCAgICAgICAgXHRcdH1cblxuLy8gXHRcdCAgICAgICAgXHRcdC8vIHN0YXJ0IGxvb3AgdG8gcGxheSBub3Rlc1xuLy8gXHRcdCAgICAgICAgXHRcdHBsYXlOb3RlcygpO1xuXG4vLyBcdFx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG4vLyBcdFx0ICAgICAgICBcdFx0cmVzb2x2ZShzZXJ2ZXIpO1xuLy8gXHRcdCAgICAgICAgXHR9XG4vLyBcdFx0ICAgICAgICB9XG5cbi8vIFx0XHQgICAgICAgIHNlcnZlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4vLyBcdFx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG4vLyBcdFx0ICAgICAgICB9XG4vLyBcdFx0ICAgIH0pXG4vLyBcdFx0fVxuXG4vLyBcdFx0Ly8gb25jZSBwcmUtaW5pdCBoYXMgYmVlbiBjb21wbGV0ZWRcbi8vIFx0XHRjb25uZWN0VG9TZXJ2ZXIoKS50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXG4vLyBcdFx0XHQvLyBzZXQgZnVuY3Rpb25zIGZvciBob3cgdG8gcmVhY3QgdG8gYWxsIG1lc3NhZ2VzIGFmdGVyXG4vLyBcdFx0XHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG4vLyBcdFx0XHRcdGxldCB1cGRhdGUgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRcdFxuLy8gXHRcdFx0XHQvLyB1cGRhdGUuY2FsbCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgY2hhbmdlIHRvIG1ha2Vcbi8vIFx0XHRcdFx0aWYgKHVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuLy8gXHRcdFx0XHRcdHVwZGF0ZVBsYXllcih1cGRhdGUpO1x0XG4vLyBcdFx0XHRcdH0gaWYgKHVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcbi8vIFx0XHRcdFx0fVx0XG4vLyBcdFx0XHR9XG4vLyBcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4vLyBcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuLy8gXHRcdH0pO1xuXG4vLyBcdFx0Ly8gdXBkYXRlIGhhbmRsZXJcbi8vIFx0XHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG4vLyBcdFx0XHQvLyB0YXJnZXQgc3BlY2lmaWNhbGx5IHRoZSBidXR0b24gdGhhdCBpcyBjaGFuZ2luZ1xuLy8gXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG4vLyBcdFx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcbi8vIFx0XHRcdGlmIFx0KGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDApIHtcbi8vIFx0XHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuLy8gXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4vLyBcdFx0XHR9IGVsc2UgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAxKSB7XG4vLyBcdFx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG4vLyBcdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vIFx0XHRcdH1cbi8vIFx0XHR9XG4vLyBcdH1cblx0XG5cbi8vIFx0ZnVuY3Rpb24gaW5pdCgpIHtcbi8vIFx0XHQvLyBidWlsZCBhbiBlbXB0eSBwbGF5ZXJcbi8vIFx0XHRnZW5lcmF0ZVBsYXllcigpO1xuXG4vLyBcdFx0Ly8gcG9wdWxhdGUgaXRcbi8vIFx0XHRtdWx0aVBsYXllckluaXQoKTtcbi8vIFx0fVxuXG4vLyBcdHNoYXJlZC5pbml0ID0gaW5pdDtcbi8vIFx0cmV0dXJuIHNoYXJlZDtcbi8vIH0oKSk7XG5cbi8vIEFwcC5pbml0KCk7Il19
