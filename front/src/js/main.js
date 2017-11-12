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