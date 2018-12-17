// dungeonsound.js
// the backbone of Dungeon Sountracker
// made by Andrew Ames in 2018 or 1280 or so
// for MUMT 301 at McGill University




//---------------------------------------------------------------------------------
// MAKE INSTRUMENTS AND EFFECTS
//---------------------------------------------------------------------------------

// make reverb effect
var reverb = new Tone.Reverb({
	"decay": 4
}).toMaster();
reverb.generate();

// make chorus effect
var chorus = new Tone.Chorus().toMaster();

// make bass instrument (no reverb)
var bassLute = new Tone.AMSynth({
	"harmonicity": .5,
	"envelope": {
		"decay": .5,
		"sustain": .4
	},
	"modulation": {
		"type": "sine"
	}
}).toMaster();

// make lead instrument (connected to reverb)
var leadLute = new Tone.AMSynth({
	"harmonicity": 6,
	"envelope": {
		"decay": .5,
		"sustain": .1
	},
	"modulation": {
		"type": "triangle"
	}
}).connect(reverb).connect(chorus);

// make midd instrument (connected to reverb)
var middLute = new Tone.AMSynth({
	"harmonicity": 1,
	"envelope": {
		"decay": .5,
		"sustain": .3
	},
	"modulation": {
		"type": "sine"
	}
}).connect(reverb).connect(chorus);






//---------------------------------------------------------------------------------
// HIGH LEVEL CONTROLS - START/STOP
//---------------------------------------------------------------------------------

// starts the music
function hitIt() {
	var rootFreq = rootFinder();
	var speed = bpmFinder();
	var modus = modeFinder();

	reverb.wet.value = reverbWetFinder();
	//reverb.decay.text = reverbTimeFinder();
	chorus.wet.value = chorusWetFinder();

	console.log(rootFreq,speed,modus);

	playBass(0,1,rootFreq/4, speed, modus);
	playLead(0,1,rootFreq, speed, modus);
	playMidd(0,1,rootFreq/2, speed/2, modus);

	reset = setTimeout(reseter.bind(null, rootFreq, speed, modus), speed*8+5);

	var but = document.getElementById("onOff");
	but.innerHTML = "OFF";
	but.onclick = stopIt;
}

// stops the music
function stopIt() {
	clearTimeout(onOffBass);
	clearTimeout(onOffLead);
	clearTimeout(onOffMidd);
	clearTimeout(reset);

	var but = document.getElementById("onOff");
	but.innerHTML = "ON";
	but.onclick = hitIt;
}

// restarts the instruments after 4 bars, helps with latency
function reseter(rootFreq, speed, modus) {
	console.log("Reset");

	clearTimeout(onOffBass);
	clearTimeout(onOffLead);
	clearTimeout(onOffMidd);

	playBass(0,1,rootFreq/4, speed, modus);
	playLead(0,1,rootFreq, speed, modus);
	playMidd(0,1,rootFreq/2, speed/2, modus);

	reset = setTimeout(reseter.bind(null, rootFreq, speed, modus), speed*8+5);
}






//---------------------------------------------------------------------------------
// THE MUSICIANS - PLAY THE INSTRUMENTS
//---------------------------------------------------------------------------------

function playBass(prev, oct, rootFreq, speed, modus) {
	// take the code of the note (0-6) to its key class (1st-7th)
	var numToPlay = prev + 1;
	// gives the frequency in hz of the note to play (note no octave change for bass)
	var freqToPlay = scale(rootFreq,numToPlay,modus);
	var freqToPlay = freqToPlay;
	// plays the note
	bassLute.triggerAttackRelease(freqToPlay, "8n");


	// define next note to be played
	var next = chart(prev);
	var octave = next.octave;
	var key = next.key;

	// schedules the next note
	onOffBass = setTimeout(playBass.bind(null, key, octave, rootFreq, speed, modus), speed);
}

function playLead(prev, oct, rootFreq, speed, modus) {
	// take the code of the note (0-6) to its key class (1st-7th)
	var numToPlay = prev + 1;
	// gives the frequency in hz of the note to play
	var freqToPlay = scale(rootFreq,numToPlay,modus);
	var freqToPlay = freqToPlay*oct;
	// plays the note
	leadLute.triggerAttackRelease(freqToPlay, "8n");


	// define next note to be played
	var next = chart(prev);
	var octave = next.octave;
	var key = next.key;

	// schedules the next note
	var noteTime = tempo();
	var noteTime = speed*noteTime;
	onOffLead = setTimeout(playLead.bind(null, key, octave, rootFreq, speed, modus), noteTime);
}

function playMidd(prev, oct, rootFreq, speed, modus) {
	// take the code of the note (0-6) to its key class (1st-7th)
	var numToPlay = prev + 1;
	// gives the frequency in hz of the note to play
	var freqToPlay = scale(rootFreq,numToPlay,modus);
	var freqToPlay = freqToPlay*oct;
	// plays the note
	middLute.triggerAttackRelease(freqToPlay, "8n");


	// define next note to be played
	var next = chart(prev);
	var octave = next.octave;
	var key = next.key;

	// schedules the next note
	onOffMidd = setTimeout(playMidd.bind(null, key, octave, rootFreq, speed, modus), speed);
}






