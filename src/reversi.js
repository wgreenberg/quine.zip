const reversiISA = [Interpreter.PRINT, Interpreter.REVERSE];
function setup() {
    const inbox = document.getElementById('input');
    const outbox = document.getElementById('output');
    inbox.addEventListener('input', () => {
        try {
            const program = Interpreter.parse(inbox.value, reversiISA);
            const output = Interpreter.run(program);
            outbox.disabled = false;
            outbox.value = output;
        } catch (e) {
            outbox.disabled = true;
            console.log(e);
        }
    });
}
document.addEventListener('DOMContentLoaded', setup);
