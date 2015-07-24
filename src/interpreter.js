/**
 * Our grammar:
 * program -> [action]
 * action -> "repeat" nat nat | "print" nat nat
 */

const REPEAT = 'repeat';
const PRINT = 'print';
const REVERSE = 'reverse';
const parsers = {};
parsers[PRINT] = function (symbols) {
    var printT = symbols[0];
    var a = parseWhole(symbols[1]);
    if (printT === PRINT && !isNaN(a) && symbols.length === 2) {
        return {
            t: printT,
            a: a,
        };
    }
};
parsers[REPEAT] = function (symbols) {
    var repeatT = symbols[0];
    var a = parseWhole(symbols[1]);
    var b = parseNat(symbols[2]);
    if (repeatT === REPEAT && !isNaN(a) && !isNaN(b) && symbols.length === 3) {
        return {
            t: repeatT,
            a: a,
            b: b,
        };
    }
};
parsers[REVERSE] = function (symbols) {
    var reverseT = symbols[0];
    if (reverseT === REVERSE && symbols.length === 1) {
        return {
            t: reverseT,
        };
    }
}

function parse (input, instructionSet) {
    var lines = input.split(/[\n]/).filter(nonempty);
    var parseLine = getParser(instructionSet);
    return lines.map(parseLine);
}

function getParser (instructionSet) {
    return function (line, i) {
        var symbols = line.split(' ').filter(nonempty);
        var token;
        var success = instructionSet.some(function (instruction) {
            var instructionParser = parsers[instruction];
            if (token = instructionParser(symbols))
                return true;
        });
        if (!success)
            throw new Error('Invalid line: ' + (i+1));
        return token;
    }
}

function parseWhole (str) {
    if(/^[0-9]+$/.test(str)) {
        return Number(str);
    }
    return NaN;
}

function parseNat (str) {
    var whole = parseWhole(str);
    return whole === 0 ? NaN : whole;
}

function stringify (instruction) {
    if (instruction) {
        return Object.keys(instruction).map(function (k) {
            return instruction[k];
        }).join(' ');
    } else {
        return '';
    }
}

function nonempty (str) {
    return str.length !== 0;
}

function run (program) {
    return runHelper(program, []);
}

function runHelper (program, outputLines) {
    if (program.length === 0) {
        return outputLines.filter(nonempty).join('\n');
    }
    var instruction = program.shift();
    if (instruction.t === PRINT) {
        var printLines = program.splice(0, instruction.a).map(stringify);
        return runHelper(program, outputLines.concat(printLines));
    } else if (instruction.t === REPEAT) {
        if (outputLines.length > 0) {
            var start = Math.max(outputLines.length - instruction.b, 0);
            var end = start + instruction.a;
            for (var i = start; i < end; i++) {
                outputLines.push(outputLines[i]);
            }
        }
        return runHelper(program, outputLines);
    } else if (instruction.t === REVERSE) {
        return runHelper(program, outputLines.reverse());
    }
}

// main module object
var Interpreter = {
    parse: parse,
    run: run,
    PRINT: PRINT,
    REPEAT: REPEAT,
    REVERSE: REVERSE,
};

// browser/nodejs compat
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Interpreter;
    }
    exports.Interpreter = Interpreter;
} else {
    window['Interpreter'] = Interpreter;
}
