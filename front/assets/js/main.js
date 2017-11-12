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
		this.rootNote = params.rootNote;
		this.scaleName = params.scaleName;
		this.numberOfOctaves = params.numberOfOctaves;
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
			this.updateIndexArray(this, 0);
		} else {
			noteButton.classList.add('active');
			this.updateIndexArray(this, 1);
		}
	}
}

// class App {
// 	constructor(params) {
// 		this.defaultParams = {
// 			rootNote: c2,
// 			scaleName: 'pentatonic_minor',
// 			numberOfOctaves: 2,
// 			bpm: 100,
// 			duration: 4,
// 			signature: [4, 4],
// 			numberOfOctaves: 2,
// 			time: 500,
// 		};

// 		if (!params) {
// 			this.params = this.defaultParams;
// 		} else {
// 			this.params = params;
// 		}

// 		this.params.beats = params.signature[0];
// 		this.params.measure = params.signature[1];
// 		this.params.numberOfBeats = params.duration*params.beats;

// 		this.scale = new Scale(params);
// 		this.params.scale = this.scale.generate();

// 		this.player = new PlayerGrid(params);

// 		this.playerArrays = this.player.generatePlayerArray();
// 		this.noteArray = this.playerArrays.notesArray;

// 		this.generatePlayer = generatePlayer;
// 		this.setPlayInterval = setPlayInterval;
// 	}

// 	generateApp() {
// 		var appContainer = document.getElementById('appPlayer');

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

// 	setPlayInterval() {
// 		this.x = 0;

// 		if (this.playerInterval) {
// 			clearInterval(this.playerInterval);
// 		} else {
// 			this.playerInterval = window.setInterval(this.playColumn, this.time);
// 		}
// 	}

// 	playColumn() {
// 		let columns = this.noteArray[x];
	
// 		for (var y = 0; y < columns.length; y++) {
// 			let noteButton = columns[y].noteButton,
// 				frequency = columns[y].frequency;

// 			if (noteButton.classList.contains('active')) {
				
// 				noteButton.classList.add('playing');
// 				var note = new Note(frequency);
// 				note.tweakStartTime();

// 				setTimeout(function() {
// 					noteButton.classList.remove('playing');
// 				}, 500);
// 			} 
// 		}

// 		this.x++;

// 		if (this.x == this.params.numberOfBeats) {
// 			this.x = 0;
// 		}
// 	}
// }

// class MultiplayerApp extends App {
// 	constructor(params) {
// 		super(params);

// 	}


// }

function multiPlayerInit() {

	function connectToServer() {

		// delay initial construction of the app until after initial parameters have been set
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
	        			return;
	        		} else if (initMessage.call == 'init') {
	        			// if joining new existing, update player to reflect existing conditions
	        			for (var i = 0; i < initMessage.array.length; i++) {
	        				updatePlayer(initMessage.array[i]);
	        			}
	        		}

	        		// start loop to play notes
	        		playNotes();

	        		// finish pre-init
	        		resolve(server);
	        	}
	        }

	        server.onerror = function(err) {
	            reject(err);
	        }
	    })
	}

	// once pre-init has been completed
	connectToServer().then(function(server) {

		// set functions for how to react to all messages after
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
}

var App = (function(params) {
	let shared = {};

	const defaultParams = {
		rootNote: c2,
		scaleName: 'pentatonic_minor',
		numberOfOctaves: 2,
		bpm: 100,
		duration: 4,
		signature: [4, 4],
		numberOfOctaves: 2,
	};

	if (!params) {
		params = defaultParams;
	} 

	params.beats = params.signature[0];
	params.measure = params.signature[1];
	params.numberOfBeats = params.duration*params.beats;

	const scale = new Scale(params);

	params.scale = scale.generate();

	let 	player = new PlayerGrid(params);
			playerArrays = player.generatePlayerArray();
	const 	noteArray = playerArrays.notesArray,
			idArray = playerArrays.idArray;

	function generatePlayer() {
		var appPlayer = document.getElementById('appPlayer');

		for (var x = 0; x < noteArray.length; x++) {
			var column = noteArray[x];
			
			var playerColumn = document.createElement('div');
				playerColumn.classList.add('player__column');

			appPlayer.appendChild(playerColumn);

			for (var y = 0; y < column.length; y++) {
				let noteButton = column[y].noteButton;
					noteButton.addEventListener('click', column[y].toggle);

				playerColumn.appendChild(noteButton);
			}

			
		}
	}

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
					var note = new Note(frequency);
					note.tweakStartTime();

					setTimeout(function() {
						noteButton.classList.remove('playing');
					}, 500);
				} 
			}

			x++;

			if (x == params.numberOfBeats) {
				x = 0;
			}
		}
	}

	function multiPlayerInit() {

		function connectToServer() {

			// delay initial construction of the app until after initial parameters have been set
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
		        			return;
		        		} else if (initMessage.call == 'init') {
		        			// if joining new existing, update player to reflect existing conditions
		        			for (var i = 0; i < initMessage.array.length; i++) {
		        				updatePlayer(initMessage.array[i]);
		        			}
		        		}

		        		// start loop to play notes
		        		playNotes();

		        		// finish pre-init
		        		resolve(server);
		        	}
		        }

		        server.onerror = function(err) {
		            reject(err);
		        }
		    })
		}

		// once pre-init has been completed
		connectToServer().then(function(server) {

			// set functions for how to react to all messages after
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
	}
	

	function init() {
		// build an empty player
		generatePlayer();

		// populate it
		multiPlayerInit();
	}

	shared.init = init;
	return shared;
}());

