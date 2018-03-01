var updateArena = true;
var fms = "LLL";
var pos = "left"
var alColor = "dodgerblue"
var opColor = "red"

$(function () {
	document.getElementById("script-input").placeholder = "Instructions on running this visualizer:"
		+ "\n\n1) Paste the script inside this text box."
		+ "\n\n2) Press Validate button to make sure it's valid syntax."
		+ "\n\n3) Press Run to run the entire script or Step to run one line. (Step 2 required)"
		+ "\n\n4) While it's running, press Stop to pause the script, or Reset to restart the script."
		+ "\n\n5) Click on this text box again to modify script."

	if (typeof (sessionStorage.scriptInput) !== "undefined") {
		document.getElementById("script-input").value = sessionStorage.scriptInput;
	}

	var elem = document.getElementById("draw-area")
	var scaleFactor = 1
	var params = { width: 27 * 12 * scaleFactor, height: 54 * 12 * scaleFactor }
	var two = new Two(params).appendTo(elem)

	var arenaThickness = 3;

	var arena = two.makeGroup()
	var bot = makeBot(two, scaleFactor, arenaThickness, pos)

	var moveSpeed = 1
	var turnSpeed = Math.PI / 120

	two.bind("update", function (frameCount) {
		if (updateArena) {
			arena.remove()
			bot.remove()
			arena = makeArena(two, scaleFactor, arenaThickness)
			bot = makeBot(two, scaleFactor, arenaThickness, pos)
			updateArena = false;
		}


	}).play()


	function moveFwd(bot, speed) {
		var dx = Math.sin(bot.rotation) * speed
		var dy = - Math.cos(bot.rotation) * speed
		bot.translation.x += dx
		bot.translation.y += dy
	}

	function turn(bot, speed) {
		bot.rotation += speed
	}

	function makeArena(two, scaleFactor, arenaThickness) {
		var arena = two.makeGroup()
		var al = two.makeGroup();
		var op = two.makeGroup();
		var neutral = two.makeGroup();
		var cubes = two.makeGroup();

		// make the borders
		var opBorder = two.makePath(
			arenaThickness, two.height / 2,
			arenaThickness, 35 * scaleFactor,
			30 * scaleFactor, arenaThickness,
			two.width - (30 * scaleFactor), arenaThickness,
			two.width - arenaThickness, 35 * scaleFactor,
			two.width - arenaThickness, two.height / 2,
			true
		);
		var alBorder = opBorder.clone();
		alBorder.translation.set(two.width / 2, 3 / 4 * two.height);
		alBorder.rotation = Math.PI;

		// make the switches and scale
		var opSwitch = two.makeRectangle(two.width / 2, 168 * scaleFactor, 153.5 * scaleFactor, 56 * scaleFactor);
		var alSwitch = opSwitch.clone();
		alSwitch.translation.set(two.width / 2, two.height - 168 * scaleFactor);
		var scale = two.makeRectangle(two.width / 2, two.height / 2, 117 * scaleFactor, 12 * scaleFactor);
		var switchX = two.width / 2 - (153.5 / 2 - 4 - 36 / 2) * scaleFactor;
		var scaleX = two.width / 2 - (108 / 2 + 36 / 2) * scaleFactor;
		var opLeftSw = two.makeRectangle(switchX, 168 * scaleFactor, 36 * scaleFactor, 48 * scaleFactor);
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

		neutral.add(opSwitch, alSwitch, scale);
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

		var bot = two.makeGroup(frame)
		switch (pos) {
			case "left":
				bot.translation.set((30 + 28 / 2) * scaleFactor + arenaThickness, two.height - (33 / 2) * scaleFactor - arenaThickness)
				break;
			case "center":
				bot.translation.set((30 + 72 + 48 + 28 / 2) * scaleFactor + arenaThickness, two.height - (33 / 2) * scaleFactor - arenaThickness)
				break
			case "right":
				bot.translation.set(two.width - (30 + 28 / 2) * scaleFactor - arenaThickness, two.height - (33 / 2) * scaleFactor - arenaThickness)
				break
			default:
				break;
		}

		bot.stroke = alColor
		bot.fill = "white"
		bot.linewidth = 6

		return bot
	}

	document.getElementById("script-input").addEventListener("keyup", function () {
		// store stuff between reloads
		sessionStorage.scriptInput = document.getElementById("script-input").value;

		// typed text no wrap, placeholder yes
		if (document.getElementById("script-input").value == "") {
			document.getElementById("script-input").style.whiteSpace = "pre-line"
		} else {
			document.getElementById("script-input").style.whiteSpace = "pre"
		}
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

		document.getElementById("fms").style.backgroundColor = "initial"
		updateArena = true
	})
})

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
	console.log("run button pressed")
}

function stopButton() {

}

function stepButton() {

}

function backButton() {

}

function resetButton() {

}

function validateButton() {
	document.getElementById("script-display").style.display = "block"
	document.getElementById("script-input").style.display = "none"
}

function hideDisplay() {
	document.getElementById("script-display").style.display = "none"
	document.getElementById("script-input").style.display = "block"
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
	pos = radio.value
	updateArena = true
}

function setAlliance(radio) {
	if (radio.value == "blue") {
		alColor = "dodgerblue"
		opColor = "red"
	} else {
		alColor = "red"
		opColor = "dodgerblue"
	}
	updateArena = true
}