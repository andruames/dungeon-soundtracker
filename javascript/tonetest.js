// tone.js testing

//

// set bpm + Compressor
Tone.Transport.bpm.value = 80;
var comp = new Tone.Compressor(-40, 3).toMaster();

// make instrumet
var metalic = new Tone.MetalSynth({
	"harmonicity" : 0.01,
	"modulationIndex": 12
}).toMaster();

function strike(n) {
	metalic.frequency.value = n;
	metalic.triggerAttackRelease();
}

// make effects
var delay = new Tone.FeedbackDelay("4n", 0.5).toMaster();


// effect controls
function delayOnOff() {
	var btn = document.getElementById("delaySwitch");

	if (btn.innerHTML === "Turn Delay On") {
		metalic.connect(delay);
		btn.innerHTML = "Turn Delay Off";
	}

	else {
		metalic.disconnect(delay);
		btn.innerHTML = "Turn Delay On"; 
	}
}


// change colors when notes are played

window.addEventListener("keydown", colorUp, false);
window.addEventListener("keyup", colorDown, false);

function colorUp(e) {
	var box = document.getElementById("keys");

	box.style.color = "white";
}

function colorDown(e) {
	var box = document.getElementById("keys");

	box.style.color = "blue";
}

// play notes on key press
window.addEventListener("keydown", mallet, false);

function mallet(e) {
	if (e.keyCode == "65") {
		strike(10);
	}
	else if (e.keyCode == "83") {
		strike(15);
	}
	else if (e.keyCode == "68") {
		strike(20);
	}
	else if (e.keyCode == "70") {
		strike(40);
	}
	else if (e.keyCode == "71") {
		strike(80);
	}
	else if (e.keyCode == "72") {
		strike(100);
	}
	else if (e.keyCode == "74") {
		strike(960);
	}
	else if (e.keyCode == "75") {
		strike(1280);
	}
	else if (e.keyCode == "76") {
		strike(1360);
	}
}










