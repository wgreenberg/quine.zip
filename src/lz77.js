var LZ77ISA = [Interpreter.PRINT, Interpreter.REPEAT];
function setup() {
    var inbox = document.getElementById('input');
    var outbox = document.getElementById('output');
    inbox.addEventListener('input', function () {
        try {
            var program = Interpreter.parse(inbox.value, LZ77ISA);
            var output = Interpreter.run(program);
            outbox.disabled = false;
            outbox.value = output;
        } catch (e) {
            outbox.disabled = true;
            console.log(e);
        }
    });
}
document.addEventListener('DOMContentLoaded', setup);