//---------------------------------------------------------------------------------
// CHARTS - MUSICIANS READ THE CHARTS AND GET KEY, TIMING
//---------------------------------------------------------------------------------

// randomizes the note length, gives quarter, 8th, and 16th notes
function tempo() {
	var rand = getRandom(4)

	switch (rand) {
		case 0: var x = 1/4;
			break;
		case 1: var x = 1/2;
			break;
		case 2: var x = 1/2;
			break;
		case 3: var x = 1;
			break;
	}

	return x;
}

// takes previous note code and gives next note code via getRandom
function chart(noteIn) {
	var rand = getRandom(8);
	
	// takes random and outputs the interval (up n keys)
	switch (rand) {
		case 0: var plus = 0;
			break;
		case 1: var plus = 1;
			break;
		case 2: var plus = 2;
			break;
		case 3: var plus = 3;
			break;
		case 4: var plus = 4;
			break;
		case 5: var plus = 4;
			break;
		case 6: var plus = 5;
			break;
		case 7: var plus = 7;
			break;
		default: var plus = 0;
			break;
	}

	// gives next note + octave to be played
	var noteOut = noteIn+plus;
	
	// checks octave changes
	if (noteOut >= 7) {var octave = 2}
	else {var octave = 1}
	
	// normalizes key class
	var noteOut = noteOut % 7;

	return {
		octave: octave,
		key: noteOut
	};
}

// recieves key class (1st to 7th) and gives freq in hz
function scale(root, numNote, modus) {
	switch (modus) {
		case 1: var harmony = dorian(numNote);
			break;
		case 3: var harmony = phrygian(numNote);
			break;
		case 5: var harmony = lydian(numNote);
			break;
		case 7: var harmony = mixolydian(numNote);
			break;
		default: var harmony = 2;
	}

	var freqNote = root*harmony;
	return freqNote;
}





//---------------------------------------------------------------------------------
// MODE CHARTS
//---------------------------------------------------------------------------------

function dorian(numNote) {
	switch (numNote) {
		case 1: var harmony = 1;
			break;
		case 2: var harmony = 9/8;
			break;
		case 3: var harmony = 6/5;
			break;
		case 4: var harmony = 4/3;
			break;
		case 5: var harmony = 3/2;
			break;
		case 6: var harmony = 5/3;
			break;
		case 7: var harmony = 9/5;
			break;
		default: var harmony = 2
	}

	return harmony;
}

function phrygian(numNote) {
	switch (numNote) {
		case 1: var harmony = 1;
			break;
		case 2: var harmony = 16/15;
			break;
		case 3: var harmony = 6/5;
			break;
		case 4: var harmony = 4/3;
			break;
		case 5: var harmony = 3/2;
			break;
		case 6: var harmony = 8/5;
			break;
		case 7: var harmony = 9/5;
			break;
		default: var harmony = 2
	}

	return harmony;
}

function lydian(numNote) {
	switch (numNote) {
		case 1: var harmony = 1;
			break;
		case 2: var harmony = 9/8;
			break;
		case 3: var harmony = 5/4;
			break;
		case 4: var harmony = 4/3;
			break;
		case 5: var harmony = 3/2;
			break;
		case 6: var harmony = 5/3;
			break;
		case 7: var harmony = 15/18;
			break;
		default: var harmony = 2
	}

	return harmony;
}

function mixolydian(numNote) {
	switch (numNote) {
		case 1: var harmony = 1;
			break;
		case 2: var harmony = 9/8;
			break;
		case 3: var harmony = 5/4;
			break;
		case 4: var harmony = 4/3;
			break;
		case 5: var harmony = 3/2;
			break;
		case 6: var harmony = 5/3;
			break;
		case 7: var harmony = 9/5;
			break;
		default: var harmony = 2
	}

	return harmony;
}







//---------------------------------------------------------------------------------
// UTILITY + CONTROLS
//---------------------------------------------------------------------------------

// generates a random integer 0 to n-1
function getRandom(n) {
	var x = Math.random();
	var x = x*n;
	var x = Math.floor(x);
	return x;
}

// manages user root frequency input
function rootFinder() {
	var freq = document.getElementById("rootInput").value;
	var freq = parseFloat(freq);
	return freq;
}

// takes user beats per minute input, gives milliseconds between notes
function bpmFinder() {
	var bpm = document.getElementById("bpmInput").value;
	var bpm = parseFloat(bpm);
	var ms = (60/bpm)*1000;
	return ms;
}

// gregorian mode
function modeFinder() {
	var greg = document.getElementById("modeInput").value;
	var greg = parseInt(greg);
	return greg;
}

// read effects
function reverbWetFinder() {
	var x = document.getElementById("reverbWet").value;
	var x = parseInt(x);
	var x = x/10;
	console.log("reverb wet:"+x);
	return x;
}
function reverbTimeFinder() {
	var x = document.getElementById("reverbTime").value;
	var x = parseInt(x);
	var x = x/2;
	console.log("reverb decay:"+x);
	return x;
}
function chorusWetFinder() {
	var x = document.getElementById("chorusWet").value;
	var x = parseInt(x);
	var x = x/10;
	console.log("chorus wet:"+x);
	return x;
}









