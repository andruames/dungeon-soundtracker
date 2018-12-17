// dungeon visuals

function openHowTo() {
	var modal = document.getElementById("howToModal");
	modal.style.display = "block";

	console.log("howdy");
}

function closeHowTo() {
	var modal = document.getElementById("howToModal");
	modal.style.display = "none";
}

function openAbout() {
	var modal = document.getElementById("aboutModal");
	modal.style.display = "block";

	console.log("howdy");
}

function closeAbout() {
	var modal = document.getElementById("aboutModal");
	modal.style.display = "none";
}

function preset(rootFreq, bpm, modus, reverb, chorus) {
	var rootIn = document.getElementById("rootInput");
	var bpmIn = document.getElementById("bpmInput");
	var modeIn = document.getElementById("modeInput");
	var reverbWet = document.getElementById("reverbWet");
	var chorusWet = document.getElementById("chorusWet");

	rootIn.value = rootFreq;
	bpmIn.value = bpm;
	modeIn.value = modus;
	reverbWet.value = reverb;
	chorusWet.value = chorus;
}

window.onclick = function(event) {
	var howto = document.getElementById("howToModal");
	if (event.target == howto) {
		howto.style.display = "none";
	}
	var about = document.getElementById("aboutModal");
	if (event.target == about) {
		about.style.display = "none";
	}
}