App.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xucmV2ZXJianMuZXh0ZW5kKGF1ZGlvQ3R4KTtcblxudmFyIHJldmVyYlVybCA9IFwiaHR0cDovL3JldmVyYmpzLm9yZy9MaWJyYXJ5L0Vycm9sQnJpY2t3b3Jrc0tpbG4ubTRhXCI7XG52YXIgcmV2ZXJiTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZVJldmVyYkZyb21VcmwocmV2ZXJiVXJsLCBmdW5jdGlvbigpIHtcbiAgcmV2ZXJiTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbn0pO1xuXG52YXIgc2VydmVyO1xudmFyIHVzZXIgPSB7fTtcblxuXG4vLyBmdW5jdGlvbiBzZW5kRGF0YShlKSB7XG4vLyAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgIGxldCBkYXRhID0gW107XG5cbi8vICAgICBsZXQgaW5wdXRWYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFsbC1pbnB1dHMnKTtcblxuXG4vLyAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dFZhbHMubGVuZ3RoOyBpKyspIHtcbi8vICAgICAgICAgbGV0IGlucHV0ID0ge307XG4vLyAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGlucHV0VmFsc1tpXS52YWx1ZTtcbi8vICAgICAgICAgICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnICsgaTtcblxuLy8gICAgICAgICBkYXRhLnB1c2goaW5wdXQpO1xuLy8gICAgIH1cblxuLy8gICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbi8vICAgICBjbGllbnQuc2VuZChkYXRhKTtcblxuLy8gfVxuXG5cbmNvbnN0IGZyZXF1ZW5jaWVzID0gW1x0XG5cdDEzMC44MSxcblx0MTM4LjU5LFxuXHQxNDYuODMsXG5cdDE1NS41Nixcblx0MTY0LjgxLFxuXHQxNzQuNjEsXG5cdDE4NS4wMCxcblx0MTk2LjAwLFxuXHQyMDcuNjUsXG5cdDIyMC4wMCxcblx0MjMzLjA4LFxuXHQyNDYuOTQsXG5cdDI2MS42Myxcblx0Mjc3LjE4LFxuXHQyOTMuNjYsXG5cdDMxMS4xMyxcblx0MzI5LjYzLFxuXHQzNDkuMjMsXG5cdDM2OS45OSxcblx0MzkyLjAwLFxuXHQ0MTUuMzAsXG5cdDQ0MC4wMCxcblx0NDY2LjE2LFxuXHQ0OTMuODgsXG5cdDUyMy4yNSxcblx0NTU0LjM3LFxuXHQ1ODcuMzMsXG5cdDYyMi4yNSxcblx0NjU5LjI1LFxuXHQ2OTguNDYsXG5cdDczOS45OSxcblx0NzgzLjk5LFxuXHQ4MzAuNjEsXG5cdDg4MC4wMCxcblx0OTMyLjMzLFxuXHQ5ODcuNzcsXG5cdDEwNDYuNTAsXG5cdDExMDguNzMsXG5cdDExNzQuNjYsXG5cdDEyNDQuNTEsXG5cdDEzMTguNTEsXG5cdDEzOTYuOTEsXG5cdDE0NzkuOTgsXG5cdDE1NjcuOTgsXG5cdDE2NjEuMjIsXG5cdDE3NjAuMDAsXG5cdDE4NjQuNjYsXG5cdDE5NzUuNTMsXG5dO1xuXG5jb25zdCBcdGMyID0gZnJlcXVlbmNpZXNbMF0sXG5cdFx0Y3MyID0gZnJlcXVlbmNpZXNbMV0sXG5cdFx0ZDIgPSBmcmVxdWVuY2llc1syXSxcblx0XHRkczIgPSBmcmVxdWVuY2llc1szXSxcblx0XHRcblx0XHRlMiA9IGZyZXF1ZW5jaWVzWzRdLFxuXHRcdGYyID0gZnJlcXVlbmNpZXNbNV0sXG5cdFx0ZnMyID0gZnJlcXVlbmNpZXNbNl0sXG5cdFx0ZzIgPSBmcmVxdWVuY2llc1s3XSxcblx0XHRnczIgPSBmcmVxdWVuY2llc1s4XSxcblx0XHRhMiA9IGZyZXF1ZW5jaWVzWzldLFxuXHRcdGFzMiA9IGZyZXF1ZW5jaWVzWzEwXSxcblx0XHRcblx0XHRiMiA9IGZyZXF1ZW5jaWVzWzExXSxcblx0XHRjMyA9IGZyZXF1ZW5jaWVzWzEyXSxcblx0XHRjczMgPSBmcmVxdWVuY2llc1sxM10sXG5cdFx0ZDMgPSBmcmVxdWVuY2llc1sxNF0sXG5cdFx0ZHMzID0gZnJlcXVlbmNpZXNbMTVdLFxuXHRcdFxuXHRcdGUzID0gZnJlcXVlbmNpZXNbMTZdLFxuXHRcdGYzID0gZnJlcXVlbmNpZXNbMTddLFxuXHRcdGZzMyA9IGZyZXF1ZW5jaWVzWzE4XSxcblx0XHRnMyA9IGZyZXF1ZW5jaWVzWzE5XSxcblx0XHRnczMgPSBmcmVxdWVuY2llc1syMF0sXG5cdFx0YTMgPSBmcmVxdWVuY2llc1syMV0sXG5cdFx0YXMzID0gZnJlcXVlbmNpZXNbMjJdLFxuXHRcdFxuXHRcdGIzID0gZnJlcXVlbmNpZXNbMjNdLFxuXHRcdGM0ID0gZnJlcXVlbmNpZXNbMjRdLFxuXHRcdGNzNCA9IGZyZXF1ZW5jaWVzWzI1XSxcblx0XHRkNCA9IGZyZXF1ZW5jaWVzWzI2XSxcblx0XHRkczQgPSBmcmVxdWVuY2llc1syN10sXG5cdFx0XG5cdFx0ZTQgPSBmcmVxdWVuY2llc1syOF0sXG5cdFx0ZjQgPSBmcmVxdWVuY2llc1syOV0sXG5cdFx0ZnM0ID0gZnJlcXVlbmNpZXNbMzBdLFxuXHRcdGc0ID0gZnJlcXVlbmNpZXNbMzFdLFxuXHRcdGdzNCA9IGZyZXF1ZW5jaWVzWzMyXSxcblx0XHRhNCA9IGZyZXF1ZW5jaWVzWzMzXSxcblx0XHRhczQgPSBmcmVxdWVuY2llc1szNF0sXG5cdFx0XG5cdFx0YjQgPSBmcmVxdWVuY2llc1szNV0sXG5cdFx0YzUgPSBmcmVxdWVuY2llc1szNl0sXG5cdFx0Y3M1ID0gZnJlcXVlbmNpZXNbMzddLFxuXHRcdGQ1ID0gZnJlcXVlbmNpZXNbMzhdLFxuXHRcdGRzNSA9IGZyZXF1ZW5jaWVzWzM5XSxcblx0XHRcblx0XHRlNSA9IGZyZXF1ZW5jaWVzWzQwXSxcblx0XHRmNSA9IGZyZXF1ZW5jaWVzWzQxXSxcblx0XHRmczUgPSBmcmVxdWVuY2llc1s0Ml0sXG5cdFx0ZzUgPSBmcmVxdWVuY2llc1s0M10sXG5cdFx0Z3M1ID0gZnJlcXVlbmNpZXNbNDRdLFxuXHRcdGE1ID0gZnJlcXVlbmNpZXNbNDVdLFxuXHRcdGFzNSA9IGZyZXF1ZW5jaWVzWzQ2XSxcblx0XHRcblx0XHRiNSA9IGZyZXF1ZW5jaWVzWzQ3XSxcblx0XHRjNiA9IGZyZXF1ZW5jaWVzWzQ4XSxcblx0XHRjczYgPSBmcmVxdWVuY2llc1s0OV0sXG5cdFx0ZDYgPSBmcmVxdWVuY2llc1s1MF0sXG5cdFx0ZHM2ID0gZnJlcXVlbmNpZXNbNTFdLFxuXHRcdFxuXHRcdGU2ID0gZnJlcXVlbmNpZXNbNTJdLFxuXHRcdGY2ID0gZnJlcXVlbmNpZXNbNTNdLFxuXHRcdGZzNiA9IGZyZXF1ZW5jaWVzWzU0XSxcblx0XHRnNiA9IGZyZXF1ZW5jaWVzWzU1XSxcblx0XHRnczYgPSBmcmVxdWVuY2llc1s1Nl0sXG5cdFx0YTYgPSBmcmVxdWVuY2llc1s1N10sXG5cdFx0YXM2ID0gZnJlcXVlbmNpZXNbNThdLFxuXHRcdFxuXHRcdGI2ID0gZnJlcXVlbmNpZXNbNTldO1xuXG5jbGFzcyBOb3RlIHtcblx0Y29uc3RydWN0b3IoZnJlcXVlbmN5KSB7XG5cdFx0dGhpcy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XG5cdFx0dGhpcy5vc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdHRoaXMub3NjaWxsYXRvci50eXBlID0gJ3NpbmUnO1xuXHRcdHRoaXMub3NjaWxsYXRvci5mcmVxdWVuY3kudmFsdWUgPSB0aGlzLmZyZXF1ZW5jeTsgLy8gdmFsdWUgaW4gaGVydHpcblxuXHRcdHRoaXMuZ2Fpbk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnZhbHVlID0gMC4wO1xuXG5cdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5nYWluTm9kZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblx0XHR0aGlzLmNvbnRleHQgPSBhdWRpb0N0eDtcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5yYW5kb21JblJhbmdlKDEsIDMpO1xuXHRcdHRoaXMucGxheSA9IHRoaXMucGxheS5iaW5kKHRoaXMpO1xuXG5cdH1cblxuXHRyYW5kb21JblJhbmdlKGZyb20sIHRvKSB7XG5cdFx0dmFyIHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoIHRvIC0gZnJvbSApICsgZnJvbSk7XG5cdFx0XHRyID0gci8xMDAwO1xuXHRcdHJldHVybiByO1xuXHR9XG5cblx0cGxheSgpIHtcblx0XHRsZXQgZ2FpblZhbHVlID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYgKHRoaXMuZnJlcXVlbmN5ID4gMTAwMCkge1xuXHRcdFx0Z2FpblZhbHVlID0gMC43O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjg7XG5cdFx0fVxuXG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGdhaW5WYWx1ZSwgKHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDAuMDggKyB0aGlzLmRlbGF5KSk7XG5cdFx0ICAgICAgICBcblx0XHR0aGlzLm9zY2lsbGF0b3Iuc3RhcnQodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLnN0b3AoKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0bGV0IHN0b3BUaW1lID0gdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMjtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMSwgc3RvcFRpbWUpO1xuICAgICAgICB0aGlzLm9zY2lsbGF0b3Iuc3RvcChzdG9wVGltZSArIDAuMDUpO1xuXHR9XG5cblx0dHdlYWtTdGFydFRpbWUoKSB7XG5cdFx0c2V0VGltZW91dCh0aGlzLnBsYXksIHRoaXMuZGVsYXkpO1xuXHR9XG59XG5cbmNsYXNzIFNjYWxlIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5yb290Tm90ZSA9IHBhcmFtcy5yb290Tm90ZTtcblx0XHR0aGlzLnNjYWxlTmFtZSA9IHBhcmFtcy5zY2FsZU5hbWU7XG5cdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSBwYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdHRoaXMuc3RhcnRpbmdJbmRleCA9IGZyZXF1ZW5jaWVzLmluZGV4T2YodGhpcy5yb290Tm90ZSk7XG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHR9XG5cblx0Z2VuZXJhdGUoKSB7XG5cdFx0bGV0IHggPSB0aGlzLnN0YXJ0aW5nSW5kZXg7XG5cblx0XHRjb25zdCB3ID0gMjtcblx0XHRjb25zdCBoID0gMTtcblx0XHRjb25zdCBvID0gMTM7XG5cblx0XHQvLyBjb25zdCBzdGVwQXJyYXkgPSB7XG5cdFx0Ly8gXHQnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMiwgMV0sXG5cdFx0Ly8gXHQnbWlub3InOiBbXVxuXHRcdC8vIH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWFqb3InKSB7XG5cdFx0XHQvLyBSLCBXLCBXLCBILCBXLCBXLCBXLCBIXG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ21pbm9yJykgeyBcblx0XHRcdC8vIFIsIFcsIEgsIFcsIFcsIEgsIFcsIFdcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3JfaGFybW9uaWMnKSB7IFxuXHRcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgMSAxLzIsIEhcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdwZW50YXRvbmljX21ham9yJykge1xuXHRcdFx0Ly8gVyBXIDEtMS8yIHN0ZXAgVyAxLTEvMiBzdGVwXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzKjEuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdwZW50YXRvbmljX21pbm9yJykge1xuXHRcdFx0Ly8gUiwgMSAxLzIsIFcsIFcsIDEgMS8yLCBXXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzKjEuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2ZpZnRocycpIHtcblx0XHRcdC8vIFIsIDdcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiA0LjU7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnY2hvcmRfbWFqb3InKSB7XG5cdFx0XHQvLyBSLCA0LCAzXG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgMztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2Nob3JkX21pbm9yJykge1xuXHRcdFx0Ly8gUiwgMywgNFxuXG5cdFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzICogMztcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyAzO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9zdXMnKSB7XG5cdFx0XHQvLyBSLCA1LCAyXG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDU7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDI7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0fVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblx0XHR0aGlzLnVwZGF0ZUluZGV4QXJyYXkgPSB0aGlzLnVwZGF0ZUluZGV4QXJyYXkuYmluZCh0aGlzKTtcblx0fVxuXG5cdGdlbmVyYXRlUGxheWVyQXJyYXkoKSB7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHRsZXQgY29sdW1uID0gMDtcblxuXHRcdGZvciAodmFyIHggPSAwOyB4IDw9IHRoaXMubnVtYmVyT2ZCZWF0czsgeCsrKSB7XG5cdFx0XHQvL2NvbHVtbnMgKGFsbCB0aGUgc2FtZSBpbmRleCBudW1iZXIpXG5cdFx0XHR0aGlzLm5vdGVzQXJyYXkucHVzaChbXSk7XG5cblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5zY2FsZS5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHQvL3Jvd3MgKGluY3JlYXNlIGluZGV4IG51bWJlciBieSBvbmUpXG5cblx0XHRcdFx0dmFyIGNvbHVtblN0cmluZztcblx0XHRcdFx0dmFyIGluZGV4U3RyaW5nO1xuXG5cdFx0XHRcdGlmIChpbmRleCA9PSB0aGlzLnNjYWxlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb2x1bW4gPCAxMCkge1xuXHRcdFx0XHRcdGNvbHVtblN0cmluZyA9IGAwJHtjb2x1bW59YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBjb2x1bW47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaW5kZXggPCAxMCkge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gYDAke2luZGV4fWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aW5kZXhTdHJpbmcgPSBpbmRleDtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0bGV0IGFycmF5T2JqZWN0ID0ge307XG5cdFx0XHRcdGFycmF5T2JqZWN0LmlkID0gY29sdW1uU3RyaW5nKydfJytpbmRleFN0cmluZztcblx0XHRcdFx0YXJyYXlPYmplY3QuZnJlcXVlbmN5ID0gdGhpcy5zY2FsZVtpbmRleF07XG5cdFx0XHRcdGFycmF5T2JqZWN0LnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQoYXJyYXlPYmplY3QpO1xuXHRcdFx0XHRhcnJheU9iamVjdC51cGRhdGVJbmRleEFycmF5ID0gdGhpcy51cGRhdGVJbmRleEFycmF5O1xuXHRcdFx0XHRhcnJheU9iamVjdC54ID0gY29sdW1uO1xuXHRcdFx0XHRhcnJheU9iamVjdC55ID0gaW5kZXg7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlkID0gYXJyYXlPYmplY3QuaWQ7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5pbm5lckhUTUwgPSBhcnJheU9iamVjdC5mcmVxdWVuY3k7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJfX2J1dHRvbicpO1xuXG5cdFx0XHRcdGFycmF5T2JqZWN0Lm5vdGVCdXR0b24gPSBub3RlQnV0dG9uO1xuXG5cdFx0XHRcdHRoaXMubm90ZXNBcnJheVt4XVt5XSA9IGFycmF5T2JqZWN0O1xuXHRcdFx0XHRcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Y29sdW1uKys7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB7bm90ZXNBcnJheTogdGhpcy5ub3Rlc0FycmF5fTtcblx0fVxuXG5cdHVwZGF0ZUluZGV4QXJyYXkoaW5mbywgdmFsKSB7XG5cdFx0bGV0IG9iaiA9IHt9O1xuXHRcdFx0b2JqLmNhbGwgPSAndXBkYXRlX3RvZ2dsZV9hcnJheSc7XG5cdFx0XHRvYmouaWQgPSBpbmZvLmlkO1xuXHRcdFx0b2JqLnZhbCA9IHZhbDtcblxuXHRcdGNvbnN0IG9ialRvU2VuZCA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG5cblx0XHRzZXJ2ZXIuc2VuZChvYmpUb1NlbmQpO1xuXHR9XG5cblx0dG9nZ2xlKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblx0XHRpZiAobm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRcdFx0dGhpcy51cGRhdGVJbmRleEFycmF5KHRoaXMsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0dGhpcy51cGRhdGVJbmRleEFycmF5KHRoaXMsIDEpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBjbGFzcyBBcHAge1xuLy8gXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbi8vIFx0XHR0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG4vLyBcdFx0XHRyb290Tm90ZTogYzIsXG4vLyBcdFx0XHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcbi8vIFx0XHRcdG51bWJlck9mT2N0YXZlczogMixcbi8vIFx0XHRcdGJwbTogMTAwLFxuLy8gXHRcdFx0ZHVyYXRpb246IDQsXG4vLyBcdFx0XHRzaWduYXR1cmU6IFs0LCA0XSxcbi8vIFx0XHRcdG51bWJlck9mT2N0YXZlczogMixcbi8vIFx0XHRcdHRpbWU6IDUwMCxcbi8vIFx0XHR9O1xuXG4vLyBcdFx0aWYgKCFwYXJhbXMpIHtcbi8vIFx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcbi8vIFx0XHR9XG5cbi8vIFx0XHR0aGlzLnBhcmFtcy5iZWF0cyA9IHBhcmFtcy5zaWduYXR1cmVbMF07XG4vLyBcdFx0dGhpcy5wYXJhbXMubWVhc3VyZSA9IHBhcmFtcy5zaWduYXR1cmVbMV07XG4vLyBcdFx0dGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cyA9IHBhcmFtcy5kdXJhdGlvbipwYXJhbXMuYmVhdHM7XG5cbi8vIFx0XHR0aGlzLnNjYWxlID0gbmV3IFNjYWxlKHBhcmFtcyk7XG4vLyBcdFx0dGhpcy5wYXJhbXMuc2NhbGUgPSB0aGlzLnNjYWxlLmdlbmVyYXRlKCk7XG5cbi8vIFx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXJHcmlkKHBhcmFtcyk7XG5cbi8vIFx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcbi8vIFx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cbi8vIFx0XHR0aGlzLmdlbmVyYXRlUGxheWVyID0gZ2VuZXJhdGVQbGF5ZXI7XG4vLyBcdFx0dGhpcy5zZXRQbGF5SW50ZXJ2YWwgPSBzZXRQbGF5SW50ZXJ2YWw7XG4vLyBcdH1cblxuLy8gXHRnZW5lcmF0ZUFwcCgpIHtcbi8vIFx0XHR2YXIgYXBwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpO1xuXG4vLyBcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBub3RlQXJyYXkubGVuZ3RoOyB4KyspIHtcbi8vIFx0XHRcdHZhciBjb2x1bW4gPSBub3RlQXJyYXlbeF07XG5cdFx0XHRcbi8vIFx0XHRcdHZhciBwbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbi8vIFx0XHRcdFx0cGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cbi8vIFx0XHRcdGFwcFBsYXllci5hcHBlbmRDaGlsZChwbGF5ZXJDb2x1bW4pO1xuXG4vLyBcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbi5sZW5ndGg7IHkrKykge1xuLy8gXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtblt5XS5ub3RlQnV0dG9uO1xuLy8gXHRcdFx0XHRcdG5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb2x1bW5beV0udG9nZ2xlKTtcblxuLy8gXHRcdFx0XHRwbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQobm90ZUJ1dHRvbik7XG4vLyBcdFx0XHR9XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuXG4vLyBcdHNldFBsYXlJbnRlcnZhbCgpIHtcbi8vIFx0XHR0aGlzLnggPSAwO1xuXG4vLyBcdFx0aWYgKHRoaXMucGxheWVySW50ZXJ2YWwpIHtcbi8vIFx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXJJbnRlcnZhbCk7XG4vLyBcdFx0fSBlbHNlIHtcbi8vIFx0XHRcdHRoaXMucGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5wbGF5Q29sdW1uLCB0aGlzLnRpbWUpO1xuLy8gXHRcdH1cbi8vIFx0fVxuXG4vLyBcdHBsYXlDb2x1bW4oKSB7XG4vLyBcdFx0bGV0IGNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheVt4XTtcblx0XG4vLyBcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBjb2x1bW5zLmxlbmd0aDsgeSsrKSB7XG4vLyBcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtbnNbeV0ubm90ZUJ1dHRvbixcbi8vIFx0XHRcdFx0ZnJlcXVlbmN5ID0gY29sdW1uc1t5XS5mcmVxdWVuY3k7XG5cbi8vIFx0XHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XG4vLyBcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuLy8gXHRcdFx0XHR2YXIgbm90ZSA9IG5ldyBOb3RlKGZyZXF1ZW5jeSk7XG4vLyBcdFx0XHRcdG5vdGUudHdlYWtTdGFydFRpbWUoKTtcblxuLy8gXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xuLy8gXHRcdFx0XHR9LCA1MDApO1xuLy8gXHRcdFx0fSBcbi8vIFx0XHR9XG5cbi8vIFx0XHR0aGlzLngrKztcblxuLy8gXHRcdGlmICh0aGlzLnggPT0gdGhpcy5wYXJhbXMubnVtYmVyT2ZCZWF0cykge1xuLy8gXHRcdFx0dGhpcy54ID0gMDtcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuLy8gY2xhc3MgTXVsdGlwbGF5ZXJBcHAgZXh0ZW5kcyBBcHAge1xuLy8gXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbi8vIFx0XHRzdXBlcihwYXJhbXMpO1xuXG4vLyBcdH1cblxuXG4vLyB9XG5cbmZ1bmN0aW9uIG11bHRpUGxheWVySW5pdCgpIHtcblxuXHRmdW5jdGlvbiBjb25uZWN0VG9TZXJ2ZXIoKSB7XG5cblx0XHQvLyBkZWxheSBpbml0aWFsIGNvbnN0cnVjdGlvbiBvZiB0aGUgYXBwIHVudGlsIGFmdGVyIGluaXRpYWwgcGFyYW1ldGVycyBoYXZlIGJlZW4gc2V0XG5cdCAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0ICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cblx0ICAgICAgICAvLyB3YWl0IHVudGlsIHNlcnZlciByZXNwb25kcyBiZWZvcmUgZmluaXNoaW5nIGJ1aWxkXG5cdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHQvLyByZWNlaXZlIGFuZCByZWFjdCB0byBzZXJ2ZXIgcmVzcG9uc2Vcblx0ICAgICAgICBcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdCAgICAgICAgXHRcdGxldCBpbml0TWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblxuXHQgICAgICAgIFx0XHQvLyBjaGVjayB3aGV0aGVyIGpvaW5pbmcgZXhpc3RpbmcgZ2FtZSBvciBzdGFydGluZyBuZXcgb25lXG5cdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHQgICAgICAgIFx0XHRcdHJldHVybjtcblx0ICAgICAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuXHQgICAgICAgIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdE1lc3NhZ2UuYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICBcdFx0XHRcdHVwZGF0ZVBsYXllcihpbml0TWVzc2FnZS5hcnJheVtpXSk7XG5cdCAgICAgICAgXHRcdFx0fVxuXHQgICAgICAgIFx0XHR9XG5cblx0ICAgICAgICBcdFx0Ly8gc3RhcnQgbG9vcCB0byBwbGF5IG5vdGVzXG5cdCAgICAgICAgXHRcdHBsYXlOb3RlcygpO1xuXG5cdCAgICAgICAgXHRcdC8vIGZpbmlzaCBwcmUtaW5pdFxuXHQgICAgICAgIFx0XHRyZXNvbHZlKHNlcnZlcik7XG5cdCAgICAgICAgXHR9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgc2VydmVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdCAgICAgICAgfVxuXHQgICAgfSlcblx0fVxuXG5cdC8vIG9uY2UgcHJlLWluaXQgaGFzIGJlZW4gY29tcGxldGVkXG5cdGNvbm5lY3RUb1NlcnZlcigpLnRoZW4oZnVuY3Rpb24oc2VydmVyKSB7XG5cblx0XHQvLyBzZXQgZnVuY3Rpb25zIGZvciBob3cgdG8gcmVhY3QgdG8gYWxsIG1lc3NhZ2VzIGFmdGVyXG5cdFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuXHRcdFx0bGV0IHVwZGF0ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblx0XHRcdFxuXHRcdFx0Ly8gdXBkYXRlLmNhbGwgZGVzY3JpYmVzIHRoZSB0eXBlIG9mIGNoYW5nZSB0byBtYWtlXG5cdFx0XHRpZiAodXBkYXRlLmNhbGwgPT0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknKSB7XG5cdFx0XHRcdHVwZGF0ZVBsYXllcih1cGRhdGUpO1x0XG5cdFx0XHR9IGlmICh1cGRhdGUuY2FsbCA9PSAnbmV3X3BhcnRuZXJfc2V0Jykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyh1cGRhdGUpO1xuXHRcdFx0fVx0XG5cdFx0fVxuXHR9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblxuXHQvLyB1cGRhdGUgaGFuZGxlclxuXHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG5cdFx0Ly8gdGFyZ2V0IHNwZWNpZmljYWxseSB0aGUgYnV0dG9uIHRoYXQgaXMgY2hhbmdpbmdcblx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWVzc2FnZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMSkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIHRydWUgYW5kIGJ1dHRvbiBpcyBmYWxzZSwgc2V0IGJ1dHRvbiB0byB0cnVlIGJ5IGFkZGluZyAnYWN0aXZlJyB0byBjbGFzc2xpc3Rcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cbn1cblxudmFyIEFwcCA9IChmdW5jdGlvbihwYXJhbXMpIHtcblx0bGV0IHNoYXJlZCA9IHt9O1xuXG5cdGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0cm9vdE5vdGU6IGMyLFxuXHRcdHNjYWxlTmFtZTogJ3BlbnRhdG9uaWNfbWlub3InLFxuXHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHRicG06IDEwMCxcblx0XHRkdXJhdGlvbjogNCxcblx0XHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHRudW1iZXJPZk9jdGF2ZXM6IDIsXG5cdH07XG5cblx0aWYgKCFwYXJhbXMpIHtcblx0XHRwYXJhbXMgPSBkZWZhdWx0UGFyYW1zO1xuXHR9IFxuXG5cdHBhcmFtcy5iZWF0cyA9IHBhcmFtcy5zaWduYXR1cmVbMF07XG5cdHBhcmFtcy5tZWFzdXJlID0gcGFyYW1zLnNpZ25hdHVyZVsxXTtcblx0cGFyYW1zLm51bWJlck9mQmVhdHMgPSBwYXJhbXMuZHVyYXRpb24qcGFyYW1zLmJlYXRzO1xuXG5cdGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHBhcmFtcyk7XG5cblx0cGFyYW1zLnNjYWxlID0gc2NhbGUuZ2VuZXJhdGUoKTtcblxuXHRsZXQgXHRwbGF5ZXIgPSBuZXcgUGxheWVyR3JpZChwYXJhbXMpO1xuXHRcdFx0cGxheWVyQXJyYXlzID0gcGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblx0Y29uc3QgXHRub3RlQXJyYXkgPSBwbGF5ZXJBcnJheXMubm90ZXNBcnJheSxcblx0XHRcdGlkQXJyYXkgPSBwbGF5ZXJBcnJheXMuaWRBcnJheTtcblxuXHRmdW5jdGlvbiBnZW5lcmF0ZVBsYXllcigpIHtcblx0XHR2YXIgYXBwUGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcFBsYXllcicpO1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBub3RlQXJyYXkubGVuZ3RoOyB4KyspIHtcblx0XHRcdHZhciBjb2x1bW4gPSBub3RlQXJyYXlbeF07XG5cdFx0XHRcblx0XHRcdHZhciBwbGF5ZXJDb2x1bW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0cGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cblx0XHRcdGFwcFBsYXllci5hcHBlbmRDaGlsZChwbGF5ZXJDb2x1bW4pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbi5sZW5ndGg7IHkrKykge1xuXHRcdFx0XHRsZXQgbm90ZUJ1dHRvbiA9IGNvbHVtblt5XS5ub3RlQnV0dG9uO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb2x1bW5beV0udG9nZ2xlKTtcblxuXHRcdFx0XHRwbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQobm90ZUJ1dHRvbik7XG5cdFx0XHR9XG5cblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHBsYXlOb3RlcygpIHtcblxuXHRcdGxldCB4ID0gMDtcblxuXHRcdHZhciBwbGF5ZXJJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChwbGF5Q29sdW1uLCB0aW1lKTtcblxuXHRcdGZ1bmN0aW9uIHBsYXlDb2x1bW4oKSB7XG5cdFx0XHRsZXQgY29sdW1ucyA9IG5vdGVBcnJheVt4XTtcblxuXHRcdFx0XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGNvbHVtbnMubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSBjb2x1bW5zW3ldLm5vdGVCdXR0b24sXG5cdFx0XHRcdFx0ZnJlcXVlbmN5ID0gY29sdW1uc1t5XS5mcmVxdWVuY3k7XG5cblx0XHRcdFx0aWYgKG5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xuXHRcdFx0XHRcdHZhciBub3RlID0gbmV3IE5vdGUoZnJlcXVlbmN5KTtcblx0XHRcdFx0XHRub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG5cdFx0XHRcdFx0fSwgNTAwKTtcblx0XHRcdFx0fSBcblx0XHRcdH1cblxuXHRcdFx0eCsrO1xuXG5cdFx0XHRpZiAoeCA9PSBwYXJhbXMubnVtYmVyT2ZCZWF0cykge1xuXHRcdFx0XHR4ID0gMDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBtdWx0aVBsYXllckluaXQoKSB7XG5cblx0XHRmdW5jdGlvbiBjb25uZWN0VG9TZXJ2ZXIoKSB7XG5cblx0XHRcdC8vIGRlbGF5IGluaXRpYWwgY29uc3RydWN0aW9uIG9mIHRoZSBhcHAgdW50aWwgYWZ0ZXIgaW5pdGlhbCBwYXJhbWV0ZXJzIGhhdmUgYmVlbiBzZXRcblx0XHQgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG5cdFx0ICAgIFx0Ly8gY3JlYXRlIGxpdmUgY29ubmVjdGlvbiB0byBzZXJ2ZXJcblx0XHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHRcdCAgICAgICAgLy8gd2FpdCB1bnRpbCBzZXJ2ZXIgcmVzcG9uZHMgYmVmb3JlIGZpbmlzaGluZyBidWlsZFxuXHRcdCAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuXHRcdCAgICAgICAgXHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG5cdFx0ICAgICAgICBcdFx0Ly8gcGFyc2UgaW5pdGlhbCBtZXNzYWdlXG5cdFx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdFx0ICAgICAgICBcdFx0Ly8gY2hlY2sgd2hldGhlciBqb2luaW5nIGV4aXN0aW5nIGdhbWUgb3Igc3RhcnRpbmcgbmV3IG9uZVxuXHRcdCAgICAgICAgXHRcdGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdudWxsJykge1xuXHRcdCAgICAgICAgXHRcdFx0cmV0dXJuO1xuXHRcdCAgICAgICAgXHRcdH0gZWxzZSBpZiAoaW5pdE1lc3NhZ2UuY2FsbCA9PSAnaW5pdCcpIHtcblx0XHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuXHRcdCAgICAgICAgXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbml0TWVzc2FnZS5hcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdCAgICAgICAgXHRcdFx0XHR1cGRhdGVQbGF5ZXIoaW5pdE1lc3NhZ2UuYXJyYXlbaV0pO1xuXHRcdCAgICAgICAgXHRcdFx0fVxuXHRcdCAgICAgICAgXHRcdH1cblxuXHRcdCAgICAgICAgXHRcdC8vIHN0YXJ0IGxvb3AgdG8gcGxheSBub3Rlc1xuXHRcdCAgICAgICAgXHRcdHBsYXlOb3RlcygpO1xuXG5cdFx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG5cdFx0ICAgICAgICBcdFx0cmVzb2x2ZShzZXJ2ZXIpO1xuXHRcdCAgICAgICAgXHR9XG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgICAgIHNlcnZlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdFx0ICAgICAgICAgICAgcmVqZWN0KGVycik7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pXG5cdFx0fVxuXG5cdFx0Ly8gb25jZSBwcmUtaW5pdCBoYXMgYmVlbiBjb21wbGV0ZWRcblx0XHRjb25uZWN0VG9TZXJ2ZXIoKS50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXG5cdFx0XHQvLyBzZXQgZnVuY3Rpb25zIGZvciBob3cgdG8gcmVhY3QgdG8gYWxsIG1lc3NhZ2VzIGFmdGVyXG5cdFx0XHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXG5cdFx0XHRcdGxldCB1cGRhdGUgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyB1cGRhdGUuY2FsbCBkZXNjcmliZXMgdGhlIHR5cGUgb2YgY2hhbmdlIHRvIG1ha2Vcblx0XHRcdFx0aWYgKHVwZGF0ZS5jYWxsID09ICd1cGRhdGVfdG9nZ2xlX2FycmF5Jykge1xuXHRcdFx0XHRcdHVwZGF0ZVBsYXllcih1cGRhdGUpO1x0XG5cdFx0XHRcdH0gaWYgKHVwZGF0ZS5jYWxsID09ICduZXdfcGFydG5lcl9zZXQnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codXBkYXRlKTtcblx0XHRcdFx0fVx0XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gdXBkYXRlIGhhbmRsZXJcblx0XHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG5cdFx0XHQvLyB0YXJnZXQgc3BlY2lmaWNhbGx5IHRoZSBidXR0b24gdGhhdCBpcyBjaGFuZ2luZ1xuXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1lc3NhZ2UuaWQpO1xuXG5cdFx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRcdGlmIFx0KGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmIG1lc3NhZ2UudmFsID09IDApIHtcblx0XHRcdFx0Ly8gaWYgdmFsIGlzIGZhbHNlIGFuZCBidXR0b24gaXMgdHJ1ZSwgc2V0IGJ1dHRvbiB0byBmYWxzZSBieSByZW1vdmluZyAnYWN0aXZlJyBmcm9tIGNsYXNzbGlzdFxuXHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHR9IGVsc2UgaWYgKCFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAxKSB7XG5cdFx0XHRcdC8vIGlmIHZhbCBpcyB0cnVlIGFuZCBidXR0b24gaXMgZmFsc2UsIHNldCBidXR0b24gdG8gdHJ1ZSBieSBhZGRpbmcgJ2FjdGl2ZScgdG8gY2xhc3NsaXN0XG5cdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQvLyBidWlsZCBhbiBlbXB0eSBwbGF5ZXJcblx0XHRnZW5lcmF0ZVBsYXllcigpO1xuXG5cdFx0Ly8gcG9wdWxhdGUgaXRcblx0XHRtdWx0aVBsYXllckluaXQoKTtcblx0fVxuXG5cdHNoYXJlZC5pbml0ID0gaW5pdDtcblx0cmV0dXJuIHNoYXJlZDtcbn0oKSk7XG5cbkFwcC5pbml0KCk7Il19
