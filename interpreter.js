/**
 * Validates the command inputted to see if it's AAA compliant
 * 
 * @param {string} instruction the instruction/command name
 * @param {array} args the arguments provided to the instruction. A blank String if none
 * @return {boolean} if the command is valid
 */
function isValidCommand(instruction, args) {
    // moveto takes in a set of points, and the last arg can be a number
    if (instruction == "moveto") {
        if (args == "") {
            return false;
        }

        var splitArgs = args.split(" ");
        for (vari = 0; i < splitArgs.length - 1; i++) {
            if (!isPoint(splitArgs[i])) {
                return false;
            }
        }

        if (isNaN(splitArgs[splitArgs.length - 1]) && !isPoint(splitArgs[splitArgs.length - 1])) {
            return false;
        }
    }

    // turn can take a number or point
    else if (instruction == "turn") {
        if (args.includes(" ")) {
            return false;
        }

        if (isNaN(args) && !isPoint(args)) {
            return false;
        }
    }

    // move and wait can take only a number
    else if (instruction == "move" || instruction == "wait") {
        if (args.includes(" ")) {
            return false;
        }

        if (isNaN(args)) {
            return false;
        }
    }

    // switch, scale, exchange, intake, and end all don't have any args
    else if (instruction == "switch" || instruction == "scale" || instruction == "exchange"
        || instruction == "intake" || instruction == "end") {
        if (args != "") {
            return false;
        }
    }

    // Jump only takes one argument
    else if (instruction == "jump") {
        if (args.includes(" ")) {
            return false;
        }
    }

    // if it's not even a valid instruction
    else {
        return false;
    }

    // if everything is all good
    return true;
}

/**
 * Helper method used by isValidCommand() to check if an argument is a point,
 * characterized by parentheses on the left and right, with two numbers
 * separated by a comma, with no whitespace in between.
 * 
 * @param {string} s the argument
 * @return {boolean} if the argument is a point
 */
function isPoint(s) {
    // checks if it starts and ends with parentheses
    if (!s.startsWith("(") || !s.endsWith(")"))
        return false;

    // checks that there's one, and only one comma (like this phrase)
    varindexOfComma = s.indexOf(',');
    varcount = 0;
    while (indexOfComma != -1) {
        count++;
        indexOfComma = s.indexOf(',', indexOfComma + 1);
    }
    if (count != 1)
        return false;

    // really ugly, but just checks if the stuff between the parentheses are numbers
    if (isNaN(s.substring(1, s.indexOf(','))) || isNaN(s.substring(s.indexOf(',') + 1, s.length - 1)))
        return false;

    return true;
}

/**
 * Parses a string representing a point to an array of length two
 * @param {string} cmdArgs the point to parse
 * @returns {array} the array representing the point
 */
function parsePoint(cmdArgs) {
    var point = []
    var parentheseless;
    var pointparts;
    if (isPoint(cmdArgs)) {
        parentheseless = cmdArgs.substring(1, cmdArgs.length - 1);
        pointparts = parentheseless.split(",");
        point.push(parseFloat(pointparts[0]))
        point.push(parseFloat(pointparts[1]))
        if (point[0] == NaN || point[1] == NaN) {
            point[0] = 1;
            point[1] = 1;
        }
    }
    return point;
}