var blue = "dodgerblue"
var red = "red"

var updateArena = true;
var fms = "LLL";
var pos = "left"
var alColor = blue
var opColor = red

var script = [];

var validScript = false;
var running = false;

var cmdCount = 0;
var currCmd = null;

var scaleFactor = 1

var two;

$(function () {
	document.getElementById("script-input").placeholder = "Instructions on running this visualizer:"
		+ "\n\n1) Paste the script inside this text box."
		+ "\n\n2) Press Validate button to make sure it's valid syntax."
		+ "\n\n3) Press Run to run the entire script or Step to run one line. (Step 2 required)"
		+ "\n\n4) While it's running, press Stop to pause the script, or Reset to restart the script."
		+ "\n\n5) Click on this text box again to modify script."

	// get data from before refresh
	if (typeof (sessionStorage.scriptInput) !== "undefined") {
		document.getElementById("script-input").value = sessionStorage.scriptInput;
	}
	if (typeof (sessionStorage.fms) !== "undefined") {
		document.getElementById("fms").value = fms = sessionStorage.fms
	}
	if (typeof (sessionStorage.pos) !== "undefined") {
		pos = sessionStorage.pos
		document.getElementById(sessionStorage.pos).checked = true
	}
	if (typeof (sessionStorage.alColor) !== "undefined") {
		document.getElementById(sessionStorage.alColor).checked = true
		if (sessionStorage.alColor == "blue") {
			alColor = blue
			opColor = red
		} else {
			alColor = red
			opColor = blue
		}
	}


	var elem = document.getElementById("draw-area")

	var params = { width: 27 * 12 * scaleFactor, height: 54 * 12 * scaleFactor }
	two = new Two(params).appendTo(elem)

	var arenaThickness = 3;

	var arena = two.makeGroup()
	var bot = two.makeGroup()
	var botCube;

	var moveSpeed = 1
	var turnSpeed = Math.PI / 120

	var strayCubes = [];

	two.bind("update", function (frameCount) {
		if (updateArena) {
			two.remove(arena, bot)
			two.remove(strayCubes)
			makeEverything(two, scaleFactor, arenaThickness, pos)
			updateArena = false;
		}

		if (running) {
			if (currCmd == null) {
				if (cmdCount < script.length) {
					switch (script[cmdCount]["cmd"][0]) {
						case "move":
							currCmd = new Move(script[cmdCount]["cmd"][1], bot, two)
							break
						case "turn":
							currCmd = new Turn(script[cmdCount]["cmd"][1], bot, two)
							break
						case "switch": case "scale": case "exchange":
							currCmd = new Eject(script[cmdCount]["cmd"][1], bot, two, botCube)
							strayCubes.push(currCmd.dropCube())
							break;
						case "intake":
							currCmd = new Intake(script[cmdCount]["cmd"][1], bot, two)
							botCube = currCmd.getCube()
							break;
						case "wait":
							currCmd = new Wait(script[cmdCount]["cmd"][1], bot, two)
							break;
						case "end":
							running = false;
							break;
						default:
							console.log("idk what this is: " + script[cmdCount]["cmd"][0])
					}

					document.getElementById("line" + script[cmdCount]["line"]).classList.add("curr-line")
				} else {
					running = false;
				}
			}

			if (running) { // just to make sure it's still running
				if (!currCmd.isFinished()) {
					currCmd.execute()
				} else {
					document.getElementById("line" + (script[cmdCount]["line"])).classList.remove("curr-line")
					cmdCount++
					currCmd = null;
					console.log("finished one cmd")
					if (cmdCount >= script.length) {
						console.log("done")
						running = false;
					}
				}
			}
		}

	}).play()

	function makeEverything(two, scaleFactor, arenaThickness, pos) {
		arena = makeArena(two, scaleFactor, arenaThickness)
		bot = makeBot(two, scaleFactor, arenaThickness, pos)
		botCube = makeInitCube(two, scaleFactor, bot)
		bot.add(botCube)
	}

	function makeArena(two, scaleFactor, arenaThickness) {
		var arena = two.makeGroup()
		var al = two.makeGroup();
		var op = two.makeGroup();
		var neutral = two.makeGroup();
		var cubes = two.makeGroup();

		// auto lines
		var opLine = two.makeLine(0, 120 * scaleFactor, two.width, 120 * scaleFactor)
		var alLine = two.makeLine(0, two.height - 120 * scaleFactor, two.width, two.height - 120 * scaleFactor)

		var padding = arenaThickness / 2;
		// make the borders
		var opBorder = two.makePath(
			padding, two.height / 2,
			padding, 35 * scaleFactor,
			30 * scaleFactor, padding,
			two.width - (30 * scaleFactor), padding,
			two.width - padding, 35 * scaleFactor,
			two.width - padding, two.height / 2,
			true
		);
		var alBorder = opBorder.clone();
		alBorder.translation.set(two.width / 2, 3 / 4 * two.height);
		alBorder.rotation = Math.PI;

		// make the switches and scale
		var opSwitch = two.makeRectangle(two.width / 2, 168 * scaleFactor, 146 * scaleFactor, 52 * scaleFactor);
		var alSwitch = opSwitch.clone();
		alSwitch.translation.set(two.width / 2, two.height - 168 * scaleFactor);
		var scale = two.makeRectangle(two.width / 2, two.height / 2, 117 * scaleFactor, 12 * scaleFactor);
		var switchX = two.width / 2 - (150 / 2 - 4 - 36 / 2) * scaleFactor;
		var scaleX = two.width / 2 - (102 / 2 + 36 / 2) * scaleFactor;
		var opLeftSw = two.makeRectangle(switchX, 168 * scaleFactor, 35 * scaleFactor, 46 * scaleFactor);
		var opRightSw = opLeftSw.clone();
		opRightSw.translation.set(two.width - switchX, 168 * scaleFactor);
		var alLeftSw = opLeftSw.clone();
		alLeftSw.translation.set(switchX, two.height - 168 * scaleFactor);
		var alRightSw = opLeftSw.clone();
		alRightSw.translation.set(two.width - switchX, two.height - 168 * scaleFactor);
		var leftSc = opLeftSw.clone();
		leftSc.translation.set(scaleX, two.height / 2);
		var rightSc = opLeftSw.clone();
		rightSc.translation.set(two.width - scaleX, two.height / 2);

		// cubes!!!
		var cubeSize = 12;
		var cube1 = two.makeRectangle(two.width / 2, (168 - 28 - cubeSize * 2.5) * scaleFactor - 2, cubeSize * scaleFactor, cubeSize * scaleFactor);
		var cube2 = cube1.clone();
		cube2.translation.set(two.width / 2 - cubeSize / 2 * scaleFactor, (168 - 28 - cubeSize * 1.5) * scaleFactor - 2);
		var cube3 = cube1.clone();
		cube3.translation.set(two.width / 2 + cubeSize / 2 * scaleFactor, (168 - 28 - cubeSize * 1.5) * scaleFactor - 2);
		var cube4 = cube1.clone();
		cube4.translation.set(two.width / 2 - cubeSize * scaleFactor, (168 - 28 - cubeSize * 0.5) * scaleFactor - 2);
		var cube5 = cube1.clone();
		cube5.translation.set(two.width / 2, (168 - 28 - cubeSize * 0.5) * scaleFactor - 2);
		var cube6 = cube1.clone();
		cube6.translation.set(two.width / 2 + cubeSize * scaleFactor, (168 - 28 - cubeSize * 0.5) * scaleFactor - 2);
		var cube7 = cube1.clone();
		cube7.translation.set(two.width / 2 - 72 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var cube8 = cube1.clone();
		cube8.translation.set(two.width / 2 - 43 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var cube9 = cube1.clone();
		cube9.translation.set(two.width / 2 - 14 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var cube10 = cube1.clone();
		cube10.translation.set(two.width / 2 + 72 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var cube11 = cube1.clone();
		cube11.translation.set(two.width / 2 + 43 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var cube12 = cube1.clone();
		cube12.translation.set(two.width / 2 + 14 * scaleFactor, (168 + 28 + cubeSize * 0.5 + 2) * scaleFactor);
		var opCubes = two.makeGroup(cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10, cube11, cube12);
		var cube13 = cube1.clone();
		cube13.translation.set(two.width / 2, two.height - ((168 - 28 - cubeSize * 2.5) * scaleFactor - 2));
		var cube14 = cube1.clone();
		cube14.translation.set(two.width / 2 - cubeSize / 2 * scaleFactor, two.height - ((168 - 28 - cubeSize * 1.5) * scaleFactor - 2));
		var cube15 = cube1.clone();
		cube15.translation.set(two.width / 2 + cubeSize / 2 * scaleFactor, two.height - ((168 - 28 - cubeSize * 1.5) * scaleFactor - 2));
		var cube16 = cube1.clone();
		cube16.translation.set(two.width / 2 - cubeSize * scaleFactor, two.height - ((168 - 28 - cubeSize * 0.5) * scaleFactor - 2));
		var cube17 = cube1.clone();
		cube17.translation.set(two.width / 2, two.height - ((168 - 28 - cubeSize * 0.5) * scaleFactor - 2));
		var cube18 = cube1.clone();
		cube18.translation.set(two.width / 2 + cubeSize * scaleFactor, two.height - ((168 - 28 - cubeSize * 0.5) * scaleFactor - 2));
		var cube19 = cube1.clone();
		cube19.translation.set(two.width / 2 - 72 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));
		var cube20 = cube1.clone();
		cube20.translation.set(two.width / 2 - 43 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));
		var cube21 = cube1.clone();
		cube21.translation.set(two.width / 2 - 14 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));
		var cube22 = cube1.clone();
		cube22.translation.set(two.width / 2 + 72 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));
		var cube23 = cube1.clone();
		cube23.translation.set(two.width / 2 + 43 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));
		var cube24 = cube1.clone();
		cube24.translation.set(two.width / 2 + 14 * scaleFactor, two.height - ((168 + 28 + cubeSize * 0.5 + 2) * scaleFactor));

		//exchanges
		var opExchZone = two.makeRectangle(two.width - (30 + 72 + 24) * scaleFactor, 18 * scaleFactor + arenaThickness, 48 * scaleFactor, 36 * scaleFactor)
		var alExchZone = opExchZone.clone()
		alExchZone.translation.set((30 + 72 + 24) * scaleFactor, two.height - (18 * scaleFactor + arenaThickness))

		var opExchange = two.makeRectangle(two.width - (30 + 92 + 21 / 2) * scaleFactor, 6.5 / 2 * scaleFactor + arenaThickness, 21 * scaleFactor, 6.5 * scaleFactor)
		var alExchange = opExchange.clone()
		alExchange.translation.set((30 + 92 + 21 / 2) * scaleFactor, two.height - (6.5 / 2 * scaleFactor + arenaThickness))

		// finally set things up
		neutral.add(opSwitch, alSwitch, scale, alLine, opLine);
		cubes.add(cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10, cube11, cube12, cube13, cube14, cube15, cube16, cube17, cube18, cube19, cube20, cube21, cube22, cube23, cube24);
		al.add(alBorder, alExchZone, alExchange);
		op.add(opBorder, opExchZone, opExchange);

		if (fms == "")
			fms = "LLL"

		if (fms.charAt(0) == "L") {
			al.add(alLeftSw)
			op.add(alRightSw)
		} else {
			al.add(alRightSw)
			op.add(alLeftSw)
		}

		if (fms.charAt(1) == "L") {
			al.add(leftSc)
			op.add(rightSc)
		} else {
			al.add(rightSc)
			op.add(leftSc)
		}

		if (fms.charAt(2) == "L") {
			al.add(opLeftSw)
			op.add(opRightSw)
		} else {
			al.add(opRightSw)
			op.add(opLeftSw)
		}


		arena.add(al, op, neutral);
		cubes.linewidth = 1.5;
		cubes.stroke = "gold";
		cubes.fill = "yellow";
		arena.noFill();
		al.stroke = alColor;
		op.stroke = opColor;
		neutral.stroke = "grey";
		arena.linewidth = arenaThickness;
		alExchange.fill = al.stroke
		opExchange.fill = op.stroke
		return arena;
	}

	function makeBot(two, scaleFactor, arenaThickness, pos) {
		var frame = two.makeRectangle(0, 0, 28 * scaleFactor, 33 * scaleFactor)

		var transX;
		var transY;
		switch (pos) {
			case "left":
				transX = (30 + 28 / 2) * scaleFactor + arenaThickness
				transY = two.height - (33 / 2) * scaleFactor - arenaThickness
				break;
			case "center":
				transX = (30 + 72 + 48 + 28 / 2) * scaleFactor + arenaThickness
				transY = two.height - (33 / 2) * scaleFactor - arenaThickness
				break
			case "right":
				transX = two.width - (30 + 28 / 2) * scaleFactor - arenaThickness
				transY = two.height - (33 / 2) * scaleFactor - arenaThickness
				break
			default:
				transX = transy = 0;
		}

		var bot = two.makeGroup(frame)

		bot.translation.set(transX, transY)
		bot.originX = transX
		bot.originY = transY

		frame.stroke = alColor
		frame.fill = "white"
		frame.linewidth = 6

		return bot
	}

	document.getElementById("script-input").addEventListener("keyup", function () {
		// store stuff between reloads
		sessionStorage.scriptInput = document.getElementById("script-input").value;
	})

	document.getElementById("fms").addEventListener("keyup", function () {
		var currInput = document.getElementById("fms").value
		if (currInput == "") {
			fms = "LLL"
		} else if (isValidFMS(currInput)) {
			fms = currInput
		} else {
			document.getElementById("fms").style.backgroundColor = "#ff8888"
			return
		}

		sessionStorage.fms = fms
		document.getElementById("fms").style.backgroundColor = "initial"
		updateArena = true
	})
})

