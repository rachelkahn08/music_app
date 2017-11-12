var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioCtx);

var reverbUrl = "http://reverbjs.org/Library/ErrolBrickworksKiln.m4a";
var reverbNode = audioCtx.createReverbFromUrl(reverbUrl, function() {
  reverbNode.connect(audioCtx.destination);
});

var server;
var user = {};

function connectToServer() {
    return new Promise(function(resolve, reject) {
        server = new WebSocket('ws://localhost:1357');

        server.onopen = function() {
        	if (!window.localStorage.getItem('username')) {
        		server.send('null');
	      		server.onmessage = function(message) {
	      			window.localStorage.setItem('username', message.data);
	      			resolve(server);
	      		}
	      	} else {
	      		server.send(window.localStorage.getItem('username'));
	      		resolve(server);
	      	}
        }

        server.onerror = function(err) {
            reject(err);
        }
    })
}

connectToServer().then(function(server) {
	server.onmessage = function(message) {
		console.log(message.data.username);
	}

    App.init();
}).catch(function(err) {
    console.log(err);
});

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

		const stepArray = {
			major: [2, 2, 1, 2, 2, 2, 1],
		}

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

class Player {
	constructor(params) {
		this.numberOfBeats = params.numberOfBeats;
		this.scale = params.scale;
		this.notesArray = [];
		this.idArray = [];
		this.updateIndexArray = this.updateIndexArray.bind(this);
	}

	generatePlayerArray() {
		let index = 0;
		let column = 0;

		for (var x = 0; x <= this.numberOfBeats; x++) {
			//columns (all the same index number)
			this.notesArray.push([]);
			this.idArray.push([]);

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
				this.idArray[x][y] = 0;

				
				index++;
			}

			column++;
		}
		
