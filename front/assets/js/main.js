var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// reverbjs.extend(audioCtx);

// var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
// var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
//   reverbNode.connect(audioCtx.destination);
// });

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
		console.log(this.delay);
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
		this.startingIndex = frequencies.indexOf(this.rootNote);

		this.scaleType = this.params.scaleType;
		this.numberOfOctaves = this.params.numberOfOctaves;
		

		this.key = this.params.key;
		this.startingOctave = this.params.startingOctave;

		this.scale = [];
		this.stepPattern = {
			'major': [2, 2, 1, 2, 2, 2, 1, 2],
			'minor': [2, 1, 2, 2, 1, 2, 2, 2],
			'minor_harmonic': [2, 1, 2, 2, 1, 3, 1, 2],
			'pentatonic_major': [2, 3, 2, 3, 2],
			'pentatonic_minor': [3, 2, 2, 3, 2, 2],
			'fifths': [7, 2],
			'chord_major': [4, 3, 2],
			'chord_minor': [3, 4, 2],
			'chord_sus': [5, 2, 2],
			'chromatic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
		}

		// every single note name starting with c
		this.chromaticNotes = ['c', 'c#', 'd','d#', 'e', 'f', 'f#','g', 'g#', 'a', 'a#','b',];

		// at least one note has to be hard-coded for the formula to work
		this.cFreq = 16.35;

		// select a step pattern based on parameters
		for (name in this.stepPattern) {
			if (this.scaleType == name) {
				this.stepArray = this.stepPattern[name];
			}
		}

		// finds number of steps to root note
		this.rootNote = this.generateSteps(this.startingOctave, this.key);
	}

	// find steps between two notes
	generateSteps(octave, startingNote) {
		let steps = (12 * octave) + this.chromaticNotes.indexOf(startingNote);
		return steps;
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
		this.scale.push(this.generateFreq(this.rootNote));
		let steps = this.rootNote;

		for (var x = 0; x < this.numberOfOctaves; x++) {
			console.log(`loop number ${x}`);

			for (var i = 0; i < this.stepArray.length; i++) {
				if (i <= this.stepArray.length - 1) {
					steps = steps +  this.stepArray[i];
					let freq = this.generateFreq(steps);
					this.scale.push(freq);
				} else if (i = this.stepArray.length + 1) {
					this.scale.push(frequencies[x]);
				}
			}
		}

		return this.scale;
	}


	// create freq array and return it

	// generate() {
	// 	let x = this.startingIndex;

	// 	const w = 2;
	// 	const h = 1;
	// 	const o = 13;

		

	// 	if (this.scaleName == 'major') {
	// 		// R, W, W, H, W, W, W, H

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

				
	// 		}
	// 	}

	// 	if (this.scaleName == 'minor') { 
	// 		// R, W, H, W, W, H, W, W

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			if (i == this.numberOfOctaves - 1) {
	// 				this.scale.push(frequencies[x]);
	// 			}
	// 		}
	// 	}

	// 	if (this.scaleName == 'minor_harmonic') { 
	// 		// R, W, H, W, W, H, 1 1/2, H

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {
	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + h;

	// 			if (i == this.numberOfOctaves - 1) {
	// 				this.scale.push(frequencies[x]);
	// 			}
	// 		}
	// 	}

	// 	if (this.scaleName == 'pentatonic_major') {
	// 		// W W 1-1/2 step W 1-1/2 step
	// 		this.numberOfOctaves = this.numberOfOctaves*1.5;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {
	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w + h;

	// 			if (i == this.numberOfOctaves - 1) {
	// 				this.scale.push(frequencies[x]);
	// 			}
	// 		}	
	// 	}

	// 	if (this.scaleName == 'pentatonic_minor') {
	// 		// R, 1 1/2, W, W, 1 1/2, W
	// 		this.numberOfOctaves = this.numberOfOctaves*1.5;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w + h;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + w;

	// 			if (i == this.numberOfOctaves - 1) {
	// 				this.scale.push(frequencies[x]);
	// 			}
	// 		}	
	// 	}

	// 	if (this.scaleName == 'fifths') {
	// 		// R, 7
	// 		this.numberOfOctaves = this.numberOfOctaves * 4.5;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {
	// 			this.scale.push(frequencies[x]);

	// 			x = x + 4;

	// 			if (i == this.numberOfOctaves) {
	// 				this.scale.push(frequencies[x]);
	// 			}

	// 		}
	// 	}

	// 	if (this.scaleName == 'chord_major') {
	// 		// R, 4, 3


	// 		this.numberOfOctaves = this.numberOfOctaves * 3;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {

	// 			this.scale.push(frequencies[x]);

	// 			x = x + 4;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + 3;

	// 			if (i == this.numberOfOctaves) {
	// 				this.scale.push(frequencies[x]);
	// 			}
	// 		}
	// 	}

	// 	if (this.scaleName == 'chord_minor') {
	// 		// R, 3, 4


	// 		this.numberOfOctaves = this.numberOfOctaves * 3;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {
	// 			this.scale.push(frequencies[x]);

	// 			x = x + 3;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + 4;

	// 			if (i == this.numberOfOctaves) {
	// 				this.scale.push(frequencies[x]);
	// 			}

	// 		}
	// 	}

	// 	if (this.scaleName == 'chord_sus') {
	// 		// R, 5, 2

	// 		this.numberOfOctaves = this.numberOfOctaves * 3;

	// 		for (var i = 0; i < this.numberOfOctaves; i++) {
	// 			this.scale.push(frequencies[x]);

	// 			x = x + 5;

	// 			this.scale.push(frequencies[x]);

	// 			x = x + 2;

	// 			if (i == this.numberOfOctaves) {
	// 				this.scale.push(frequencies[x]);
	// 			}

	// 		}
	// 	}

	// 	return this.scale;
	// }
}

class PlayerGrid {
	constructor(params) {
		this.numberOfBeats = params.numberOfBeats;
		this.scale = params.scale;
		this.notesArray = [];

		console.log(params);
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
				arrayObject.updateIndexArray = this.updateIndexArray.bind(arrayObject);
				arrayObject.x = column;
				arrayObject.y = index;

				let noteButton = document.createElement('button');
					noteButton.id = arrayObject.id;
					// noteButton.innerHTML = arrayObject.frequency;
					noteButton.classList.add('player__button');
					noteButton.innerHTML = y;

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
		this.defaultParams = {
			'key': 'c',
			'startingOctave': 3,
			'scaleType': 'major',
			'numberOfOctaves': 2,
			'duration': 5, 
			'signature': [4, 4],
		}

		// this.defaultParams = {
		// 	rootNote: c2,
		// 	scaleName: 'pentatonic_minor',
		// 	numberOfOctaves: 2,
		// 	bpm: 100,
		// 	duration: 5,
		// 	signature: [4, 4],
		// };

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

		this.init = this.init.bind(this);
		this.setPlayInterval = this.setPlayInterval.bind(this);
		this.playColumn = this.playColumn.bind(this);
		this.refreshApp = this.refreshApp;

		this.appContainer = document.getElementById('appPlayer');
		this.allOff = this.allOff.bind(this);
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
				// it has to be a new note every time because of how the gain functions work
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

		this.setPlayInterval();
	}
}

const multiPlayer = (function() {
	var app;

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

	return ({init : init });
}());

multiPlayer.init();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xuLy8gcmV2ZXJianMuZXh0ZW5kKGF1ZGlvQ3R4KTtcblxuLy8gdmFyIHJldmVyYlVybCA9IFwiaHR0cDovL3JldmVyYmpzLm9yZy9MaWJyYXJ5L0Vycm9sQnJpY2t3b3Jrc0tpbG4ubTRhXCI7XG4vLyB2YXIgcmV2ZXJiTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZVJldmVyYkZyb21VcmwocmV2ZXJiVXJsLCBmdW5jdGlvbigpIHtcbi8vICAgcmV2ZXJiTm9kZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbi8vIH0pO1xuXG52YXIgc2VydmVyO1xudmFyIHVzZXIgPSB7fTtcblxuXG5jb25zdCBmcmVxdWVuY2llcyA9IFtcdFxuXHQxMzAuODEsXG5cdDEzOC41OSxcblx0MTQ2LjgzLFxuXHQxNTUuNTYsXG5cdDE2NC44MSxcblx0MTc0LjYxLFxuXHQxODUuMDAsXG5cdDE5Ni4wMCxcblx0MjA3LjY1LFxuXHQyMjAuMDAsXG5cdDIzMy4wOCxcblx0MjQ2Ljk0LFxuXHQyNjEuNjMsXG5cdDI3Ny4xOCxcblx0MjkzLjY2LFxuXHQzMTEuMTMsXG5cdDMyOS42Myxcblx0MzQ5LjIzLFxuXHQzNjkuOTksXG5cdDM5Mi4wMCxcblx0NDE1LjMwLFxuXHQ0NDAuMDAsXG5cdDQ2Ni4xNixcblx0NDkzLjg4LFxuXHQ1MjMuMjUsXG5cdDU1NC4zNyxcblx0NTg3LjMzLFxuXHQ2MjIuMjUsXG5cdDY1OS4yNSxcblx0Njk4LjQ2LFxuXHQ3MzkuOTksXG5cdDc4My45OSxcblx0ODMwLjYxLFxuXHQ4ODAuMDAsXG5cdDkzMi4zMyxcblx0OTg3Ljc3LFxuXHQxMDQ2LjUwLFxuXHQxMTA4LjczLFxuXHQxMTc0LjY2LFxuXHQxMjQ0LjUxLFxuXHQxMzE4LjUxLFxuXHQxMzk2LjkxLFxuXHQxNDc5Ljk4LFxuXHQxNTY3Ljk4LFxuXHQxNjYxLjIyLFxuXHQxNzYwLjAwLFxuXHQxODY0LjY2LFxuXHQxOTc1LjUzLFxuXTtcblxuY29uc3QgXHRjMiA9IGZyZXF1ZW5jaWVzWzBdLFxuXHRcdGNzMiA9IGZyZXF1ZW5jaWVzWzFdLFxuXHRcdGQyID0gZnJlcXVlbmNpZXNbMl0sXG5cdFx0ZHMyID0gZnJlcXVlbmNpZXNbM10sXG5cdFx0XG5cdFx0ZTIgPSBmcmVxdWVuY2llc1s0XSxcblx0XHRmMiA9IGZyZXF1ZW5jaWVzWzVdLFxuXHRcdGZzMiA9IGZyZXF1ZW5jaWVzWzZdLFxuXHRcdGcyID0gZnJlcXVlbmNpZXNbN10sXG5cdFx0Z3MyID0gZnJlcXVlbmNpZXNbOF0sXG5cdFx0YTIgPSBmcmVxdWVuY2llc1s5XSxcblx0XHRhczIgPSBmcmVxdWVuY2llc1sxMF0sXG5cdFx0XG5cdFx0YjIgPSBmcmVxdWVuY2llc1sxMV0sXG5cdFx0YzMgPSBmcmVxdWVuY2llc1sxMl0sXG5cdFx0Y3MzID0gZnJlcXVlbmNpZXNbMTNdLFxuXHRcdGQzID0gZnJlcXVlbmNpZXNbMTRdLFxuXHRcdGRzMyA9IGZyZXF1ZW5jaWVzWzE1XSxcblx0XHRcblx0XHRlMyA9IGZyZXF1ZW5jaWVzWzE2XSxcblx0XHRmMyA9IGZyZXF1ZW5jaWVzWzE3XSxcblx0XHRmczMgPSBmcmVxdWVuY2llc1sxOF0sXG5cdFx0ZzMgPSBmcmVxdWVuY2llc1sxOV0sXG5cdFx0Z3MzID0gZnJlcXVlbmNpZXNbMjBdLFxuXHRcdGEzID0gZnJlcXVlbmNpZXNbMjFdLFxuXHRcdGFzMyA9IGZyZXF1ZW5jaWVzWzIyXSxcblx0XHRcblx0XHRiMyA9IGZyZXF1ZW5jaWVzWzIzXSxcblx0XHRjNCA9IGZyZXF1ZW5jaWVzWzI0XSxcblx0XHRjczQgPSBmcmVxdWVuY2llc1syNV0sXG5cdFx0ZDQgPSBmcmVxdWVuY2llc1syNl0sXG5cdFx0ZHM0ID0gZnJlcXVlbmNpZXNbMjddLFxuXHRcdFxuXHRcdGU0ID0gZnJlcXVlbmNpZXNbMjhdLFxuXHRcdGY0ID0gZnJlcXVlbmNpZXNbMjldLFxuXHRcdGZzNCA9IGZyZXF1ZW5jaWVzWzMwXSxcblx0XHRnNCA9IGZyZXF1ZW5jaWVzWzMxXSxcblx0XHRnczQgPSBmcmVxdWVuY2llc1szMl0sXG5cdFx0YTQgPSBmcmVxdWVuY2llc1szM10sXG5cdFx0YXM0ID0gZnJlcXVlbmNpZXNbMzRdLFxuXHRcdFxuXHRcdGI0ID0gZnJlcXVlbmNpZXNbMzVdLFxuXHRcdGM1ID0gZnJlcXVlbmNpZXNbMzZdLFxuXHRcdGNzNSA9IGZyZXF1ZW5jaWVzWzM3XSxcblx0XHRkNSA9IGZyZXF1ZW5jaWVzWzM4XSxcblx0XHRkczUgPSBmcmVxdWVuY2llc1szOV0sXG5cdFx0XG5cdFx0ZTUgPSBmcmVxdWVuY2llc1s0MF0sXG5cdFx0ZjUgPSBmcmVxdWVuY2llc1s0MV0sXG5cdFx0ZnM1ID0gZnJlcXVlbmNpZXNbNDJdLFxuXHRcdGc1ID0gZnJlcXVlbmNpZXNbNDNdLFxuXHRcdGdzNSA9IGZyZXF1ZW5jaWVzWzQ0XSxcblx0XHRhNSA9IGZyZXF1ZW5jaWVzWzQ1XSxcblx0XHRhczUgPSBmcmVxdWVuY2llc1s0Nl0sXG5cdFx0XG5cdFx0YjUgPSBmcmVxdWVuY2llc1s0N10sXG5cdFx0YzYgPSBmcmVxdWVuY2llc1s0OF0sXG5cdFx0Y3M2ID0gZnJlcXVlbmNpZXNbNDldLFxuXHRcdGQ2ID0gZnJlcXVlbmNpZXNbNTBdLFxuXHRcdGRzNiA9IGZyZXF1ZW5jaWVzWzUxXSxcblx0XHRcblx0XHRlNiA9IGZyZXF1ZW5jaWVzWzUyXSxcblx0XHRmNiA9IGZyZXF1ZW5jaWVzWzUzXSxcblx0XHRmczYgPSBmcmVxdWVuY2llc1s1NF0sXG5cdFx0ZzYgPSBmcmVxdWVuY2llc1s1NV0sXG5cdFx0Z3M2ID0gZnJlcXVlbmNpZXNbNTZdLFxuXHRcdGE2ID0gZnJlcXVlbmNpZXNbNTddLFxuXHRcdGFzNiA9IGZyZXF1ZW5jaWVzWzU4XSxcblx0XHRcblx0XHRiNiA9IGZyZXF1ZW5jaWVzWzU5XTtcblxuY2xhc3MgTm90ZSB7XG5cdGNvbnN0cnVjdG9yKGZyZXF1ZW5jeSkge1xuXHRcdHRoaXMuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xuXHRcdHRoaXMub3NjaWxsYXRvciA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcblx0XHR0aGlzLm9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcblx0XHR0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gdGhpcy5mcmVxdWVuY3k7IC8vIHZhbHVlIGluIGhlcnR6XG5cblx0XHR0aGlzLmdhaW5Ob2RlID0gYXVkaW9DdHguY3JlYXRlR2FpbigpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDAuMDtcblxuXHRcdHRoaXMub3NjaWxsYXRvci5jb25uZWN0KHRoaXMuZ2Fpbk5vZGUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cdFx0dGhpcy5jb250ZXh0ID0gYXVkaW9DdHg7XG5cdFx0dGhpcy5kZWxheSA9IHRoaXMucmFuZG9tSW5SYW5nZSgxLCAzKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmRlbGF5KTtcblx0XHR0aGlzLnBsYXkgPSB0aGlzLnBsYXkuYmluZCh0aGlzKTtcblxuXHR9XG5cblx0cmFuZG9tSW5SYW5nZShmcm9tLCB0bykge1xuXHRcdHZhciByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCB0byAtIGZyb20gKSArIGZyb20pO1xuXHRcdFx0ciA9IHIvMTAwMDtcblx0XHRyZXR1cm4gcjtcblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0bGV0IGdhaW5WYWx1ZSA9IHVuZGVmaW5lZDtcblxuXHRcdGlmICh0aGlzLmZyZXF1ZW5jeSA+IDEwMDApIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuNztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2FpblZhbHVlID0gMC44O1xuXHRcdH1cblxuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShnYWluVmFsdWUsICh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAwLjA4ICsgdGhpcy5kZWxheSkpO1xuXHRcdCAgICAgICAgXG5cdFx0dGhpcy5vc2NpbGxhdG9yLnN0YXJ0KHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG5cdFx0dGhpcy5zdG9wKCk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdGxldCBzdG9wVGltZSA9IHRoaXMuY29udGV4dC5jdXJyZW50VGltZSArIDI7XG5cdFx0dGhpcy5nYWluTm9kZS5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMC4wMDEsIHN0b3BUaW1lKTtcbiAgICAgICAgdGhpcy5vc2NpbGxhdG9yLnN0b3Aoc3RvcFRpbWUgKyAwLjA1KTtcblx0fVxuXG5cdHR3ZWFrU3RhcnRUaW1lKCkge1xuXHRcdHNldFRpbWVvdXQodGhpcy5wbGF5LCB0aGlzLmRlbGF5KTtcblx0fVxufVxuXG5cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLnJvb3ROb3RlID0gdGhpcy5wYXJhbXMucm9vdE5vdGU7XG5cdFx0dGhpcy5zdGFydGluZ0luZGV4ID0gZnJlcXVlbmNpZXMuaW5kZXhPZih0aGlzLnJvb3ROb3RlKTtcblxuXHRcdHRoaXMuc2NhbGVUeXBlID0gdGhpcy5wYXJhbXMuc2NhbGVUeXBlO1xuXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5wYXJhbXMubnVtYmVyT2ZPY3RhdmVzO1xuXHRcdFxuXG5cdFx0dGhpcy5rZXkgPSB0aGlzLnBhcmFtcy5rZXk7XG5cdFx0dGhpcy5zdGFydGluZ09jdGF2ZSA9IHRoaXMucGFyYW1zLnN0YXJ0aW5nT2N0YXZlO1xuXG5cdFx0dGhpcy5zY2FsZSA9IFtdO1xuXHRcdHRoaXMuc3RlcFBhdHRlcm4gPSB7XG5cdFx0XHQnbWFqb3InOiBbMiwgMiwgMSwgMiwgMiwgMiwgMSwgMl0sXG5cdFx0XHQnbWlub3InOiBbMiwgMSwgMiwgMiwgMSwgMiwgMiwgMl0sXG5cdFx0XHQnbWlub3JfaGFybW9uaWMnOiBbMiwgMSwgMiwgMiwgMSwgMywgMSwgMl0sXG5cdFx0XHQncGVudGF0b25pY19tYWpvcic6IFsyLCAzLCAyLCAzLCAyXSxcblx0XHRcdCdwZW50YXRvbmljX21pbm9yJzogWzMsIDIsIDIsIDMsIDIsIDJdLFxuXHRcdFx0J2ZpZnRocyc6IFs3LCAyXSxcblx0XHRcdCdjaG9yZF9tYWpvcic6IFs0LCAzLCAyXSxcblx0XHRcdCdjaG9yZF9taW5vcic6IFszLCA0LCAyXSxcblx0XHRcdCdjaG9yZF9zdXMnOiBbNSwgMiwgMl0sXG5cdFx0XHQnY2hyb21hdGljJzogWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsXVxuXHRcdH1cblxuXHRcdC8vIGV2ZXJ5IHNpbmdsZSBub3RlIG5hbWUgc3RhcnRpbmcgd2l0aCBjXG5cdFx0dGhpcy5jaHJvbWF0aWNOb3RlcyA9IFsnYycsICdjIycsICdkJywnZCMnLCAnZScsICdmJywgJ2YjJywnZycsICdnIycsICdhJywgJ2EjJywnYicsXTtcblxuXHRcdC8vIGF0IGxlYXN0IG9uZSBub3RlIGhhcyB0byBiZSBoYXJkLWNvZGVkIGZvciB0aGUgZm9ybXVsYSB0byB3b3JrXG5cdFx0dGhpcy5jRnJlcSA9IDE2LjM1O1xuXG5cdFx0Ly8gc2VsZWN0IGEgc3RlcCBwYXR0ZXJuIGJhc2VkIG9uIHBhcmFtZXRlcnNcblx0XHRmb3IgKG5hbWUgaW4gdGhpcy5zdGVwUGF0dGVybikge1xuXHRcdFx0aWYgKHRoaXMuc2NhbGVUeXBlID09IG5hbWUpIHtcblx0XHRcdFx0dGhpcy5zdGVwQXJyYXkgPSB0aGlzLnN0ZXBQYXR0ZXJuW25hbWVdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZpbmRzIG51bWJlciBvZiBzdGVwcyB0byByb290IG5vdGVcblx0XHR0aGlzLnJvb3ROb3RlID0gdGhpcy5nZW5lcmF0ZVN0ZXBzKHRoaXMuc3RhcnRpbmdPY3RhdmUsIHRoaXMua2V5KTtcblx0fVxuXG5cdC8vIGZpbmQgc3RlcHMgYmV0d2VlbiB0d28gbm90ZXNcblx0Z2VuZXJhdGVTdGVwcyhvY3RhdmUsIHN0YXJ0aW5nTm90ZSkge1xuXHRcdGxldCBzdGVwcyA9ICgxMiAqIG9jdGF2ZSkgKyB0aGlzLmNocm9tYXRpY05vdGVzLmluZGV4T2Yoc3RhcnRpbmdOb3RlKTtcblx0XHRyZXR1cm4gc3RlcHM7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBhIHNpbmdsZSBmcmVxdWVuY3kgYmFzZWQgb24gc3RlcHMgZnJvbSBjMFxuXHRnZW5lcmF0ZUZyZXEobnVtYmVyT2ZTdGVwcykge1xuXG5cdFx0Y29uc3QgYSA9IDEuMDU5NDYzMDk0MzU5O1xuXHRcdFxuXHRcdGxldCBmID0gdGhpcy5jRnJlcTtcblx0XHRsZXQgbiA9IG51bWJlck9mU3RlcHM7XG5cblx0XHRsZXQgZnJlcXVlbmN5ID0gZiAqIE1hdGgucG93KGEsIG4pO1xuXG5cdFx0cmV0dXJuICggZnJlcXVlbmN5ICk7XG5cdH1cblxuXHQvLyBnZW5lcmF0ZSBzY2FsZSBieSBzdGVwcyBhbmQgcm9vdFxuXHRnZW5lcmF0ZSgpIHtcblx0XHR0aGlzLnNjYWxlLnB1c2godGhpcy5nZW5lcmF0ZUZyZXEodGhpcy5yb290Tm90ZSkpO1xuXHRcdGxldCBzdGVwcyA9IHRoaXMucm9vdE5vdGU7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyB4KyspIHtcblx0XHRcdGNvbnNvbGUubG9nKGBsb29wIG51bWJlciAke3h9YCk7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGVwQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGkgPD0gdGhpcy5zdGVwQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHN0ZXBzID0gc3RlcHMgKyAgdGhpcy5zdGVwQXJyYXlbaV07XG5cdFx0XHRcdFx0bGV0IGZyZXEgPSB0aGlzLmdlbmVyYXRlRnJlcShzdGVwcyk7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXEpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGkgPSB0aGlzLnN0ZXBBcnJheS5sZW5ndGggKyAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNjYWxlO1xuXHR9XG5cblxuXHQvLyBjcmVhdGUgZnJlcSBhcnJheSBhbmQgcmV0dXJuIGl0XG5cblx0Ly8gZ2VuZXJhdGUoKSB7XG5cdC8vIFx0bGV0IHggPSB0aGlzLnN0YXJ0aW5nSW5kZXg7XG5cblx0Ly8gXHRjb25zdCB3ID0gMjtcblx0Ly8gXHRjb25zdCBoID0gMTtcblx0Ly8gXHRjb25zdCBvID0gMTM7XG5cblx0XHRcblxuXHQvLyBcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWFqb3InKSB7XG5cdC8vIFx0XHQvLyBSLCBXLCBXLCBILCBXLCBXLCBXLCBIXG5cblx0Ly8gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyBoO1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdFxuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblxuXHQvLyBcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3InKSB7IFxuXHQvLyBcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgVywgV1xuXG5cdC8vIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdztcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgaDtcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdztcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdztcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgaDtcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdztcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdztcblxuXHQvLyBcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXG5cdC8vIFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtaW5vcl9oYXJtb25pYycpIHsgXG5cdC8vIFx0XHQvLyBSLCBXLCBILCBXLCBXLCBILCAxIDEvMiwgSFxuXG5cdC8vIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIGg7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIGg7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyBoO1xuXG5cdC8vIFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHQvLyBcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH1cblx0Ly8gXHR9XG5cblx0Ly8gXHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWFqb3InKSB7XG5cdC8vIFx0XHQvLyBXIFcgMS0xLzIgc3RlcCBXIDEtMS8yIHN0ZXBcblx0Ly8gXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdC8vIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHQvLyBcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9XHRcblx0Ly8gXHR9XG5cblx0Ly8gXHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWlub3InKSB7XG5cdC8vIFx0XHQvLyBSLCAxIDEvMiwgVywgVywgMSAxLzIsIFdcblx0Ly8gXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdC8vIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHQvLyBcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdC8vIFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHc7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyB3O1xuXG5cdC8vIFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHQvLyBcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdC8vIFx0XHRcdH1cblx0Ly8gXHRcdH1cdFxuXHQvLyBcdH1cblxuXHQvLyBcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnZmlmdGhzJykge1xuXHQvLyBcdFx0Ly8gUiwgN1xuXHQvLyBcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDQuNTtcblxuXHQvLyBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyA0O1xuXG5cdC8vIFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdC8vIFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0Ly8gXHRcdFx0fVxuXG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXG5cdC8vIFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9tYWpvcicpIHtcblx0Ly8gXHRcdC8vIFIsIDQsIDNcblxuXG5cdC8vIFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzICogMztcblxuXHQvLyBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIDQ7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIDM7XG5cblx0Ly8gXHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHQvLyBcdFx0XHR9XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXG5cdC8vIFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9taW5vcicpIHtcblx0Ly8gXHRcdC8vIFIsIDMsIDRcblxuXG5cdC8vIFx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHRoaXMubnVtYmVyT2ZPY3RhdmVzICogMztcblxuXHQvLyBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyAzO1xuXG5cdC8vIFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0Ly8gXHRcdFx0eCA9IHggKyA0O1xuXG5cdC8vIFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdC8vIFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0Ly8gXHRcdFx0fVxuXG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXG5cdC8vIFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9zdXMnKSB7XG5cdC8vIFx0XHQvLyBSLCA1LCAyXG5cblx0Ly8gXHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdC8vIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIDU7XG5cblx0Ly8gXHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHQvLyBcdFx0XHR4ID0geCArIDI7XG5cblx0Ly8gXHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0Ly8gXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHQvLyBcdFx0XHR9XG5cblx0Ly8gXHRcdH1cblx0Ly8gXHR9XG5cblx0Ly8gXHRyZXR1cm4gdGhpcy5zY2FsZTtcblx0Ly8gfVxufVxuXG5jbGFzcyBQbGF5ZXJHcmlkIHtcblx0Y29uc3RydWN0b3IocGFyYW1zKSB7XG5cdFx0dGhpcy5udW1iZXJPZkJlYXRzID0gcGFyYW1zLm51bWJlck9mQmVhdHM7XG5cdFx0dGhpcy5zY2FsZSA9IHBhcmFtcy5zY2FsZTtcblx0XHR0aGlzLm5vdGVzQXJyYXkgPSBbXTtcblxuXHRcdGNvbnNvbGUubG9nKHBhcmFtcyk7XG5cdH1cblxuXHRnZW5lcmF0ZVBsYXllckFycmF5KCkge1xuXHRcdGxldCBpbmRleCA9IDA7XG5cdFx0bGV0IGNvbHVtbiA9IDA7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8PSB0aGlzLm51bWJlck9mQmVhdHM7IHgrKykge1xuXHRcdFx0Ly9jb2x1bW5zIChhbGwgdGhlIHNhbWUgaW5kZXggbnVtYmVyKVxuXHRcdFx0dGhpcy5ub3Rlc0FycmF5LnB1c2goW10pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2NhbGUubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0Ly9yb3dzIChpbmNyZWFzZSBpbmRleCBudW1iZXIgYnkgb25lKVxuXG5cdFx0XHRcdHZhciBjb2x1bW5TdHJpbmc7XG5cdFx0XHRcdHZhciBpbmRleFN0cmluZztcblxuXHRcdFx0XHRpZiAoaW5kZXggPT0gdGhpcy5zY2FsZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29sdW1uIDwgMTApIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBgMCR7Y29sdW1ufWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gY29sdW1uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGluZGV4IDwgMTApIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGAwJHtpbmRleH1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gaW5kZXg7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGxldCBhcnJheU9iamVjdCA9IHt9O1xuXHRcdFx0XHRhcnJheU9iamVjdC5pZCA9IGNvbHVtblN0cmluZysnXycraW5kZXhTdHJpbmc7XG5cdFx0XHRcdGFycmF5T2JqZWN0LmZyZXF1ZW5jeSA9IHRoaXMuc2NhbGVbaW5kZXhdO1xuXHRcdFx0XHRhcnJheU9iamVjdC50b2dnbGUgPSB0aGlzLnRvZ2dsZS5iaW5kKGFycmF5T2JqZWN0KTtcblx0XHRcdFx0YXJyYXlPYmplY3QudXBkYXRlSW5kZXhBcnJheSA9IHRoaXMudXBkYXRlSW5kZXhBcnJheS5iaW5kKGFycmF5T2JqZWN0KTtcblx0XHRcdFx0YXJyYXlPYmplY3QueCA9IGNvbHVtbjtcblx0XHRcdFx0YXJyYXlPYmplY3QueSA9IGluZGV4O1xuXG5cdFx0XHRcdGxldCBub3RlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5pZCA9IGFycmF5T2JqZWN0LmlkO1xuXHRcdFx0XHRcdC8vIG5vdGVCdXR0b24uaW5uZXJIVE1MID0gYXJyYXlPYmplY3QuZnJlcXVlbmN5O1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWVyX19idXR0b24nKTtcblx0XHRcdFx0XHRub3RlQnV0dG9uLmlubmVySFRNTCA9IHk7XG5cblx0XHRcdFx0YXJyYXlPYmplY3Qubm90ZUJ1dHRvbiA9IG5vdGVCdXR0b247XG5cblx0XHRcdFx0dGhpcy5ub3Rlc0FycmF5W3hdW3ldID0gYXJyYXlPYmplY3Q7XG5cdFx0XHRcdFxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRjb2x1bW4rKztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHtub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXG5cdH1cblxuXHR1cGRhdGVJbmRleEFycmF5KGluZm8pIHtcblxuXHRcdGxldCBvYmogPSB7fTtcblx0XHRcdG9iai5jYWxsID0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknO1xuXHRcdFx0b2JqLmlkID0gaW5mby5pZDtcblxuXHRcdFx0aWYgKHRoaXMubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdG9iai52YWwgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b2JqLnZhbCA9IDA7XG5cdFx0XHR9XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0c2VydmVyLnNlbmQob2JqVG9TZW5kKTtcblx0fVxuXG5cdHRvZ2dsZSgpIHtcblx0XHRsZXQgbm90ZUJ1dHRvbiA9IHRoaXMubm90ZUJ1dHRvbjtcblxuXHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG59XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMuZGVmYXVsdFBhcmFtcyA9IHtcblx0XHRcdCdrZXknOiAnYycsXG5cdFx0XHQnc3RhcnRpbmdPY3RhdmUnOiAzLFxuXHRcdFx0J3NjYWxlVHlwZSc6ICdtYWpvcicsXG5cdFx0XHQnbnVtYmVyT2ZPY3RhdmVzJzogMixcblx0XHRcdCdkdXJhdGlvbic6IDUsIFxuXHRcdFx0J3NpZ25hdHVyZSc6IFs0LCA0XSxcblx0XHR9XG5cblx0XHQvLyB0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0Ly8gXHRyb290Tm90ZTogYzIsXG5cdFx0Ly8gXHRzY2FsZU5hbWU6ICdwZW50YXRvbmljX21pbm9yJyxcblx0XHQvLyBcdG51bWJlck9mT2N0YXZlczogMixcblx0XHQvLyBcdGJwbTogMTAwLFxuXHRcdC8vIFx0ZHVyYXRpb246IDUsXG5cdFx0Ly8gXHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHQvLyB9O1xuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdHRoaXMucGFyYW1zID0gdGhpcy5kZWZhdWx0UGFyYW1zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR9XG5cblx0XHR0aGlzLnBhcmFtcy5iZWF0cyA9IHRoaXMucGFyYW1zLnNpZ25hdHVyZVswXTtcblx0XHR0aGlzLnBhcmFtcy5tZWFzdXJlID0gdGhpcy5wYXJhbXMuc2lnbmF0dXJlWzFdO1xuXHRcdHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgPSB0aGlzLnBhcmFtcy5kdXJhdGlvbip0aGlzLnBhcmFtcy5iZWF0cztcblx0XHR0aGlzLnBhcmFtcy50aW1lID0gdGhpcy5wYXJhbXMuYnBtICogNDtcblxuXHRcdHRoaXMuc2NhbGUgPSBuZXcgU2NhbGUodGhpcy5wYXJhbXMpO1xuXHRcdHRoaXMucGFyYW1zLnNjYWxlID0gdGhpcy5zY2FsZS5nZW5lcmF0ZSgpO1xuXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyR3JpZCh0aGlzLnBhcmFtcyk7XG5cblx0XHR0aGlzLnBsYXllckFycmF5cyA9IHRoaXMucGxheWVyLmdlbmVyYXRlUGxheWVyQXJyYXkoKTtcblx0XHR0aGlzLm5vdGVBcnJheSA9IHRoaXMucGxheWVyQXJyYXlzLm5vdGVzQXJyYXk7XG5cblx0XHR0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcblx0XHR0aGlzLnNldFBsYXlJbnRlcnZhbCA9IHRoaXMuc2V0UGxheUludGVydmFsLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5wbGF5Q29sdW1uID0gdGhpcy5wbGF5Q29sdW1uLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5yZWZyZXNoQXBwID0gdGhpcy5yZWZyZXNoQXBwO1xuXG5cdFx0dGhpcy5hcHBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJyk7XG5cdFx0dGhpcy5hbGxPZmYgPSB0aGlzLmFsbE9mZi5iaW5kKHRoaXMpO1xuXHR9XG5cblx0cmVmcmVzaEFwcCgpIHtcblx0XHR0aGlzLmFwcENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuXHRcdHRoaXMuZ2VuZXJhdGVBcHAoKTtcblx0fVxuXG5cdHNldFBsYXlJbnRlcnZhbCgpIHtcblx0XHR0aGlzLnhDb3VudCA9IDA7XG5cblx0XHRpZiAodGhpcy5wbGF5ZXJJbnRlcnZhbCkge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnBsYXllckludGVydmFsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wbGF5ZXJJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnBsYXlDb2x1bW4sIHRoaXMucGFyYW1zLnRpbWUpO1xuXHRcdH1cblx0fVxuXG5cdHBsYXlDb2x1bW4oKSB7XG5cblx0XHR0aGlzLmNvbHVtbnMgPSB0aGlzLm5vdGVBcnJheVt0aGlzLnhDb3VudF07XG5cdFxuXHRcdGZvciAodGhpcy55Q291bnQgPSAwOyB0aGlzLnlDb3VudCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IHRoaXMueUNvdW50KyspIHtcblx0XHRcdHRoaXMubm90ZUJ1dHRvbiA9IHRoaXMuY29sdW1uc1t0aGlzLnlDb3VudF0ubm90ZUJ1dHRvbjtcblx0XHRcdHRoaXMuZnJlcXVlbmN5ID0gdGhpcy5jb2x1bW5zW3RoaXMueUNvdW50XS5mcmVxdWVuY3k7XG5cblx0XHRcdGlmICh0aGlzLm5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0XHQvLyBpdCBoYXMgdG8gYmUgYSBuZXcgbm90ZSBldmVyeSB0aW1lIGJlY2F1c2Ugb2YgaG93IHRoZSBnYWluIGZ1bmN0aW9ucyB3b3JrXG5cdFx0XHRcdHRoaXMubm90ZSA9IG5ldyBOb3RlKHRoaXMuZnJlcXVlbmN5KTtcblx0XHRcdFx0dGhpcy5ub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0dGhpcy5ub3RlLnR3ZWFrU3RhcnRUaW1lKCk7XG5cblx0XHRcdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XG5cdFx0XHRcdH0sIHRoaXMucGFyYW1zLnRpbWUpO1xuXHRcdFx0fSBcblx0XHR9XG5cblx0XHR0aGlzLnhDb3VudCsrO1xuXG5cdFx0aWYgKHRoaXMueENvdW50ID09IHRoaXMucGFyYW1zLm51bWJlck9mQmVhdHMgKyAxKSB7XG5cdFx0XHR0aGlzLnhDb3VudCA9IDA7XG5cdFx0fVxuXHR9XG5cblx0YWxsT2ZmKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRsZXQgY29sdW1ucyA9IHRoaXMubm90ZUFycmF5O1xuXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBjb2x1bW5zLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRsZXQgYnV0dG9ucyA9IGNvbHVtbnNbeF07XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IGJ1dHRvbnMubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0aWYgKGJ1dHRvbnNbeV0ubm90ZUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0YnV0dG9uc1t5XS50b2dnbGUoKTtcblx0XHRcdFx0XHRidXR0b25zW3ldLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uc1t5XS5ub3RlQnV0dG9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGluaXQoY29uZGl0aW9uKSB7XG5cdFx0dmFyIG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdHZhciBmaXJzdCA9IHRydWU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0bW91c2Vkb3duID0gdHJ1ZTtcblx0XHR9KTtcblxuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcblx0XHRcdG1vdXNlZG93biA9IGZhbHNlO1xuXHRcdFx0Zmlyc3QgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0Zm9yICh0aGlzLnggPSAwOyB0aGlzLnggPCB0aGlzLm5vdGVBcnJheS5sZW5ndGg7IHRoaXMueCsrKSB7XG5cdFx0XHR0aGlzLmNvbHVtbiA9IHRoaXMubm90ZUFycmF5W3RoaXMueF07XG5cdFx0XHRcblx0XHRcdHRoaXMucGxheWVyQ29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHRoaXMucGxheWVyQ29sdW1uLmNsYXNzTGlzdC5hZGQoJ3BsYXllcl9fY29sdW1uJyk7XG5cblx0XHRcdHRoaXMuYXBwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucGxheWVyQ29sdW1uKTtcblxuXHRcdFx0Zm9yICh0aGlzLnkgPSAwOyB0aGlzLnkgPCB0aGlzLmNvbHVtbi5sZW5ndGg7IHRoaXMueSsrKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgYnV0dG9uID0gdGhpcy5jb2x1bW5bdGhpcy55XTtcblx0XHRcdFx0dmFyIHN0YXRlO1xuXG5cdFx0XHRcdGJ1dHRvbi5ub3RlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnRvZ2dsZSgpO1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBidXR0b24ubm90ZUJ1dHRvbi5jbGFzc0xpc3QudmFsdWU7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1x0XG5cdFx0XHRcdFx0fSBcblxuXHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YnV0dG9uLm5vdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChtb3VzZWRvd24pIHtcblx0XHRcdFx0XHRcdGlmIChmaXJzdCkge1xuXHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gYnV0dG9uLm5vdGVCdXR0b24uY2xhc3NMaXN0LnZhbHVlO1xuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5jbGFzc0xpc3QudmFsdWUgIT0gc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRidXR0b24udG9nZ2xlKCk7XHRcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChjb25kaXRpb24gPT0gJ211bHRpJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YnV0dG9uLnVwZGF0ZUluZGV4QXJyYXkoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5wbGF5ZXJDb2x1bW4uYXBwZW5kQ2hpbGQoYnV0dG9uLm5vdGVCdXR0b24pO1xuXHRcdFx0fVx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRQbGF5SW50ZXJ2YWwoKTtcblx0fVxufVxuXG5jb25zdCBtdWx0aVBsYXllciA9IChmdW5jdGlvbigpIHtcblx0dmFyIGFwcDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdC8vIG9wZW4gc2VydmVyXG5cdFx0Y29ubmVjdFRvU2VydmVyKCkudGhlbihmdW5jdGlvbihzZXJ2ZXIpIHtcblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhckFsbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXBwLmFsbE9mZik7XG5cblx0XHRcdC8vIHdoYXQgdG8gZG8gd2hlbiB0aGUgc2VydmVyIHNlbmRzIHVwZGF0ZXNcblx0XHRcdHNlcnZlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cblx0XHRcdFx0bGV0IHVwZGF0ZSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIHVwZGF0ZS5jYWxsIGRlc2NyaWJlcyB0aGUgdHlwZSBvZiBjaGFuZ2UgdG8gbWFrZVxuXHRcdFx0XHRpZiAodXBkYXRlLmNhbGwgPT0gJ3VwZGF0ZV90b2dnbGVfYXJyYXknKSB7XG5cdFx0XHRcdFx0dXBkYXRlUGxheWVyKHVwZGF0ZSk7XHRcblx0XHRcdFx0fSBpZiAodXBkYXRlLmNhbGwgPT0gJ25ld19wYXJ0bmVyX3NldCcpIHtcblx0XHRcdFx0XHRhcHAuYWxsT2ZmKCk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuXG5cdFx0Ly8gZ2VuZXJhdGUgYSBuZXcgYXBwIGluc3RhbmNlIHdpdGggbXVsdGlwbGF5ZXIgc2V0dGluZ3MsIGJ1dCBkb24ndCBtb3VudCBpdCB1bnRpbCBzZXJ2ZXIgY2FuIHJlc3BvbmRcbiAgICBcdGFwcCA9IG5ldyBBcHA7XG5cblx0XHQvLyBwcm9taXNlIGFsbG93cyBzZXJ2ZXIgdG8gc2VuZCBpbmZvIG9uIG90aGVyIHBsYXllcidzIGJvYXJkIGJlZm9yZSB0aGUgdXNlciBcblx0ICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuXHQgICAgXHQvLyBjcmVhdGUgbGl2ZSBjb25uZWN0aW9uIHRvIHNlcnZlclxuXHQgICAgICAgIHNlcnZlciA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjEzNTcnKTtcblxuXHQgICAgICAgIC8vIHdhaXQgdW50aWwgc2VydmVyIHJlc3BvbmRzIGJlZm9yZSBmaW5pc2hpbmcgYnVpbGRcblx0ICAgICAgICBzZXJ2ZXIub25vcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0ICAgICAgICBcdC8vIHJlY2VpdmUgYW5kIHJlYWN0IHRvIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgIFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblxuXHQgICAgICAgIFx0XHQvLyBwYXJzZSBpbml0aWFsIG1lc3NhZ2Vcblx0ICAgICAgICBcdFx0bGV0IGluaXRNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlLmRhdGEpO1xuXG5cdCAgICAgICAgXHRcdC8vIGNoZWNrIHdoZXRoZXIgam9pbmluZyBleGlzdGluZyBnYW1lIG9yIHN0YXJ0aW5nIG5ldyBvbmVcblx0ICAgICAgICBcdFx0aWYgKGluaXRNZXNzYWdlLmNhbGwgPT0gJ251bGwnKSB7XG5cdCAgIFx0XHRcdFx0XHRhcHAuaW5pdCgnbXVsdGknKTtcblx0ICAgICAgICBcdFx0fSBlbHNlIGlmIChpbml0TWVzc2FnZS5jYWxsID09ICdpbml0Jykge1xuXHQgICAgICAgIFx0XHRcdGFwcC5pbml0KCdtdWx0aScpO1xuXHQgICAgICAgIFx0XHRcdC8vIGlmIGpvaW5pbmcgbmV3IGV4aXN0aW5nLCB1cGRhdGUgcGxheWVyIHRvIHJlZmxlY3QgZXhpc3RpbmcgY29uZGl0aW9uc1xuXHQgICAgICAgIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdE1lc3NhZ2UuYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICBcdFx0XHRcdHVwZGF0ZVBsYXllcihpbml0TWVzc2FnZS5hcnJheVtpXSk7XG5cdCAgICAgICAgXHRcdFx0fVxuXHQgICAgICAgIFx0XHR9XG5cblx0ICAgICAgICBcdFx0Ly8gZmluaXNoIHByZS1pbml0XG5cdCAgICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHQgICAgICAgICAgICByZWplY3QoZXJyKTtcblx0ICAgICAgICB9XG5cdCAgICB9KVxuXHR9XG5cblxuXHQvLyB1cGRhdGUgaGFuZGxlclxuXHRmdW5jdGlvbiB1cGRhdGVQbGF5ZXIobWVzc2FnZSkge1xuXG5cdFx0Ly8gdGFyZ2V0IHNwZWNpZmljYWxseSB0aGUgYnV0dG9uIHRoYXQgaXMgY2hhbmdpbmdcblx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobWVzc2FnZS5pZCk7XG5cblx0XHQvLyBjb21wYXJlIGNsYXNzTGlzdCB2YWxzIHRvIHRoZSBuZXcgdmFscyBcblx0XHRpZiBcdChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiBtZXNzYWdlLnZhbCA9PSAwKSB7XG5cdFx0XHQvLyBpZiB2YWwgaXMgZmFsc2UgYW5kIGJ1dHRvbiBpcyB0cnVlLCBzZXQgYnV0dG9uIHRvIGZhbHNlIGJ5IHJlbW92aW5nICdhY3RpdmUnIGZyb20gY2xhc3NsaXN0XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSBlbHNlIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgbWVzc2FnZS52YWwgPT0gMSkge1xuXHRcdFx0Ly8gaWYgdmFsIGlzIHRydWUgYW5kIGJ1dHRvbiBpcyBmYWxzZSwgc2V0IGJ1dHRvbiB0byB0cnVlIGJ5IGFkZGluZyAnYWN0aXZlJyB0byBjbGFzc2xpc3Rcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gKHtpbml0IDogaW5pdCB9KTtcbn0oKSk7XG5cbm11bHRpUGxheWVyLmluaXQoKTtcbiJdfQ==