var cubeSize = 12;
function makeCube(two, x, y) {
	var cube = two.makeRectangle(x, y, cubeSize * scaleFactor, cubeSize * scaleFactor);
	cube.linewidth = 1.5;
	cube.stroke = "gold";
	cube.fill = "yellow";
	return cube;
}

function makeInitCube(two, bot) {
	return makeCube(two, 0, - (33 + 12) / 2 * scaleFactor)
}

// TABS YESSSSS
$(document).delegate('#script-input', 'keydown', function (e) {
	var keyCode = e.keyCode || e.which;

	if (keyCode == 9) {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;

		// set textarea value to: text before caret + tab + text after caret
		$(this).val($(this).val().substring(0, start)
			+ "\t"
			+ $(this).val().substring(end));

		// put caret at right position again
		this.selectionStart =
			this.selectionEnd = start + 1;
	}
});

/* Set the width of the side navigation to 250px */
function openNav() {
	document.getElementById("mySidenav").style.left = "0";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
	document.getElementById("mySidenav").style.left = "-350px";
}

function runButton() {
	if (validScript) {
		running = true;
	}
}

function stopButton() {
	running = false
}

function resetButton() {
	updateArena = true;
	cmdCount = 0
	currCmd = null
	running = false

}

function validateButton() {
	resetButton()
	running = false;
	document.getElementById("script-display").innerHTML = ""
	document.getElementById("script-display").style.display = "block"
	document.getElementById("script-input").style.display = "none"
	script = parseScript(document.getElementById("script-input").value)
}

