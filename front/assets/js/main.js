var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioCtx);

var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(audioCtx.destination);
});

var server;
var user = {};


// function sendData(e) {
//     e.preventDefault();
//     let data = [];

//     let inputVals = document.querySelectorAll('.all-inputs');


//     for (var i = 0; i < inputVals.length; i++) {
//         let input = {};
//             input.value = inputVals[i].value;
//             input.name = 'input' + i;

//         data.push(input);
//     }

//     data = JSON.stringify(data);
//     client.send(data);

// }


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
		this.updateIndexArray = this.updateIndexArray.bind(this);
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
				arrayObject.updateIndexArray = this.updateIndexArray;
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

	updateIndexArray(info, val) {
		let obj = {};
			obj.call = 'update_toggle_array';
			obj.id = info.id;
			obj.val = val;

		const objToSend = JSON.stringify(obj);

		server.send(objToSend);
	}

	toggle(e) {
		e.preventDefault();

		let noteButton = this.noteButton;
		if (noteButton.classList.contains('active')) {
			noteButton.classList.remove('active');
			//this.updateIndexArray(this, 0);
		} else {
			noteButton.classList.add('active');
			//this.updateIndexArray(this, 1);
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
		this.removeStyles = this.removeStyles.bind(this);

		this.appContainer = document.getElementById('appPlayer');
	}

	generateApp() {

		for (this.x = 0; this.x < this.noteArray.length; this.x++) {
			this.column = this.noteArray[this.x];
			
			this.playerColumn = document.createElement('div');
				this.playerColumn.classList.add('player__column');

			this.appContainer.appendChild(this.playerColumn);

			for (this.y = 0; this.y < this.column.length; this.y++) {
				this.noteButton = this.column[this.y].noteButton;
				this.noteButton.addEventListener('click', this.column[this.y].toggle);
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

				setTimeout(this.removeStyles, this.params.time);
			} 
		}

		this.xCount++;

		if (this.xCount == this.params.numberOfBeats) {
			this.xCount = 0;
		}
	}

	removeStyles() {
		this.noteButton.classList.remove('playing');
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
		this.generateApp = this.super.generateApp;
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

// class SinglePlayerApp extends App {
// 	constructor(params) {
// 		super(params);
// 		// this.generateApp = this.params.generateApp.bind(this);
		
// 		this.options = {};

// 		this.singlePlayerControls = document.getElementById('playerOptions');
// 		this.rebuildApp = this.rebuildApp.bind(this);
// 		// this.singlePlayerControls.classList.remove('hidden');
// 		this.menuSubmit = document.getElementById('menuSubmit');
// 		this.menuSubmit.addEventListener('click', this.rebuildApp);


// 		this.options.scaleSelector = document.getElementById('scaleSelector');
// 		this.options.rootSelector = document.getElementById('rootSelector');
// 		this.options.octavesSelector = document.getElementById('octavesNumSelector');
		
// 	}

// 	//activate single player controls
// 	rebuildApp(e) {
// 		e.preventDefault();
// 		console.log('rebuild');
// 		console.dir(this.options);
// 	}

// }

// var localApp = new SinglePlayerApp;
// 	localApp.generateApp();

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

function init() {
	let localApp = new App();
		localApp.init();

		function playNotes() {

			let x = 0;

			var playerInterval = window.setInterval(playColumn, time);

			function playColumn() {
				let columns = noteArray[x];

				
				for (var y = 0; y < columns.length; y++) {
					let noteButton = columns[y].noteButton,
						frequency = columns[y].frequency;

					if (noteButton.classList.contains('active')) {
						
						noteButton.classList.add('playing');
						setTimeout(function(noteButton) {
							noteButton.classList.remove('playing');
						}, 500);


						var note = new Note(frequency);
							note.tweakStartTime();

						
					} 
				}

				x++;

				if (x == params.numberOfBeats) {
					x = 0;
				}
			}
		}
}

init();


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG5yZXZlcmJqcy5leHRlbmQoYXVkaW9DdHgpO1xuXG52YXIgcmV2ZXJiVXJsID0gXCJodHRwOi8vcmV2ZXJianMub3JnL0xpYnJhcnkvRXJyb2xCcmlja3dvcmtzS2lsbi5tNGFcIjtcbnZhciByZXZlcmJOb2RlID0gYXVkaW9DdHguY3JlYXRlUmV2ZXJiRnJvbVVybChyZXZlcmJVcmwsIGZ1bmN0aW9uKCkge1xuICByZXZlcmJOb2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xufSk7XG5cbnZhciBzZXJ2ZXI7XG52YXIgdXNlciA9IHt9O1xuXG5cbi8vIGZ1bmN0aW9uIHNlbmREYXRhKGUpIHtcbi8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgbGV0IGRhdGEgPSBbXTtcblxuLy8gICAgIGxldCBpbnB1dFZhbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWxsLWlucHV0cycpO1xuXG5cbi8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0VmFscy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgICBsZXQgaW5wdXQgPSB7fTtcbi8vICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gaW5wdXRWYWxzW2ldLnZhbHVlO1xuLy8gICAgICAgICAgICAgaW5wdXQubmFtZSA9ICdpbnB1dCcgKyBpO1xuXG4vLyAgICAgICAgIGRhdGEucHVzaChpbnB1dCk7XG4vLyAgICAgfVxuXG4vLyAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuLy8gICAgIGNsaWVudC5zZW5kKGRhdGEpO1xuXG4vLyB9XG5cblxuY29uc3QgZnJlcXVlbmNpZXMgPSBbXHRcblx0MTMwLjgxLFxuXHQxMzguNTksXG5cdDE0Ni44Myxcblx0MTU1LjU2LFxuXHQxNjQuODEsXG5cdDE3NC42MSxcblx0MTg1LjAwLFxuXHQxOTYuMDAsXG5cdDIwNy42NSxcblx0MjIwLjAwLFxuXHQyMzMuMDgsXG5cdDI0Ni45NCxcblx0MjYxLjYzLFxuXHQyNzcuMTgsXG5cdDI5My42Nixcblx0MzExLjEzLFxuXHQzMjkuNjMsXG5cdDM0OS4yMyxcblx0MzY5Ljk5LFxuXHQzOTIuMDAsXG5cdDQxNS4zMCxcblx0NDQwLjAwLFxuXHQ0NjYuMTYsXG5cdDQ5My44OCxcblx0NTIzLjI1LFxuXHQ1NTQuMzcsXG5cdDU4Ny4zMyxcblx0NjIyLjI1LFxuXHQ2NTkuMjUsXG5cdDY5OC40Nixcblx0NzM5Ljk5LFxuXHQ3ODMuOTksXG5cdDgzMC42MSxcblx0ODgwLjAwLFxuXHQ5MzIuMzMsXG5cdDk4Ny43Nyxcblx0MTA0Ni41MCxcblx0MTEwOC43Myxcblx0MTE3NC42Nixcblx0MTI0NC41MSxcblx0MTMxOC41MSxcblx0MTM5Ni45MSxcblx0MTQ3OS45OCxcblx0MTU2Ny45OCxcblx0MTY2MS4yMixcblx0MTc2MC4wMCxcblx0MTg2NC42Nixcblx0MTk3NS41Myxcbl07XG5cbmNvbnN0IFx0YzIgPSBmcmVxdWVuY2llc1swXSxcblx0XHRjczIgPSBmcmVxdWVuY2llc1sxXSxcblx0XHRkMiA9IGZyZXF1ZW5jaWVzWzJdLFxuXHRcdGRzMiA9IGZyZXF1ZW5jaWVzWzNdLFxuXHRcdFxuXHRcdGUyID0gZnJlcXVlbmNpZXNbNF0sXG5cdFx0ZjIgPSBmcmVxdWVuY2llc1s1XSxcblx0XHRmczIgPSBmcmVxdWVuY2llc1s2XSxcblx0XHRnMiA9IGZyZXF1ZW5jaWVzWzddLFxuXHRcdGdzMiA9IGZyZXF1ZW5jaWVzWzhdLFxuXHRcdGEyID0gZnJlcXVlbmNpZXNbOV0sXG5cdFx0YXMyID0gZnJlcXVlbmNpZXNbMTBdLFxuXHRcdFxuXHRcdGIyID0gZnJlcXVlbmNpZXNbMTFdLFxuXHRcdGMzID0gZnJlcXVlbmNpZXNbMTJdLFxuXHRcdGNzMyA9IGZyZXF1ZW5jaWVzWzEzXSxcblx0XHRkMyA9IGZyZXF1ZW5jaWVzWzE0XSxcblx0XHRkczMgPSBmcmVxdWVuY2llc1sxNV0sXG5cdFx0XG5cdFx0ZTMgPSBmcmVxdWVuY2llc1sxNl0sXG5cdFx0ZjMgPSBmcmVxdWVuY2llc1sxN10sXG5cdFx0ZnMzID0gZnJlcXVlbmNpZXNbMThdLFxuXHRcdGczID0gZnJlcXVlbmNpZXNbMTldLFxuXHRcdGdzMyA9IGZyZXF1ZW5jaWVzWzIwXSxcblx0XHRhMyA9IGZyZXF1ZW5jaWVzWzIxXSxcblx0XHRhczMgPSBmcmVxdWVuY2llc1syMl0sXG5cdFx0XG5cdFx0YjMgPSBmcmVxdWVuY2llc1syM10sXG5cdFx0YzQgPSBmcmVxdWVuY2llc1syNF0sXG5cdFx0Y3M0ID0gZnJlcXVlbmNpZXNbMjVdLFxuXHRcdGQ0ID0gZnJlcXVlbmNpZXNbMjZdLFxuXHRcdGRzNCA9IGZyZXF1ZW5jaWVzWzI3XSxcblx0XHRcblx0XHRlNCA9IGZyZXF1ZW5jaWVzWzI4XSxcblx0XHRmNCA9IGZyZXF1ZW5jaWVzWzI5XSxcblx0XHRmczQgPSBmcmVxdWVuY2llc1szMF0sXG5cdFx0ZzQgPSBmcmVxdWVuY2llc1szMV0sXG5cdFx0Z3M0ID0gZnJlcXVlbmNpZXNbMzJdLFxuXHRcdGE0ID0gZnJlcXVlbmNpZXNbMzNdLFxuXHRcdGFzNCA9IGZyZXF1ZW5jaWVzWzM0XSxcblx0XHRcblx0XHRiNCA9IGZyZXF1ZW5jaWVzWzM1XSxcblx0XHRjNSA9IGZyZXF1ZW5jaWVzWzM2XSxcblx0XHRjczUgPSBmcmVxdWVuY2llc1szN10sXG5cdFx0ZDUgPSBmcmVxdWVuY2llc1szOF0sXG5cdFx0ZHM1ID0gZnJlcXVlbmNpZXNbMzldLFxuXHRcdFxuXHRcdGU1ID0gZnJlcXVlbmNpZXNbNDBdLFxuXHRcdGY1ID0gZnJlcXVlbmNpZXNbNDFdLFxuXHRcdGZzNSA9IGZyZXF1ZW5jaWVzWzQyXSxcblx0XHRnNSA9IGZyZXF1ZW5jaWVzWzQzXSxcblx0XHRnczUgPSBmcmVxdWVuY2llc1s0NF0sXG5cdFx0YTUgPSBmcmVxdWVuY2llc1s0NV0sXG5cdFx0YXM1ID0gZnJlcXVlbmNpZXNbNDZdLFxuXHRcdFxuXHRcdGI1ID0gZnJlcXVlbmNpZXNbNDddLFxuXHRcdGM2ID0gZnJlcXVlbmNpZXNbNDhdLFxuXHRcdGNzNiA9IGZyZXF1ZW5jaWVzWzQ5XSxcblx0XHRkNiA9IGZyZXF1ZW5jaWVzWzUwXSxcblx0XHRkczYgPSBmcmVxdWVuY2llc1s1MV0sXG5cdFx0XG5cdFx0ZTYgPSBmcmVxdWVuY2llc1s1Ml0sXG5cdFx0ZjYgPSBmcmVxdWVuY2llc1s1M10sXG5cdFx0ZnM2ID0gZnJlcXVlbmNpZXNbNTRdLFxuXHRcdGc2ID0gZnJlcXVlbmNpZXNbNTVdLFxuXHRcdGdzNiA9IGZyZXF1ZW5jaWVzWzU2XSxcblx0XHRhNiA9IGZyZXF1ZW5jaWVzWzU3XSxcblx0XHRhczYgPSBmcmVxdWVuY2llc1s1OF0sXG5cdFx0XG5cdFx0YjYgPSBmcmVxdWVuY2llc1s1OV07XG5cbmNsYXNzIE5vdGUge1xuXHRjb25zdHJ1Y3RvcihmcmVxdWVuY3kpIHtcblx0XHR0aGlzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcblx0XHR0aGlzLm9zY2lsbGF0b3IgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLnR5cGUgPSAnc2luZSc7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuZnJlcXVlbmN5OyAvLyB2YWx1ZSBpbiBoZXJ0elxuXG5cdFx0dGhpcy5nYWluTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjA7XG5cblx0XHR0aGlzLm9zY2lsbGF0b3IuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXHRcdHRoaXMuY29udGV4dCA9IGF1ZGlvQ3R4O1xuXHRcdHRoaXMuZGVsYXkgPSB0aGlzLnJhbmRvbUluUmFuZ2UoMSwgMyk7XG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5wbGF5LmJpbmQodGhpcyk7XG5cblx0fVxuXG5cdHJhbmRvbUluUmFuZ2UoZnJvbSwgdG8pIHtcblx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICggdG8gLSBmcm9tICkgKyBmcm9tKTtcblx0XHRcdHIgPSByLzEwMDA7XG5cdFx0cmV0dXJuIHI7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdGxldCBnYWluVmFsdWUgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiAodGhpcy5mcmVxdWVuY3kgPiAxMDAwKSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuODtcblx0XHR9XG5cblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoZ2FpblZhbHVlLCAodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMC4wOCArIHRoaXMuZGVsYXkpKTtcblx0XHQgICAgICAgIFxuXHRcdHRoaXMub3NjaWxsYXRvci5zdGFydCh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuc3RvcCgpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHRsZXQgc3RvcFRpbWUgPSB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAyO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKDAuMDAxLCBzdG9wVGltZSk7XG4gICAgICAgIHRoaXMub3NjaWxsYXRvci5zdG9wKHN0b3BUaW1lICsgMC4wNSk7XG5cdH1cblxuXHR0d2Vha1N0YXJ0VGltZSgpIHtcblx0XHRzZXRUaW1lb3V0KHRoaXMucGxheSwgdGhpcy5kZWxheSk7XG5cdH1cbn1cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLnJvb3ROb3RlID0gdGhpcy5wYXJhbXMucm9vdE5vdGU7XG5cdFx0dGhpcy5zY2FsZU5hbWUgPSB0aGlzLnBhcmFtcy5zY2FsZU5hbWU7XG5cdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLnBhcmFtcy5udW1iZXJPZk9jdGF2ZXM7XG5cdFx0dGhpcy5zdGFydGluZ0luZGV4ID0gZnJlcXVlbmNpZXMuaW5kZXhPZih0aGlzLnJvb3ROb3RlKTtcblx0XHR0aGlzLnNjYWxlID0gW107XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHRsZXQgeCA9IHRoaXMuc3RhcnRpbmdJbmRleDtcblxuXHRcdGNvbnN0IHcgPSAyO1xuXHRcdGNvbnN0IGggPSAxO1xuXHRcdGNvbnN0IG8gPSAxMztcblxuXHRcdC8vIGNvbnN0IHN0ZXBBcnJheSA9IHtcblx0XHQvLyBcdCdtYWpvcic6IFsyLCAyLCAxLCAyLCAyLCAyLCAxXSxcblx0XHQvLyBcdCdtaW5vcic6IFtdXG5cdFx0Ly8gfVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtYWpvcicpIHtcblx0XHRcdC8vIFIsIFcsIFcsIEgsIFcsIFcsIFcsIEhcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3InKSB7IFxuXHRcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgVywgV1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtaW5vcl9oYXJtb25pYycpIHsgXG5cdFx0XHQvLyBSLCBXLCBILCBXLCBXLCBILCAxIDEvMiwgSFxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWFqb3InKSB7XG5cdFx0XHQvLyBXIFcgMS0xLzIgc3RlcCBXIDEtMS8yIHN0ZXBcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAxIDEvMiwgVywgVywgMSAxLzIsIFdcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnZmlmdGhzJykge1xuXHRcdFx0Ly8gUiwgN1xuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDQuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9tYWpvcicpIHtcblx0XHRcdC8vIFIsIDQsIDNcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyAzO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnY2hvcmRfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAzLCA0XG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDM7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDQ7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2Nob3JkX3N1cycpIHtcblx0XHRcdC8vIFIsIDUsIDJcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNTtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgMjtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNjYWxlO1xuXHR9XG59XG5cbmNsYXNzIFBsYXllckdyaWQge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLm51bWJlck9mQmVhdHMgPSBwYXJhbXMubnVtYmVyT2ZCZWF0cztcblx0XHR0aGlzLnNjYWxlID0gcGFyYW1zLnNjYWxlO1xuXHRcdHRoaXMubm90ZXNBcnJheSA9IFtdO1xuXHRcdHRoaXMudXBkYXRlSW5kZXhBcnJheSA9IHRoaXMudXBkYXRlSW5kZXhBcnJheS5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Z2VuZXJhdGVQbGF5ZXJBcnJheSgpIHtcblx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdGxldCBjb2x1bW4gPSAwO1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPD0gdGhpcy5udW1iZXJPZkJlYXRzOyB4KyspIHtcblx0XHRcdC8vY29sdW1ucyAoYWxsIHRoZSBzYW1lIGluZGV4IG51bWJlcilcblx0XHRcdHRoaXMubm90ZXNBcnJheS5wdXNoKFtdKTtcblxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLnNjYWxlLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdC8vcm93cyAoaW5jcmVhc2UgaW5kZXggbnVtYmVyIGJ5IG9uZSlcblxuXHRcdFx0XHR2YXIgY29sdW1uU3RyaW5nO1xuXHRcdFx0XHR2YXIgaW5kZXhTdHJpbmc7XG5cblx0XHRcdFx0aWYgKGluZGV4ID09IHRoaXMuc2NhbGUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNvbHVtbiA8IDEwKSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gYDAke2NvbHVtbn1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGNvbHVtbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpbmRleCA8IDEwKSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBgMCR7aW5kZXh9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGluZGV4O1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHRsZXQgYXJyYXlPYmplY3QgPSB7fTtcblx0XHRcdFx0YXJyYXlPYmplY3QuaWQgPSBjb2x1bW5TdHJpbmcrJ18nK2luZGV4U3RyaW5nO1xuXHRcdFx0XHRhcnJheU9iamVjdC5mcmVxdWVuY3kgPSB0aGlzLnNjYWxlW2luZGV4XTtcblx0XHRcdFx0YXJyYXlPYmplY3QudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZChhcnJheU9iamVjdCk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXk7XG5cdFx0XHRcdGFycmF5T2JqZWN0LnggPSBjb2x1bW47XG5cdFx0XHRcdGFycmF5T2JqZWN0LnkgPSBpbmRleDtcblxuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaWQgPSBhcnJheU9iamVjdC5pZDtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlubmVySFRNTCA9IGFycmF5T2JqZWN0LmZyZXF1ZW5jeTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fYnV0dG9uJyk7XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXHR9XG5cblx0dXBkYXRlSW5kZXhBcnJheShpbmZvLCB2YWwpIHtcblx0XHRsZXQgb2JqID0ge307XG5cdFx0XHRvYmouY2FsbCA9ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jztcblx0XHRcdG9iai5pZCA9IGluZm8uaWQ7XG5cdFx0XHRvYmoudmFsID0gdmFsO1xuXG5cdFx0Y29uc3Qgb2JqVG9TZW5kID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcblxuXHRcdHNlcnZlci5zZW5kKG9ialRvU2VuZCk7XG5cdH1cblxuXHR0b2dnbGUoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGxldCBub3RlQnV0dG9uID0gdGhpcy5ub3RlQnV0dG9uO1xuXHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHQvL3RoaXMudXBkYXRlSW5kZXhBcnJheSh0aGlzLCAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdC8vdGhpcy51cGRhdGVJbmRleEFycmF5KHRoaXMsIDEpO1xuXHRcdH1cblx0fVxufVxuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0XHRyb290Tm90ZTogYzIsXG5cdFx0XHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHRcdGJwbTogMTAwLFxuXHRcdFx0ZHVyYXRpb246IDQsXG5cdFx0XHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHR9O1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR9XG5cblx0XHR0aGlzLnBhcmFtcy5iZWF0cyA9IHRoaXMucGFyYW1zLnNpZ25hdHVyZVswXTtcblx0XHR0aGlzLnBhcmFtcy5tZWFzdXJlID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzFdO1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5kdXJhdGlvbip0aGlzLnBhcmFtcy5iZWF0cztcblx0XHR0aGlzLnBhcmFtcy50aW1lID0gdGhpcy5wYXJhbXMuYnBtICogNDtcblxuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLmdlbmVyYXRlQXBwID0gdGhpcy5nZW5lcmF0ZUFwcC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuc2V0UGxheUludGVydmFsID0gdGhpcy5zZXRQbGF5SW50ZXJ2YWwuYmluZCh0aGlzKTtcblx0XHR0aGlzLnBsYXlDb2x1bW4gPSB0aGlzLnBsYXlDb2x1bW4uYmluZCh0aGlzKTtcblx0XHR0aGlzLnJlZnJlc2hBcHAgPSB0aGlzLnJlZnJlc2hBcHA7XG5cdFx0dGhpcy5yZW1vdmVTdHlsZXMgPSB0aGlzLnJlbW92ZVN0eWxlcy5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJyk7XG5cdH1cblxuXHRnZW5lcmF0ZUFwcCgpIHtcblxuXHRcdGZvciAodGhpcy54ID0gMDsgdGhpcy54IDwgdGhpcy5ub3RlQXJyYXkubGVuZ3RoOyB0aGlzLngrKykge1xuXHRcdFx0dGhpcy5jb2x1bW4gPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhdO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnBsYXllckNvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHR0aGlzLnBsYXllckNvbHVtbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2NvbHVtbicpO1xuXG5cdFx0XHR0aGlzLmFwcENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnBsYXllckNvbHVtbik7XG5cblx0XHRcdGZvciAodGhpcy55ID0gMDsgdGhpcy55IDwgdGhpcy5jb2x1bW4ubGVuZ3RoOyB0aGlzLnkrKykge1xuXHRcdFx0XHR0aGlzLm5vdGVCdXR0b24gPSB0aGlzLmNvbHVtblt0aGlzLnldLm5vdGVCdXR0b247XG5cdFx0XHRcdHRoaXMubm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY29sdW1uW3RoaXMueV0udG9nZ2xlKTtcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQodGhpcy5ub3RlQnV0dG9uKTtcblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0UGxheUludGVydmFsKCk7XG5cdH1cblxuXHRyZWZyZXNoQXBwKCkge1xuXHRcdHRoaXMuYXBwQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG5cdFx0dGhpcy5nZW5lcmF0ZUFwcCgpO1xuXHR9XG5cblx0c2V0UGxheUludGVydmFsKCkge1xuXHRcdHRoaXMueENvdW50ID0gMDtcblxuXHRcdGlmICh0aGlzLnBsYXllckludGVydmFsKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMucGxheWVySW50ZXJ2YWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBsYXllckludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucGxheUNvbHVtbiwgdGhpcy5wYXJhbXMudGltZSk7XG5cdFx0fVxuXHR9XG5cblx0cGxheUNvbHVtbigpIHtcblxuXHRcdHRoaXMuY29sdW1ucyA9IHRoaXMubm90ZUFycmF5W3RoaXMueENvdW50XTtcblx0XG5cdFx0Zm9yICh0aGlzLnlDb3VudCA9IDA7IHRoaXMueUNvdW50IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgdGhpcy55Q291bnQrKykge1xuXHRcdFx0dGhpcy5ub3RlQnV0dG9uID0gdGhpcy5jb2x1bW5zW3RoaXMueUNvdW50XS5ub3RlQnV0dG9uO1xuXHRcdFx0dGhpcy5mcmVxdWVuY3kgPSB0aGlzLmNvbHVtbnNbdGhpcy55Q291bnRdLmZyZXF1ZW5jeTtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdHRoaXMubm90ZSA9IG5ldyBOb3RlKHRoaXMuZnJlcXVlbmN5KTtcblx0XHRcdFx0dGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0dGhpcy5ub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0c2V0VGltZW91dCh0aGlzLnJlbW92ZVN0eWxlcywgdGhpcy5wYXJhbXMudGltZSk7XG5cdFx0XHR9IFxuXHRcdH1cblxuXHRcdHRoaXMueENvdW50Kys7XG5cblx0XHRpZiAodGhpcy54Q291bnQgPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cykge1xuXHRcdFx0dGhpcy54Q291bnQgPSAwO1xuXHRcdH1cblx0fVxuXG5cdHJlbW92ZVN0eWxlcygpIHtcblx0XHR0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xuXHR9XG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmdlbmVyYXRlQXBwKCk7XG5cdH1cbn1cblxuY2xhc3MgTXVsdGlwbGF5ZXJBcHAgZXh0ZW5kcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHRzdXBlcihwYXJhbXMpO1xuXHRcdHRoaXMuY29ubmVjdFRvU2VydmVyID0gdGhpcy5jb25uZWN0VG9TZXJ2ZXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLmxpc3RlbkZvclVwZGF0ZXMgPSB0aGlzLmxpc3RlbkZvclVwZGF0ZXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLnVwZGF0ZVBsYXllciA9IHRoaXMudXBkYXRlUGxheWVyLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5nZW5lcmF0ZUFwcCA9IHRoaXMuc3VwZXIuZ2VuZXJhdGVBcHA7XG5cdH1cblxuXHRjb25uZWN0VG9TZXJ2ZXIoKSB7XG5cdFx0Ly8gZGVsYXkgaW5pdGlhbCBjb25zdHJ1Y3Rpb24gb2YgdGhlIGFwcCB1bnRpbCBhZnRlciBpbml0aWFsIHBhcmFtZXRlcnMgaGF2ZSBiZWVuIHNldFxuXHRcdFxuXHRcdC8vIGNyZWF0ZSBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyXG5cdCAgICB0aGlzLnNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHRcdHJldHVybiAoXG5cdFx0ICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcblx0XHQgICAgdGhpcy5zZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0XHQgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0XHQgICAgXHR0aGlzLnNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHQgICAgXHRcdC8vIHBhcnNlIGluaXRpYWwgbWVzc2FnZVxuXHRcdCAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdFx0ICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdFx0ICAgIFx0XHRpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnbnVsbCcpIHtcblx0XHQgICAgXHRcdFx0cmV0dXJuO1xuXHRcdCAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHRcdCAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcblx0XHQgICAgXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbml0TWVzc2FnZS5hcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdCAgICBcdFx0XHRcdHRoaXMudXBkYXRlUGxheWVyKGluaXRNZXNzYWdlLmFycmF5W2ldKTtcblx0XHQgICAgXHRcdFx0fVxuXHRcdCAgICBcdFx0fVxuXG5cdFx0ICAgIFx0XHQvLyBzdGFydCBsb29wIHRvIHBsYXkgbm90ZXNcblx0XHQgICAgXHRcdHRoaXMuc3VwZXIuc2V0UGxheUludGVydmFsKCk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9KS50aGVuKHRoaXMubGlzdGVuRm9yVXBkYXRlcyk7XG5cdH1cblxuXHRsaXN0ZW5Gb3JVcGRhdGVzKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQvLyBzZXQgZnVuY3Rpb25zIGZvciBob3cgdG8gcmVhY3QgdG8gYWxsIG1lc3NhZ2VzIGFmdGVyXG5cdFx0XHR0aGlzLnNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdFx0XHRcdHRoaXMudXBkYXRlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gdXBkYXRlLmNhbGwgZGVzY3JpYmVzIHRoZSB0eXBlIG9mIGNoYW5nZSB0byBtYWtlXG5cdFx0XHRcdGlmICh0aGlzLnVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuXHRcdFx0XHRcdHRoaXMuYnV0dG9uLmlkID0gdGhpcy51cGRhdGUuaWQ7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVQbGF5ZXIoKTtcdFxuXHRcdFx0XHR9IGlmICh0aGlzLnVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coKTtcblx0XHRcdFx0fVx0XG5cdFx0XHR9XG5cdFx0KS50aGVuKFxuXHRcdFx0dGhpcy5zZXJ2ZXIuY2F0Y2ggPSBmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dXBkYXRlUGxheWVyKCkge1xuXHRcdC8vIHRhcmdldCBzcGVjaWZpY2FsbHkgdGhlIGJ1dHRvbiB0aGF0IGlzIGNoYW5naW5nXG5cdFx0dGhpcy5idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnVwZGF0ZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdCh0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIHRoaXMudXBkYXRlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHR0aGlzLmJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9IGVsc2UgaWYgKCF0aGlzLmJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIHRoaXMudXBkYXRlLnZhbCA9PSAxKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgdHJ1ZSBhbmQgYnV0dG9uIGlzIGZhbHNlLCBzZXQgYnV0dG9uIHRvIHRydWUgYnkgYWRkaW5nICdhY3RpdmUnIHRvIGNsYXNzbGlzdFxuXHRcdFx0dGhpcy5idXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbi8vIGNsYXNzIFNpbmdsZVBsYXllckFwcCBleHRlbmRzIEFwcCB7XG4vLyBcdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuLy8gXHRcdHN1cGVyKHBhcmFtcyk7XG4vLyBcdFx0Ly8gdGhpcy5nZW5lcmF0ZUFwcCA9IHRoaXMucGFyYW1zLmdlbmVyYXRlQXBwLmJpbmQodGhpcyk7XG5cdFx0XG4vLyBcdFx0dGhpcy5vcHRpb25zID0ge307XG5cbi8vIFx0XHR0aGlzLnNpbmdsZVBsYXllckNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllck9wdGlvbnMnKTtcbi8vIFx0XHR0aGlzLnJlYnVpbGRBcHAgPSB0aGlzLnJlYnVpbGRBcHAuYmluZCh0aGlzKTtcbi8vIFx0XHQvLyB0aGlzLnNpbmdsZVBsYXllckNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuLy8gXHRcdHRoaXMubWVudVN1Ym1pdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51U3VibWl0Jyk7XG4vLyBcdFx0dGhpcy5tZW51U3VibWl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5yZWJ1aWxkQXBwKTtcblxuXG4vLyBcdFx0dGhpcy5vcHRpb25zLnNjYWxlU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NhbGVTZWxlY3RvcicpO1xuLy8gXHRcdHRoaXMub3B0aW9ucy5yb290U2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdFNlbGVjdG9yJyk7XG4vLyBcdFx0dGhpcy5vcHRpb25zLm9jdGF2ZXNTZWxlY3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvY3RhdmVzTnVtU2VsZWN0b3InKTtcblx0XHRcbi8vIFx0fVxuXG4vLyBcdC8vYWN0aXZhdGUgc2luZ2xlIHBsYXllciBjb250cm9sc1xuLy8gXHRyZWJ1aWxkQXBwKGUpIHtcbi8vIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG4vLyBcdFx0Y29uc29sZS5sb2coJ3JlYnVpbGQnKTtcbi8vIFx0XHRjb25zb2xlLmRpcih0aGlzLm9wdGlvbnMpO1xuLy8gXHR9XG5cbi8vIH1cblxuLy8gdmFyIGxvY2FsQXBwID0gbmV3IFNpbmdsZVBsYXllckFwcDtcbi8vIFx0bG9jYWxBcHAuZ2VuZXJhdGVBcHAoKTtcblxuLy8gZnVuY3Rpb24gbXVsdGlQbGF5ZXJJbml0KCkge1xuXG4vLyBcdGZ1bmN0aW9uIGNvbm5lY3RUb1NlcnZlcigpIHtcblxuLy8gXHRcdC8vIGRlbGF5IGluaXRpYWwgY29uc3RydWN0aW9uIG9mIHRoZSBhcHAgdW50aWwgYWZ0ZXIgaW5pdGlhbCBwYXJhbWV0ZXJzIGhhdmUgYmVlbiBzZXRcbi8vIFx0ICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuLy8gXHQgICAgXHQvLyBjcmVhdGUgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlclxuLy8gXHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuLy8gXHQgICAgICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcbi8vIFx0ICAgICAgICBzZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cbi8vIFx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuLy8gXHQgICAgICAgIFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuLy8gXHQgICAgICAgIFx0XHQvLyBwYXJzZSBpbml0aWFsIG1lc3NhZ2Vcbi8vIFx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG4vLyBcdCAgICAgICAgXHRcdC8vIGNoZWNrIHdoZXRoZXIgam9pbmluZyBleGlzdGluZyBnYW1lIG9yIHN0YXJ0aW5nIG5ldyBvbmVcbi8vIFx0ICAgICAgICBcdFx0aWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ251bGwnKSB7XG4vLyBcdCAgICAgICAgXHRcdFx0cmV0dXJuO1xuLy8gXHQgICAgICAgIFx0XHR9IGVsc2UgaWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ2luaXQnKSB7XG4vLyBcdCAgICAgICAgXHRcdFx0Ly8gaWYgam9pbmluZyBuZXcgZXhpc3RpbmcsIHVwZGF0ZSBwbGF5ZXIgdG8gcmVmbGVjdCBleGlzdGluZyBjb25kaXRpb25zXG4vLyBcdCAgICAgICAgXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbml0TWVzc2FnZS5hcnJheS5sZW5ndGg7IGkrKykge1xuLy8gXHQgICAgICAgIFx0XHRcdFx0dXBkYXRlUGxheWVyKGluaXRNZXNzYWdlLmFycmF5W2ldKTtcbi8vIFx0ICAgICAgICBcdFx0XHR9XG4vLyBcdCAgICAgICAgXHRcdH1cblxuLy8gXHQgICAgICAgIFx0XHQvLyBzdGFydCBsb29wIHRvIHBsYXkgbm90ZXNcbi8vIFx0ICAgICAgICBcdFx0cGxheU5vdGVzKCk7XG5cbi8vIFx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG4vLyBcdCAgICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcbi8vIFx0ICAgICAgICBcdH1cbi8vIFx0ICAgICAgICB9XG5cbi8vIFx0ICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuLy8gXHQgICAgICAgICAgICByZWplY3QoZXJyKTtcbi8vIFx0ICAgICAgICB9XG4vLyBcdCAgICB9KVxuLy8gXHR9XG5cbi8vIFx0Ly8gb25jZSBwcmUtaW5pdCBoYXMgYmVlbiBjb21wbGV0ZWRcbi8vIFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblxuLy8gXHRcdC8vIHNldCBmdW5jdGlvbnMgZm9yIGhvdyB0byByZWFjdCB0byBhbGwgbWVzc2FnZXMgYWZ0ZXJcbi8vIFx0XHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG4vLyBcdFx0XHRsZXQgdXBkYXRlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXHRcdFx0XG4vLyBcdFx0XHQvLyB1cGRhdGUuY2FsbCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgY2hhbmdlIHRvIG1ha2Vcbi8vIFx0XHRcdGlmICh1cGRhdGUuY2FsbCA9PSAndXBkYXRlX3RvZ2dsZV9hcnJheScpIHtcbi8vIFx0XHRcdFx0dXBkYXRlUGxheWVyKHVwZGF0ZSk7XHRcbi8vIFx0XHRcdH0gaWYgKHVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKHVwZGF0ZSk7XG4vLyBcdFx0XHR9XHRcbi8vIFx0XHR9XG4vLyBcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuLy8gXHRcdGNvbnNvbGUubG9nKGVycik7XG4vLyBcdH0pO1xuXG4vLyBcdC8vIHVwZGF0ZSBoYW5kbGVyXG4vLyBcdGZ1bmN0aW9uIHVwZGF0ZVBsYXllcihtZXNzYWdlKSB7XG5cbi8vIFx0XHQvLyB0YXJnZXQgc3BlY2lmaWNhbGx5IHRoZSBidXR0b24gdGhhdCBpcyBjaGFuZ2luZ1xuLy8gXHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtZXNzYWdlLmlkKTtcblxuLy8gXHRcdC8vIGNvbXBhcmUgY2xhc3NMaXN0IHZhbHMgdG8gdGhlIG5ldyB2YWxzIFxuLy8gXHRcdGlmIFx0KGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDApIHtcbi8vIFx0XHRcdC8vIGlmIHZhbCBpcyBmYWxzZSBhbmQgYnV0dG9uIGlzIHRydWUsIHNldCBidXR0b24gdG8gZmFsc2UgYnkgcmVtb3ZpbmcgJ2FjdGl2ZScgZnJvbSBjbGFzc2xpc3Rcbi8vIFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vIFx0XHR9IGVsc2UgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAxKSB7XG4vLyBcdFx0XHQvLyBpZiB2YWwgaXMgdHJ1ZSBhbmQgYnV0dG9uIGlzIGZhbHNlLCBzZXQgYnV0dG9uIHRvIHRydWUgYnkgYWRkaW5nICdhY3RpdmUnIHRvIGNsYXNzbGlzdFxuLy8gXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG4vLyB2YXIgQXBwID0gKGZ1bmN0aW9uKHBhcmFtcykge1xuLy8gXHRsZXQgc2hhcmVkID0ge307XG5cbi8vIFx0Y29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcbi8vIFx0XHRyb290Tm90ZTogYzIsXG4vLyBcdFx0c2NhbGVOYW1lOiAncGVudGF0b25pY19taW5vcicsXG4vLyBcdFx0bnVtYmVyT2ZPY3RhdmVzOiAyLFxuLy8gXHRcdGJwbTogMTAwLFxuLy8gXHRcdGR1cmF0aW9uOiAyLFxuLy8gXHRcdHNpZ25hdHVyZTogWzQsIDRdLFxuLy8gXHRcdG51bWJlck9mT2N0YXZlczogMixcbi8vIFx0fTtcblxuLy8gXHRpZiAoIXBhcmFtcykge1xuLy8gXHRcdHBhcmFtcyA9IGRlZmF1bHRQYXJhbXM7XG4vLyBcdH0gXG5cbi8vIFx0cGFyYW1zLmJlYXRzID0gcGFyYW1zLnNpZ25hdHVyZVswXTtcbi8vIFx0cGFyYW1zLm1lYXN1cmUgPSBwYXJhbXMuc2lnbmF0dXJlWzFdO1xuLy8gXHRwYXJhbXMubnVtYmVyT2ZCZWF0cyA9IHBhcmFtcy5kdXJhdGlvbipwYXJhbXMuYmVhdHM7XG5cbi8vIFx0Y29uc3Qgc2NhbGUgPSBuZXcgU2NhbGUocGFyYW1zKTtcblxuLy8gXHRwYXJhbXMuc2NhbGUgPSBzY2FsZS5nZW5lcmF0ZSgpO1xuXG4vLyBcdGxldCBcdHBsYXllciA9IG5ldyBQbGF5ZXIocGFyYW1zKTtcbi8vIFx0XHRcdHBsYXllckFycmF5cyA9IHBsYXllci5nZW5lcmF0ZVBsYXllckFycmF5KCk7XG4vLyBcdGNvbnN0IFx0bm90ZUFycmF5ID0gcGxheWVyQXJyYXlzLm5vdGVzQXJyYXksXG4vLyBcdFx0XHRpZEFycmF5ID0gcGxheWVyQXJyYXlzLmlkQXJyYXk7XG5cbi8vIFx0ZnVuY3Rpb24gZ2VuZXJhdGVQbGF5ZXIoKSB7XG4vLyBcdFx0dmFyIGFwcFBsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBQbGF5ZXInKTtcblxuLy8gXHRcdGZvciAodmFyIHggPSAwOyB4IDwgbm90ZUFycmF5Lmxlbmd0aDsgeCsrKSB7XG4vLyBcdFx0XHR2YXIgY29sdW1uID0gbm90ZUFycmF5W3hdO1xuXHRcdFx0XG4vLyBcdFx0XHR2YXIgcGxheWVyQ29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4vLyBcdFx0XHRcdHBsYXllckNvbHVtbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2NvbHVtbicpO1xuXG4vLyBcdFx0XHRhcHBQbGF5ZXIuYXBwZW5kQ2hpbGQocGxheWVyQ29sdW1uKTtcblxuLy8gXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBjb2x1bW4ubGVuZ3RoOyB5KyspIHtcbi8vIFx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBjb2x1bW5beV0ubm90ZUJ1dHRvbjtcbi8vIFx0XHRcdFx0XHRub3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29sdW1uW3ldLnRvZ2dsZSk7XG5cbi8vIFx0XHRcdFx0cGxheWVyQ29sdW1uLmFwcGVuZENoaWxkKG5vdGVCdXR0b24pO1xuLy8gXHRcdFx0fVxuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0bGV0IGxvY2FsQXBwID0gbmV3IEFwcCgpO1xuXHRcdGxvY2FsQXBwLmluaXQoKTtcblxuXHRcdGZ1bmN0aW9uIHBsYXlOb3RlcygpIHtcblxuXHRcdFx0bGV0IHggPSAwO1xuXG5cdFx0XHR2YXIgcGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwocGxheUNvbHVtbiwgdGltZSk7XG5cblx0XHRcdGZ1bmN0aW9uIHBsYXlDb2x1bW4oKSB7XG5cdFx0XHRcdGxldCBjb2x1bW5zID0gbm90ZUFycmF5W3hdO1xuXG5cdFx0XHRcdFxuXHRcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbnMubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtbnNbeV0ubm90ZUJ1dHRvbixcblx0XHRcdFx0XHRcdGZyZXF1ZW5jeSA9IGNvbHVtbnNbeV0uZnJlcXVlbmN5O1xuXG5cdFx0XHRcdFx0aWYgKG5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24obm90ZUJ1dHRvbikge1xuXHRcdFx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXlpbmcnKTtcblx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cblxuXHRcdFx0XHRcdFx0dmFyIG5vdGUgPSBuZXcgTm90ZShmcmVxdWVuY3kpO1xuXHRcdFx0XHRcdFx0XHRub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR4Kys7XG5cblx0XHRcdFx0aWYgKHggPT0gcGFyYW1zLm51bWJlck9mQmVhdHMpIHtcblx0XHRcdFx0XHR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cbn1cblxuaW5pdCgpO1xuXG5cbi8vIFx0ZnVuY3Rpb24gbXVsdGlQbGF5ZXJJbml0KCkge1xuXG4vLyBcdFx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG4vLyBcdFx0XHQvLyBkZWxheSBpbml0aWFsIGNvbnN0cnVjdGlvbiBvZiB0aGUgYXBwIHVudGlsIGFmdGVyIGluaXRpYWwgcGFyYW1ldGVycyBoYXZlIGJlZW4gc2V0XG4vLyBcdFx0ICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuLy8gXHRcdCAgICBcdC8vIGNyZWF0ZSBsaXZlIGNvbm5lY3Rpb24gdG8gc2VydmVyXG4vLyBcdFx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cbi8vIFx0XHQgICAgICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcbi8vIFx0XHQgICAgICAgIHNlcnZlci5vbm9wZW4gPSBmdW5jdGlvbigpIHtcblxuLy8gXHRcdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcbi8vIFx0XHQgICAgICAgIFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuLy8gXHRcdCAgICAgICAgXHRcdC8vIHBhcnNlIGluaXRpYWwgbWVzc2FnZVxuLy8gXHRcdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuLy8gXHRcdCAgICAgICAgXHRcdC8vIGNoZWNrIHdoZXRoZXIgam9pbmluZyBleGlzdGluZyBnYW1lIG9yIHN0YXJ0aW5nIG5ldyBvbmVcbi8vIFx0XHQgICAgICAgIFx0XHRpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnbnVsbCcpIHtcbi8vIFx0XHQgICAgICAgIFx0XHRcdHJldHVybjtcbi8vIFx0XHQgICAgICAgIFx0XHR9IGVsc2UgaWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ2luaXQnKSB7XG4vLyBcdFx0ICAgICAgICBcdFx0XHQvLyBpZiBqb2luaW5nIG5ldyBleGlzdGluZywgdXBkYXRlIHBsYXllciB0byByZWZsZWN0IGV4aXN0aW5nIGNvbmRpdGlvbnNcbi8vIFx0XHQgICAgICAgIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdE1lc3NhZ2UuYXJyYXkubGVuZ3RoOyBpKyspIHtcbi8vIFx0XHQgICAgICAgIFx0XHRcdFx0dXBkYXRlUGxheWVyKGluaXRNZXNzYWdlLmFycmF5W2ldKTtcbi8vIFx0XHQgICAgICAgIFx0XHRcdH1cbi8vIFx0XHQgICAgICAgIFx0XHR9XG5cbi8vIFx0XHQgICAgICAgIFx0XHQvLyBzdGFydCBsb29wIHRvIHBsYXkgbm90ZXNcbi8vIFx0XHQgICAgICAgIFx0XHRwbGF5Tm90ZXMoKTtcblxuLy8gXHRcdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuLy8gXHRcdCAgICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcbi8vIFx0XHQgICAgICAgIFx0fVxuLy8gXHRcdCAgICAgICAgfVxuXG4vLyBcdFx0ICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuLy8gXHRcdCAgICAgICAgICAgIHJlamVjdChlcnIpO1xuLy8gXHRcdCAgICAgICAgfVxuLy8gXHRcdCAgICB9KVxuLy8gXHRcdH1cblxuLy8gXHRcdC8vIG9uY2UgcHJlLWluaXQgaGFzIGJlZW4gY29tcGxldGVkXG4vLyBcdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblxuLy8gXHRcdFx0Ly8gc2V0IGZ1bmN0aW9ucyBmb3IgaG93IHRvIHJlYWN0IHRvIGFsbCBtZXNzYWdlcyBhZnRlclxuLy8gXHRcdFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuLy8gXHRcdFx0XHRsZXQgdXBkYXRlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXHRcdFx0XHRcbi8vIFx0XHRcdFx0Ly8gdXBkYXRlLmNhbGwgZGVzY3JpYmVzIHRoZSB0eXBlIG9mIGNoYW5nZSB0byBtYWtlXG4vLyBcdFx0XHRcdGlmICh1cGRhdGUuY2FsbCA9PSAndXBkYXRlX3RvZ2dsZV9hcnJheScpIHtcbi8vIFx0XHRcdFx0XHR1cGRhdGVQbGF5ZXIodXBkYXRlKTtcdFxuLy8gXHRcdFx0XHR9IGlmICh1cGRhdGUuY2FsbCA9PSAnbmV3X3BhcnRuZXJfc2V0Jykge1xuLy8gXHRcdFx0XHRcdGNvbnNvbGUubG9nKHVwZGF0ZSk7XG4vLyBcdFx0XHRcdH1cdFxuLy8gXHRcdFx0fVxuLy8gXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuLy8gXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcbi8vIFx0XHR9KTtcblxuLy8gXHRcdC8vIHVwZGF0ZSBoYW5kbGVyXG4vLyBcdFx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKG1lc3NhZ2UpIHtcblxuLy8gXHRcdFx0Ly8gdGFyZ2V0IHNwZWNpZmljYWxseSB0aGUgYnV0dG9uIHRoYXQgaXMgY2hhbmdpbmdcbi8vIFx0XHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtZXNzYWdlLmlkKTtcblxuLy8gXHRcdFx0Ly8gY29tcGFyZSBjbGFzc0xpc3QgdmFscyB0byB0aGUgbmV3IHZhbHMgXG4vLyBcdFx0XHRpZiBcdChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAwKSB7XG4vLyBcdFx0XHRcdC8vIGlmIHZhbCBpcyBmYWxzZSBhbmQgYnV0dG9uIGlzIHRydWUsIHNldCBidXR0b24gdG8gZmFsc2UgYnkgcmVtb3ZpbmcgJ2FjdGl2ZScgZnJvbSBjbGFzc2xpc3Rcbi8vIFx0XHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuLy8gXHRcdFx0fSBlbHNlIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMSkge1xuLy8gXHRcdFx0XHQvLyBpZiB2YWwgaXMgdHJ1ZSBhbmQgYnV0dG9uIGlzIGZhbHNlLCBzZXQgYnV0dG9uIHRvIHRydWUgYnkgYWRkaW5nICdhY3RpdmUnIHRvIGNsYXNzbGlzdFxuLy8gXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0fVxuLy8gXHR9XG5cdFxuXG4vLyBcdGZ1bmN0aW9uIGluaXQoKSB7XG4vLyBcdFx0Ly8gYnVpbGQgYW4gZW1wdHkgcGxheWVyXG4vLyBcdFx0Z2VuZXJhdGVQbGF5ZXIoKTtcblxuLy8gXHRcdC8vIHBvcHVsYXRlIGl0XG4vLyBcdFx0bXVsdGlQbGF5ZXJJbml0KCk7XG4vLyBcdH1cblxuLy8gXHRzaGFyZWQuaW5pdCA9IGluaXQ7XG4vLyBcdHJldHVybiBzaGFyZWQ7XG4vLyB9KCkpO1xuXG4vLyBBcHAuaW5pdCgpOyJdfQ==
