/**
 * Our grammar:
 * program -> [action]
 * action -> "repeat" int int | "print" int int
 */

const REPEAT = 'repeat';
const PRINT = 'print';

function parse (input) {
    var lines = input.split(/[\n]/);
    return lines.map(parseLine);
}

function parseLine (line, i) {
    var symbols = line.split(' ').filter(nonempty);
    if (token = repeat(symbols))
        return token;
    if (token = print(symbols))
        return token;
    throw new Error('Invalid line: ' + i);
}

function repeat (symbols) {
    var repeatT = symbols[0];
    var a = parseInt(symbols[1]);
    var b = parseInt(symbols[2]);
    if (repeatT === REPEAT && !isNaN(a) && !isNaN(b) && symbols.length === 3) {
        return {
            t: repeatT,
            a: a,
            b: b,
        };
    }
}

function print (symbols) {
    var printT = symbols[0];
    var a = parseInt(symbols[1]);
    if (printT === PRINT && !isNaN(a) && symbols.length === 2) {
        return {
            t: printT,
            a: a,
        };
    }
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
    var outputLines = [];
    var pc = 0;
    while (pc < program.length) {
        var instruction = program[pc];
        if (instruction.t === PRINT) {
            var start = pc + 1;
            var end = start + instruction.a;
            var printLines = program.slice(start, end);
            outputLines = outputLines.concat(printLines.map(stringify));
            pc = end;
        } else if (instruction.t === REPEAT) {
            var start = outputLines.length - instruction.b;
            var end = start + instruction.a;
            for (var i = start; i < end; i++) {
                outputLines.push(outputLines[i]);
            }
            pc++;
        }
    };
    return outputLines.filter(nonempty).join('\n');
}

module.exports = {
    parse: parse,
    run: run,
};