function hideDisplay() {
	document.getElementById("script-display").style.display = "none"
	document.getElementById("script-input").style.display = "block"
	unValidated()
}

function isValidFMS(input) {
	if (input.length != 3) {
		return false;
	}

	for (var i = 0; i < input.length; i++) {
		if (input.charAt(i) != "L" && input.charAt(i) != "R") {
			return false;
		}
	}

	return true;
}

function setStartPos(radio) {
	sessionStorage.pos = pos = radio.value
	updateArena = true
}

function setAlliance(radio) {
	sessionStorage.alColor = radio.value
	if (radio.value == "blue") {
		alColor = blue
		opColor = red
	} else {
		alColor = red
		opColor = blue
	}
	updateArena = true
}

function displayValidated(instruction, args, valid, line) {
	var display = document.getElementById("script-display")

	// console.log("instruction = " + instruction + ", args = " + args)

	var currLine;

	if (valid) {
		var className;
		switch (instruction) {
			case "move":
			case "moveto":
			case "turn":
			case "wait":
				className = "move"
				break
			case "exchange":
			case "intake":
			case "scale":
			case "switch":
				className = "action"
				break
			case "end":
				className = "misc"
				break
			default:
				className = ""
				break
		}
		currLine = "<span class=\"" + className + "\">" + instruction + "</span> "

		args = addSpans(args, "(", "parentheses")
		args = addSpans(args, ")", "parentheses")
		args = addSpans(args, ",", "comma")

		currLine += args
	} else {
		currLine = "<span class=\"invalid\">" + instruction + " " + args + "</span>"
	}

	currLine = "<span id=\"line" + line + "\">" + currLine + "</span>"

	if (display.innerHTML == "") {
		document.getElementById("script-display").innerHTML = currLine
	} else {
		document.getElementById("script-display").innerHTML += "<br />" + currLine
	}
}

function addSpans(string, toFind, className) {
	var next = string.indexOf(toFind)

	while (next != -1) {
		var replace = "<span class=\"" + className + "\">" + string.substring(next, next + 1) + "</span>"
		string = string.substring(0, next) + replace + string.substring(next + 1)

		next = string.indexOf(toFind, next + replace.length)
	}

	return string
}

var validateDependent = ["run", "stop", "reset"]

var buttonColors = {
	"validate": "cyan",
	"run": "lightgreen",
	"stop": "red",
	"reset": "dodgerblue"
}

function validated() {
	for (var i = 0; i < validateDependent.length; i++) {
		var button = document.getElementById(validateDependent[i] + "-button")
		button.style.color = "white"
		button.style.borderColor = buttonColors[validateDependent[i]]
	}
	validScript = true;
}

function unValidated() {
	for (var i = 0; i < validateDependent.length; i++) {
		var button = document.getElementById(validateDependent[i] + "-button")
		button.style.color = "grey"
		button.style.borderColor = "grey"
	}
	validScript = false;
}

function rel2RawX(x) {
	return x
}
function rel2RawY(y) {
	return two.height - y
}