// dungeonsound.js
// the backbone of Dungeon Sountracker

var bassLute = new Tone.Synth().toMaster();
var leadLute = new Tone.Synth().toMaster();

// starts the music
function hitIt() {
	playBass(0,1);
	playLead(0,1);
}

// stops the music
function stopIt() {
	clearTimeout(onOffBass);
	clearTimeout(onOffLead);
}

// does all the stuff
function playBass(prev, oct) {
	// take the code of the note (0-6) to its key class (1st-7th)
	var numToPlay = prev + 1;
	// gives the frequency in hz of the note to play (note no octave change for bass)
	var freqToPlay = scale(150,numToPlay);
	var freqToPlay = freqToPlay;
	console.log(freqToPlay);
	// plays the note
	bassLute.triggerAttackRelease(freqToPlay, "8n");


	// define next note to be played
	var next = chart(prev);
	var octave = next.octave;
	var key = next.key;

	// schedules the next note
	onOffBass = setTimeout(playBass.bind(null, key, octave), 1200);
}

function playLead(prev, oct) {
	// take the code of the note (0-6) to its key class (1st-7th)
	var numToPlay = prev + 1;
	// gives the frequency in hz of the note to play
	var freqToPlay = scale(300,numToPlay);
	var freqToPlay = freqToPlay*oct;
	console.log(freqToPlay);
	// plays the note
	leadLute.triggerAttackRelease(freqToPlay, "8n");


	// define next note to be played
	var next = chart(prev);
	var octave = next.octave;
	var key = next.key;

	// schedules the next note
	onOffLead = setTimeout(playLead.bind(null, key, octave), 400);
}

// recieves key class (1st to 7th) and gives freq in hz
function scale(root, numNote) {
	if (numNote == 1) {var harmony = 1}
	else if (numNote == 2) {var harmony = 9/8}
	else if (numNote == 3) {var harmony = 5/4}
	else if (numNote == 4) {var harmony = 4/3}
	else if (numNote == 5) {var harmony = 3/2}
	else if (numNote == 6) {var harmony = 5/3}
	else if (numNote == 7) {var harmony = 15/8}
	else {console.log("invalid scale input, check playBass")}

	var freqNote = root*harmony;
	return freqNote;
}

// takes previous note code and gives next note code via getRandom
function chart(noteIn) {
	var rand = getRandom();
	
	// takes random and outputs the interval
	if (rand == 0 || rand == 1) {var plus = 0}
	else if (rand == 2) {var plus = 1}
	else if (rand == 3) {var plus = 2}
	else if (rand == 4) {var plus = 3}
	else if (rand == 5 || rand == 6) {var plus = 4}
	else if (rand == 7) {var plus = 5}
	else {console.log("invalid chart input, check getRandom")}

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

// generates a random integer 0 to 7
function getRandom() {
	var x = Math.random();
	var x = x*8;
	var x = Math.floor(x);
	return x;
}























