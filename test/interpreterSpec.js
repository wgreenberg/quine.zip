const Chai = require('chai');

const Interpreter = require('../src/interpreter');

const expect = Chai.expect;

describe('LZ77', () => {
    const lz77ISA = [Interpreter.PRINT, Interpreter.REPEAT];
    describe('parse', () => {
        it('should error on incorrect programs', () => {
            const invalidPrograms = [
                'print zzz',
                'print 1 2',
                'print 1fffweh091',
                'print Infinity',
                'print -1',
                'repeat 2\n3',
                'print 1 repeat 2 3',
                'print 1\nrepeat 2\nprint 2',
                'jfieo',
                'repeat repeat print print',
                'print',
            ];
            invalidPrograms.forEach((program) => {
                expect(() => {
                    Interpreter.parse(program, lz77ISA);
                }).to.throw();
            });
        });

        it('should error when N is not a natural number', () => {
            const invalidPrograms = [
                'print 1\nprint 1\nrepeat 1 0',
                'print 2\nprint 1\nprint 1\nrepeat 3 0',
                'print 1\nprint 3\nrepeat 2 0\nprint 2'
            ];
            invalidPrograms.forEach((program) => {
                expect(() => {
                    Interpreter.parse(program, lz77ISA);
                }).to.throw();
            });
        });

        it('should not throw on valid programs', () => {
            const validPrograms = [
                'print 1',
                'print 1 ',
                'repeat 2 3\nprint 2',
                'print 1\nprint 1\nprint 1\nrepeat 3 2\nprint 1',
                'repeat 2 3\nprint 2\n',
                'repeat 2 3\nprint 2\n\n\n',
            ];
            validPrograms.forEach((program) => {
                expect(() => {
                    Interpreter.parse(program, lz77ISA);
                }).not.to.throw();
            });
        });

        it('should return a token array for valid programs', () => {
            const program = [
                'print 1',
                'repeat 2 3',
                'print 4',
                'repeat 5 6',
            ].join('\n');
            expect(Interpreter.parse(program, lz77ISA)).to.deep.equal([
                { t: 'print', a: 1 },
                { t: 'repeat', a: 2, b: 3 },
                { t: 'print', a: 4},
                { t: 'repeat', a: 5, b: 6 },
            ]);
        });
    });

    describe('run', () => {
        function expectOutput (inputLines, outputLines) {
            const program = Interpreter.parse(inputLines.join('\n'), lz77ISA);
            const result = Interpreter.run(program);
            expect(result).to.equal(outputLines.join('\n'));
        }

        it('should simulate simple prints', () => {
            expectOutput([
                'print 1',
                'print 2',
            ], [
                'print 2',
            ]);

            expectOutput([
                'print 1',
                'print 0',
            ], [
                'print 0',
            ]);
        });

        it('should simulate more complicated prints', () => {
            expectOutput([
                'print 1',
                'print 2',
                'print 2',
            ], [
                'print 2',
            ]);
        });

        it('should simulate even more complicated prints', () => {
            expectOutput([
                'print 3',
                'print 2',
                'print 1',
                'print 2',
            ], [
                'print 2',
                'print 1',
                'print 2',
            ]);
        });

        it('should simulate simple repeats', () => {
            expectOutput([
                'print 1',
                'print 1',
                'print 1',
                'print 1',
                'repeat 2 2',
            ], [
                'print 1',
                'print 1',
                'print 1',
                'print 1',
            ]);

            expectOutput([
                'print 1',
                'print 1',
                'print 1',
                'print 1',
                'repeat 3 2',
            ], [
                'print 1',
                'print 1',
                'print 1',
                'print 1',
                'print 1',
            ]);

            expectOutput([
                'print 1',
                'print 1',
                'print 1',
                'repeat 2 2',
                'repeat 2 2',
            ], [
                'print 1',
                'repeat 2 2',
                'print 1',
                'repeat 2 2',
            ]);
        });

        it('should handle repeat statements at the top', () => {
            expectOutput([
                'repeat 1 1',
                'print 1',
                'print 1',
            ], [
                'print 1',
            ]);
        });
    });
});

describe('Reversi', () => {
    const reversiISA = [Interpreter.PRINT, Interpreter.REVERSE];
    describe('parse', () => {
        it('should error on incorrect programs', () => {
            const invalidPrograms = [
                'print zzz',
                'print 1 2',
                'repeat 1 2',
                'reverse 1',
                'print 1fffweh091',
                'print Infinity',
                'print -1',
            ];
            invalidPrograms.forEach((program) => {
                expect(() => {
                    Interpreter.parse(program, reversiISA);
                }).to.throw();
            });
        });

        it('should not throw on valid programs', () => {
            const validPrograms = [
                'reverse',
                'print 1',
                'print 1 ',
                'reverse\nprint 2',
                'print 1\nprint 1\nprint 1\nreverse\nprint 1',
                'reverse\nprint 2\n',
                'reverse\nprint 2\n\n\n',
            ];
            validPrograms.forEach((program) => {
                expect(() => {
                    Interpreter.parse(program, reversiISA);
                }).not.to.throw();
            });
        });
    });

    describe('run', () => {
        function expectOutput (inputLines, outputLines) {
            const program = Interpreter.parse(inputLines.join('\n'), reversiISA);
            const result = Interpreter.run(program);
            expect(result).to.equal(outputLines.join('\n'));
        }

        it('should simulate simple prints', () => {
            expectOutput([
                'print 3',
                'print 1',
                'print 2',
                'print 3',
                'reverse',
            ], [
                'print 3',
                'print 2',
                'print 1',
            ]);

            expectOutput([
                'print 1',
                'reverse',
            ], [
                'reverse',
            ]);
        });
    });
});