		return {idArray: this.idArray, notesArray: this.notesArray};
	}

	updateIndexArray(info, val) {
		this.idArray[info.x][info.y] = val;

		let obj = {};
			obj.x = info.x;
			obj.y = info.y;
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

var App = (function(params) {
	let shared = {};

	const defaultParams = {
		rootNote: c2,
		scaleName: 'pentatonic_minor',
		numberOfOctaves: 2,
		bpm: 100,
		duration: 6,
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

	let 	player = new Player(params);
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

			
			//console.log('append');
		}
	}

	function playNotes() {
		let time = 500;

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

	function init() {
		generatePlayer();
		playNotes();
	}

	function updatePlayer() {

	}

	shared.init = init;
	return shared;
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGF1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG5yZXZlcmJqcy5leHRlbmQoYXVkaW9DdHgpO1xuXG52YXIgcmV2ZXJiVXJsID0gXCJodHRwOi8vcmV2ZXJianMub3JnL0xpYnJhcnkvRXJyb2xCcmlja3dvcmtzS2lsbi5tNGFcIjtcbnZhciByZXZlcmJOb2RlID0gYXVkaW9DdHguY3JlYXRlUmV2ZXJiRnJvbVVybChyZXZlcmJVcmwsIGZ1bmN0aW9uKCkge1xuICByZXZlcmJOb2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xufSk7XG5cbnZhciBzZXJ2ZXI7XG52YXIgdXNlciA9IHt9O1xuXG5mdW5jdGlvbiBjb25uZWN0VG9TZXJ2ZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBzZXJ2ZXIgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDoxMzU3Jyk7XG5cbiAgICAgICAgc2VydmVyLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdGlmICghd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VybmFtZScpKSB7XG4gICAgICAgIFx0XHRzZXJ2ZXIuc2VuZCgnbnVsbCcpO1xuXHQgICAgICBcdFx0c2VydmVyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblx0ICAgICAgXHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VybmFtZScsIG1lc3NhZ2UuZGF0YSk7XG5cdCAgICAgIFx0XHRcdHJlc29sdmUoc2VydmVyKTtcblx0ICAgICAgXHRcdH1cblx0ICAgICAgXHR9IGVsc2Uge1xuXHQgICAgICBcdFx0c2VydmVyLnNlbmQod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VybmFtZScpKTtcblx0ICAgICAgXHRcdHJlc29sdmUoc2VydmVyKTtcblx0ICAgICAgXHR9XG4gICAgICAgIH1cblxuICAgICAgICBzZXJ2ZXIub25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5jb25uZWN0VG9TZXJ2ZXIoKS50aGVuKGZ1bmN0aW9uKHNlcnZlcikge1xuXHRzZXJ2ZXIub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHRcdGNvbnNvbGUubG9nKG1lc3NhZ2UuZGF0YS51c2VybmFtZSk7XG5cdH1cblxuICAgIEFwcC5pbml0KCk7XG59KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xufSk7XG5cbi8vIGZ1bmN0aW9uIHNlbmREYXRhKGUpIHtcbi8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgbGV0IGRhdGEgPSBbXTtcblxuLy8gICAgIGxldCBpbnB1dFZhbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWxsLWlucHV0cycpO1xuXG5cbi8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0VmFscy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgICBsZXQgaW5wdXQgPSB7fTtcbi8vICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gaW5wdXRWYWxzW2ldLnZhbHVlO1xuLy8gICAgICAgICAgICAgaW5wdXQubmFtZSA9ICdpbnB1dCcgKyBpO1xuXG4vLyAgICAgICAgIGRhdGEucHVzaChpbnB1dCk7XG4vLyAgICAgfVxuXG4vLyAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuLy8gICAgIGNsaWVudC5zZW5kKGRhdGEpO1xuXG4vLyB9XG5cblxuY29uc3QgZnJlcXVlbmNpZXMgPSBbXHRcblx0MTMwLjgxLFxuXHQxMzguNTksXG5cdDE0Ni44Myxcblx0MTU1LjU2LFxuXHQxNjQuODEsXG5cdDE3NC42MSxcblx0MTg1LjAwLFxuXHQxOTYuMDAsXG5cdDIwNy42NSxcblx0MjIwLjAwLFxuXHQyMzMuMDgsXG5cdDI0Ni45NCxcblx0MjYxLjYzLFxuXHQyNzcuMTgsXG5cdDI5My42Nixcblx0MzExLjEzLFxuXHQzMjkuNjMsXG5cdDM0OS4yMyxcblx0MzY5Ljk5LFxuXHQzOTIuMDAsXG5cdDQxNS4zMCxcblx0NDQwLjAwLFxuXHQ0NjYuMTYsXG5cdDQ5My44OCxcblx0NTIzLjI1LFxuXHQ1NTQuMzcsXG5cdDU4Ny4zMyxcblx0NjIyLjI1LFxuXHQ2NTkuMjUsXG5cdDY5OC40Nixcblx0NzM5Ljk5LFxuXHQ3ODMuOTksXG5cdDgzMC42MSxcblx0ODgwLjAwLFxuXHQ5MzIuMzMsXG5cdDk4Ny43Nyxcblx0MTA0Ni41MCxcblx0MTEwOC43Myxcblx0MTE3NC42Nixcblx0MTI0NC41MSxcblx0MTMxOC41MSxcblx0MTM5Ni45MSxcblx0MTQ3OS45OCxcblx0MTU2Ny45OCxcblx0MTY2MS4yMixcblx0MTc2MC4wMCxcblx0MTg2NC42Nixcblx0MTk3NS41Myxcbl07XG5cbmNvbnN0IFx0YzIgPSBmcmVxdWVuY2llc1swXSxcblx0XHRjczIgPSBmcmVxdWVuY2llc1sxXSxcblx0XHRkMiA9IGZyZXF1ZW5jaWVzWzJdLFxuXHRcdGRzMiA9IGZyZXF1ZW5jaWVzWzNdLFxuXHRcdFxuXHRcdGUyID0gZnJlcXVlbmNpZXNbNF0sXG5cdFx0ZjIgPSBmcmVxdWVuY2llc1s1XSxcblx0XHRmczIgPSBmcmVxdWVuY2llc1s2XSxcblx0XHRnMiA9IGZyZXF1ZW5jaWVzWzddLFxuXHRcdGdzMiA9IGZyZXF1ZW5jaWVzWzhdLFxuXHRcdGEyID0gZnJlcXVlbmNpZXNbOV0sXG5cdFx0YXMyID0gZnJlcXVlbmNpZXNbMTBdLFxuXHRcdFxuXHRcdGIyID0gZnJlcXVlbmNpZXNbMTFdLFxuXHRcdGMzID0gZnJlcXVlbmNpZXNbMTJdLFxuXHRcdGNzMyA9IGZyZXF1ZW5jaWVzWzEzXSxcblx0XHRkMyA9IGZyZXF1ZW5jaWVzWzE0XSxcblx0XHRkczMgPSBmcmVxdWVuY2llc1sxNV0sXG5cdFx0XG5cdFx0ZTMgPSBmcmVxdWVuY2llc1sxNl0sXG5cdFx0ZjMgPSBmcmVxdWVuY2llc1sxN10sXG5cdFx0ZnMzID0gZnJlcXVlbmNpZXNbMThdLFxuXHRcdGczID0gZnJlcXVlbmNpZXNbMTldLFxuXHRcdGdzMyA9IGZyZXF1ZW5jaWVzWzIwXSxcblx0XHRhMyA9IGZyZXF1ZW5jaWVzWzIxXSxcblx0XHRhczMgPSBmcmVxdWVuY2llc1syMl0sXG5cdFx0XG5cdFx0YjMgPSBmcmVxdWVuY2llc1syM10sXG5cdFx0YzQgPSBmcmVxdWVuY2llc1syNF0sXG5cdFx0Y3M0ID0gZnJlcXVlbmNpZXNbMjVdLFxuXHRcdGQ0ID0gZnJlcXVlbmNpZXNbMjZdLFxuXHRcdGRzNCA9IGZyZXF1ZW5jaWVzWzI3XSxcblx0XHRcblx0XHRlNCA9IGZyZXF1ZW5jaWVzWzI4XSxcblx0XHRmNCA9IGZyZXF1ZW5jaWVzWzI5XSxcblx0XHRmczQgPSBmcmVxdWVuY2llc1szMF0sXG5cdFx0ZzQgPSBmcmVxdWVuY2llc1szMV0sXG5cdFx0Z3M0ID0gZnJlcXVlbmNpZXNbMzJdLFxuXHRcdGE0ID0gZnJlcXVlbmNpZXNbMzNdLFxuXHRcdGFzNCA9IGZyZXF1ZW5jaWVzWzM0XSxcblx0XHRcblx0XHRiNCA9IGZyZXF1ZW5jaWVzWzM1XSxcblx0XHRjNSA9IGZyZXF1ZW5jaWVzWzM2XSxcblx0XHRjczUgPSBmcmVxdWVuY2llc1szN10sXG5cdFx0ZDUgPSBmcmVxdWVuY2llc1szOF0sXG5cdFx0ZHM1ID0gZnJlcXVlbmNpZXNbMzldLFxuXHRcdFxuXHRcdGU1ID0gZnJlcXVlbmNpZXNbNDBdLFxuXHRcdGY1ID0gZnJlcXVlbmNpZXNbNDFdLFxuXHRcdGZzNSA9IGZyZXF1ZW5jaWVzWzQyXSxcblx0XHRnNSA9IGZyZXF1ZW5jaWVzWzQzXSxcblx0XHRnczUgPSBmcmVxdWVuY2llc1s0NF0sXG5cdFx0YTUgPSBmcmVxdWVuY2llc1s0NV0sXG5cdFx0YXM1ID0gZnJlcXVlbmNpZXNbNDZdLFxuXHRcdFxuXHRcdGI1ID0gZnJlcXVlbmNpZXNbNDddLFxuXHRcdGM2ID0gZnJlcXVlbmNpZXNbNDhdLFxuXHRcdGNzNiA9IGZyZXF1ZW5jaWVzWzQ5XSxcblx0XHRkNiA9IGZyZXF1ZW5jaWVzWzUwXSxcblx0XHRkczYgPSBmcmVxdWVuY2llc1s1MV0sXG5cdFx0XG5cdFx0ZTYgPSBmcmVxdWVuY2llc1s1Ml0sXG5cdFx0ZjYgPSBmcmVxdWVuY2llc1s1M10sXG5cdFx0ZnM2ID0gZnJlcXVlbmNpZXNbNTRdLFxuXHRcdGc2ID0gZnJlcXVlbmNpZXNbNTVdLFxuXHRcdGdzNiA9IGZyZXF1ZW5jaWVzWzU2XSxcblx0XHRhNiA9IGZyZXF1ZW5jaWVzWzU3XSxcblx0XHRhczYgPSBmcmVxdWVuY2llc1s1OF0sXG5cdFx0XG5cdFx0YjYgPSBmcmVxdWVuY2llc1s1OV07XG5cbmNsYXNzIE5vdGUge1xuXHRjb25zdHJ1Y3RvcihmcmVxdWVuY3kpIHtcblx0XHR0aGlzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcblx0XHR0aGlzLm9zY2lsbGF0b3IgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLnR5cGUgPSAnc2luZSc7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IHRoaXMuZnJlcXVlbmN5OyAvLyB2YWx1ZSBpbiBoZXJ0elxuXG5cdFx0dGhpcy5nYWluTm9kZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwLjA7XG5cblx0XHR0aGlzLm9zY2lsbGF0b3IuY29ubmVjdCh0aGlzLmdhaW5Ob2RlKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXHRcdHRoaXMuY29udGV4dCA9IGF1ZGlvQ3R4O1xuXHRcdHRoaXMuZGVsYXkgPSB0aGlzLnJhbmRvbUluUmFuZ2UoMSwgMyk7XG5cdFx0dGhpcy5wbGF5ID0gdGhpcy5wbGF5LmJpbmQodGhpcyk7XG5cblx0fVxuXG5cdHJhbmRvbUluUmFuZ2UoZnJvbSwgdG8pIHtcblx0XHR2YXIgciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICggdG8gLSBmcm9tICkgKyBmcm9tKTtcblx0XHRcdHIgPSByLzEwMDA7XG5cdFx0cmV0dXJuIHI7XG5cdH1cblxuXHRwbGF5KCkge1xuXHRcdGxldCBnYWluVmFsdWUgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiAodGhpcy5mcmVxdWVuY3kgPiAxMDAwKSB7XG5cdFx0XHRnYWluVmFsdWUgPSAwLjc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhaW5WYWx1ZSA9IDAuODtcblx0XHR9XG5cblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLmdhaW5Ob2RlLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoZ2FpblZhbHVlLCAodGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lICsgMC4wOCArIHRoaXMuZGVsYXkpKTtcblx0XHQgICAgICAgIFxuXHRcdHRoaXMub3NjaWxsYXRvci5zdGFydCh0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuc3RvcCgpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHRsZXQgc3RvcFRpbWUgPSB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUgKyAyO1xuXHRcdHRoaXMuZ2Fpbk5vZGUuZ2Fpbi5leHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lKDAuMDAxLCBzdG9wVGltZSk7XG4gICAgICAgIHRoaXMub3NjaWxsYXRvci5zdG9wKHN0b3BUaW1lICsgMC4wNSk7XG5cdH1cblxuXHR0d2Vha1N0YXJ0VGltZSgpIHtcblx0XHRzZXRUaW1lb3V0KHRoaXMucGxheSwgdGhpcy5kZWxheSk7XG5cdH1cbn1cblxuY2xhc3MgU2NhbGUge1xuXHRjb25zdHJ1Y3RvcihwYXJhbXMpIHtcblx0XHR0aGlzLnJvb3ROb3RlID0gcGFyYW1zLnJvb3ROb3RlO1xuXHRcdHRoaXMuc2NhbGVOYW1lID0gcGFyYW1zLnNjYWxlTmFtZTtcblx0XHR0aGlzLm51bWJlck9mT2N0YXZlcyA9IHBhcmFtcy5udW1iZXJPZk9jdGF2ZXM7XG5cdFx0dGhpcy5zdGFydGluZ0luZGV4ID0gZnJlcXVlbmNpZXMuaW5kZXhPZih0aGlzLnJvb3ROb3RlKTtcblx0XHR0aGlzLnNjYWxlID0gW107XG5cdH1cblxuXHRnZW5lcmF0ZSgpIHtcblx0XHRsZXQgeCA9IHRoaXMuc3RhcnRpbmdJbmRleDtcblxuXHRcdGNvbnN0IHcgPSAyO1xuXHRcdGNvbnN0IGggPSAxO1xuXHRcdGNvbnN0IG8gPSAxMztcblxuXHRcdGNvbnN0IHN0ZXBBcnJheSA9IHtcblx0XHRcdG1ham9yOiBbMiwgMiwgMSwgMiwgMiwgMiwgMV0sXG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtYWpvcicpIHtcblx0XHRcdC8vIFIsIFcsIFcsIEgsIFcsIFcsIFcsIEhcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgLSAxKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnbWlub3InKSB7IFxuXHRcdFx0Ly8gUiwgVywgSCwgVywgVywgSCwgVywgV1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgaDtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdztcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdtaW5vcl9oYXJtb25pYycpIHsgXG5cdFx0XHQvLyBSLCBXLCBILCBXLCBXLCBILCAxIDEvMiwgSFxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyBoO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWFqb3InKSB7XG5cdFx0XHQvLyBXIFcgMS0xLzIgc3RlcCBXIDEtMS8yIHN0ZXBcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3ICsgaDtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcyAtIDEpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ3BlbnRhdG9uaWNfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAxIDEvMiwgVywgVywgMSAxLzIsIFdcblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMqMS41O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgdyArIGg7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHc7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIHcgKyBoO1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyB3O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzIC0gMSkge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cdFxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnZmlmdGhzJykge1xuXHRcdFx0Ly8gUiwgN1xuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDQuNTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mT2N0YXZlczsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuc2NhbGVOYW1lID09ICdjaG9yZF9tYWpvcicpIHtcblx0XHRcdC8vIFIsIDQsIDNcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyA0O1xuXG5cdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cblx0XHRcdFx0eCA9IHggKyAzO1xuXG5cdFx0XHRcdGlmIChpID09IHRoaXMubnVtYmVyT2ZPY3RhdmVzKSB7XG5cdFx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnNjYWxlTmFtZSA9PSAnY2hvcmRfbWlub3InKSB7XG5cdFx0XHQvLyBSLCAzLCA0XG5cblx0XHRcdHRoaXMubnVtYmVyT2ZPY3RhdmVzID0gdGhpcy5udW1iZXJPZk9jdGF2ZXMgKiAzO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubnVtYmVyT2ZPY3RhdmVzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDM7XG5cblx0XHRcdFx0dGhpcy5zY2FsZS5wdXNoKGZyZXF1ZW5jaWVzW3hdKTtcblxuXHRcdFx0XHR4ID0geCArIDQ7XG5cblx0XHRcdFx0aWYgKGkgPT0gdGhpcy5udW1iZXJPZk9jdGF2ZXMpIHtcblx0XHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5zY2FsZU5hbWUgPT0gJ2Nob3JkX3N1cycpIHtcblx0XHRcdC8vIFIsIDUsIDJcblxuXHRcdFx0dGhpcy5udW1iZXJPZk9jdGF2ZXMgPSB0aGlzLm51bWJlck9mT2N0YXZlcyAqIDM7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZk9jdGF2ZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgNTtcblxuXHRcdFx0XHR0aGlzLnNjYWxlLnB1c2goZnJlcXVlbmNpZXNbeF0pO1xuXG5cdFx0XHRcdHggPSB4ICsgMjtcblxuXHRcdFx0XHRpZiAoaSA9PSB0aGlzLm51bWJlck9mT2N0YXZlcykge1xuXHRcdFx0XHRcdHRoaXMuc2NhbGUucHVzaChmcmVxdWVuY2llc1t4XSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnNjYWxlO1xuXHR9XG59XG5cbmNsYXNzIFBsYXllciB7XG5cdGNvbnN0cnVjdG9yKHBhcmFtcykge1xuXHRcdHRoaXMubnVtYmVyT2ZCZWF0cyA9IHBhcmFtcy5udW1iZXJPZkJlYXRzO1xuXHRcdHRoaXMuc2NhbGUgPSBwYXJhbXMuc2NhbGU7XG5cdFx0dGhpcy5ub3Rlc0FycmF5ID0gW107XG5cdFx0dGhpcy5pZEFycmF5ID0gW107XG5cdFx0dGhpcy51cGRhdGVJbmRleEFycmF5ID0gdGhpcy51cGRhdGVJbmRleEFycmF5LmJpbmQodGhpcyk7XG5cdH1cblxuXHRnZW5lcmF0ZVBsYXllckFycmF5KCkge1xuXHRcdGxldCBpbmRleCA9IDA7XG5cdFx0bGV0IGNvbHVtbiA9IDA7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8PSB0aGlzLm51bWJlck9mQmVhdHM7IHgrKykge1xuXHRcdFx0Ly9jb2x1bW5zIChhbGwgdGhlIHNhbWUgaW5kZXggbnVtYmVyKVxuXHRcdFx0dGhpcy5ub3Rlc0FycmF5LnB1c2goW10pO1xuXHRcdFx0dGhpcy5pZEFycmF5LnB1c2goW10pO1xuXG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuc2NhbGUubGVuZ3RoOyB5KyspIHtcblx0XHRcdFx0Ly9yb3dzIChpbmNyZWFzZSBpbmRleCBudW1iZXIgYnkgb25lKVxuXG5cdFx0XHRcdHZhciBjb2x1bW5TdHJpbmc7XG5cdFx0XHRcdHZhciBpbmRleFN0cmluZztcblxuXHRcdFx0XHRpZiAoaW5kZXggPT0gdGhpcy5zY2FsZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRpbmRleCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29sdW1uIDwgMTApIHtcblx0XHRcdFx0XHRjb2x1bW5TdHJpbmcgPSBgMCR7Y29sdW1ufWA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29sdW1uU3RyaW5nID0gY29sdW1uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGluZGV4IDwgMTApIHtcblx0XHRcdFx0XHRpbmRleFN0cmluZyA9IGAwJHtpbmRleH1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGluZGV4U3RyaW5nID0gaW5kZXg7XG5cdFx0XHRcdH1cblxuXG5cdFx0XHRcdGxldCBhcnJheU9iamVjdCA9IHt9O1xuXHRcdFx0XHRhcnJheU9iamVjdC5pZCA9IGNvbHVtblN0cmluZysnXycraW5kZXhTdHJpbmc7XG5cdFx0XHRcdGFycmF5T2JqZWN0LmZyZXF1ZW5jeSA9IHRoaXMuc2NhbGVbaW5kZXhdO1xuXHRcdFx0XHRhcnJheU9iamVjdC50b2dnbGUgPSB0aGlzLnRvZ2dsZS5iaW5kKGFycmF5T2JqZWN0KTtcblx0XHRcdFx0YXJyYXlPYmplY3QudXBkYXRlSW5kZXhBcnJheSA9IHRoaXMudXBkYXRlSW5kZXhBcnJheTtcblx0XHRcdFx0YXJyYXlPYmplY3QueCA9IGNvbHVtbjtcblx0XHRcdFx0YXJyYXlPYmplY3QueSA9IGluZGV4O1xuXG5cdFx0XHRcdGxldCBub3RlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5pZCA9IGFycmF5T2JqZWN0LmlkO1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uaW5uZXJIVE1MID0gYXJyYXlPYmplY3QuZnJlcXVlbmN5O1xuXHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgncGxheWVyX19idXR0b24nKTtcblxuXHRcdFx0XHRhcnJheU9iamVjdC5ub3RlQnV0dG9uID0gbm90ZUJ1dHRvbjtcblxuXHRcdFx0XHR0aGlzLm5vdGVzQXJyYXlbeF1beV0gPSBhcnJheU9iamVjdDtcblx0XHRcdFx0dGhpcy5pZEFycmF5W3hdW3ldID0gMDtcblxuXHRcdFx0XHRcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Y29sdW1uKys7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB7aWRBcnJheTogdGhpcy5pZEFycmF5LCBub3Rlc0FycmF5OiB0aGlzLm5vdGVzQXJyYXl9O1xuXHR9XG5cblx0dXBkYXRlSW5kZXhBcnJheShpbmZvLCB2YWwpIHtcblx0XHR0aGlzLmlkQXJyYXlbaW5mby54XVtpbmZvLnldID0gdmFsO1xuXG5cdFx0bGV0IG9iaiA9IHt9O1xuXHRcdFx0b2JqLnggPSBpbmZvLng7XG5cdFx0XHRvYmoueSA9IGluZm8ueTtcblx0XHRcdG9iai52YWwgPSB2YWw7XG5cblx0XHRjb25zdCBvYmpUb1NlbmQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0c2VydmVyLnNlbmQob2JqVG9TZW5kKTtcblx0fVxuXG5cdHRvZ2dsZShlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0bGV0IG5vdGVCdXR0b24gPSB0aGlzLm5vdGVCdXR0b247XG5cdFx0aWYgKG5vdGVCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuXHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdHRoaXMudXBkYXRlSW5kZXhBcnJheSh0aGlzLCAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm90ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdHRoaXMudXBkYXRlSW5kZXhBcnJheSh0aGlzLCAxKTtcblx0XHR9XG5cdH1cbn1cblxudmFyIEFwcCA9IChmdW5jdGlvbihwYXJhbXMpIHtcblx0bGV0IHNoYXJlZCA9IHt9O1xuXG5cdGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG5cdFx0cm9vdE5vdGU6IGMyLFxuXHRcdHNjYWxlTmFtZTogJ3BlbnRhdG9uaWNfbWlub3InLFxuXHRcdG51bWJlck9mT2N0YXZlczogMixcblx0XHRicG06IDEwMCxcblx0XHRkdXJhdGlvbjogNixcblx0XHRzaWduYXR1cmU6IFs0LCA0XSxcblx0XHRudW1iZXJPZk9jdGF2ZXM6IDIsXG5cdH07XG5cblx0aWYgKCFwYXJhbXMpIHtcblx0XHRwYXJhbXMgPSBkZWZhdWx0UGFyYW1zO1xuXHR9IFxuXG5cdHBhcmFtcy5iZWF0cyA9IHBhcmFtcy5zaWduYXR1cmVbMF07XG5cdHBhcmFtcy5tZWFzdXJlID0gcGFyYW1zLnNpZ25hdHVyZVsxXTtcblx0cGFyYW1zLm51bWJlck9mQmVhdHMgPSBwYXJhbXMuZHVyYXRpb24qcGFyYW1zLmJlYXRzO1xuXG5cdGNvbnN0IHNjYWxlID0gbmV3IFNjYWxlKHBhcmFtcyk7XG5cblx0cGFyYW1zLnNjYWxlID0gc2NhbGUuZ2VuZXJhdGUoKTtcblxuXHRsZXQgXHRwbGF5ZXIgPSBuZXcgUGxheWVyKHBhcmFtcyk7XG5cdFx0XHRwbGF5ZXJBcnJheXMgPSBwbGF5ZXIuZ2VuZXJhdGVQbGF5ZXJBcnJheSgpO1xuXHRjb25zdCBcdG5vdGVBcnJheSA9IHBsYXllckFycmF5cy5ub3Rlc0FycmF5LFxuXHRcdFx0aWRBcnJheSA9IHBsYXllckFycmF5cy5pZEFycmF5O1xuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUGxheWVyKCkge1xuXHRcdHZhciBhcHBQbGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwUGxheWVyJyk7XG5cblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG5vdGVBcnJheS5sZW5ndGg7IHgrKykge1xuXHRcdFx0dmFyIGNvbHVtbiA9IG5vdGVBcnJheVt4XTtcblx0XHRcdFxuXHRcdFx0dmFyIHBsYXllckNvbHVtbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRwbGF5ZXJDb2x1bW4uY2xhc3NMaXN0LmFkZCgncGxheWVyX19jb2x1bW4nKTtcblxuXHRcdFx0YXBwUGxheWVyLmFwcGVuZENoaWxkKHBsYXllckNvbHVtbik7XG5cblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgY29sdW1uLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdGxldCBub3RlQnV0dG9uID0gY29sdW1uW3ldLm5vdGVCdXR0b247XG5cdFx0XHRcdFx0bm90ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNvbHVtblt5XS50b2dnbGUpO1xuXG5cdFx0XHRcdHBsYXllckNvbHVtbi5hcHBlbmRDaGlsZChub3RlQnV0dG9uKTtcblx0XHRcdH1cblxuXHRcdFx0XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdhcHBlbmQnKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBwbGF5Tm90ZXMoKSB7XG5cdFx0bGV0IHRpbWUgPSA1MDA7XG5cblx0XHRsZXQgeCA9IDA7XG5cblx0XHR2YXIgcGxheWVySW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwocGxheUNvbHVtbiwgdGltZSk7XG5cblx0XHRmdW5jdGlvbiBwbGF5Q29sdW1uKCkge1xuXHRcdFx0bGV0IGNvbHVtbnMgPSBub3RlQXJyYXlbeF07XG5cblx0XHRcdFxuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBjb2x1bW5zLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRcdGxldCBub3RlQnV0dG9uID0gY29sdW1uc1t5XS5ub3RlQnV0dG9uLFxuXHRcdFx0XHRcdGZyZXF1ZW5jeSA9IGNvbHVtbnNbeV0uZnJlcXVlbmN5O1xuXG5cdFx0XHRcdGlmIChub3RlQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRub3RlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcblx0XHRcdFx0XHR2YXIgbm90ZSA9IG5ldyBOb3RlKGZyZXF1ZW5jeSk7XG5cdFx0XHRcdFx0bm90ZS50d2Vha1N0YXJ0VGltZSgpO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG5vdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xuXHRcdFx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcdH0gXG5cdFx0XHR9XG5cblx0XHRcdHgrKztcblxuXHRcdFx0aWYgKHggPT0gcGFyYW1zLm51bWJlck9mQmVhdHMpIHtcblx0XHRcdFx0eCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRnZW5lcmF0ZVBsYXllcigpO1xuXHRcdHBsYXlOb3RlcygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlUGxheWVyKCkge1xuXG5cdH1cblxuXHRzaGFyZWQuaW5pdCA9IGluaXQ7XG5cdHJldHVybiBzaGFyZWQ7XG59KCkpOyJdfQ==
