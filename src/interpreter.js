/**
 * Our grammar:
 * program -> [action]
 * action -> "repeat" nat nat | "print" nat nat
 */

const REPEAT = 'repeat';
const PRINT = 'print';
const REVERSE = 'reverse';
const parsers = {};
parsers[PRINT] = (symbols) => {
    const printT = symbols[0];
    const a = parseWhole(symbols[1]);
    if (printT === PRINT && !isNaN(a) && symbols.length === 2) {
        return {
            t: printT,
            a: a,
        };
    }
};
parsers[REPEAT] = (symbols) => {
    const repeatT = symbols[0];
    const a = parseWhole(symbols[1]);
    const b = parseNat(symbols[2]);
    if (repeatT === REPEAT && !isNaN(a) && !isNaN(b) && symbols.length === 3) {
        return {
            t: repeatT,
            a: a,
            b: b,
        };
    }
};
parsers[REVERSE] = (symbols) => {
    const reverseT = symbols[0];
    if (reverseT === REVERSE && symbols.length === 1) {
        return {
            t: reverseT,
        };
    }
}

function parse (input, instructionSet) {
    const lines = input.split(/[\n]/).filter(nonempty);
    const parseLine = getParser(instructionSet);
    return lines.map(parseLine);
}

function getParser (instructionSet) {
    return (line, i) => {
        const symbols = line.split(' ').filter(nonempty);

        let token;
        const success = instructionSet.some((instruction) => {
            const instructionParser = parsers[instruction];
            if (token = instructionParser(symbols))
                return true;
        });
        if (!success)
            throw new Error(`Invalid line: ${i+1}`);
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
    const whole = parseWhole(str);
    return whole === 0 ? NaN : whole;
}

function stringify (instruction) {
    if (instruction) {
        return Object.keys(instruction).map((k) => {
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
    const instruction = program.shift();
    if (instruction.t === PRINT) {
        const printLines = program.splice(0, instruction.a).map(stringify);
        return runHelper(program, outputLines.concat(printLines));
    } else if (instruction.t === REPEAT) {
        if (outputLines.length > 0) {
            const start = Math.max(outputLines.length - instruction.b, 0);
            const end = start + instruction.a;
            for (let i = start; i < end; i++) {
                outputLines.push(outputLines[i]);
            }
        }
        return runHelper(program, outputLines);
    } else if (instruction.t === REVERSE) {
        return runHelper(program, outputLines.reverse());
    }
}

// main module object
const Interpreter = {
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
