(function() {
    const lines = document.querySelectorAll('.line[data-command]');
    const typeSpeed = 25;  // ms per character (faster)
    const lineDelay = 200; // ms between lines

    function typeCommand(line, callback) {
        const command = line.getAttribute('data-command');
        const commandEl = line.querySelector('.command');
        const outputEl = line.querySelector('.output');

        line.classList.add('visible');

        let i = 0;
        function type() {
            if (i < command.length) {
                commandEl.textContent += command.charAt(i);
                i++;
                setTimeout(type, typeSpeed);
            } else {
                setTimeout(function() {
                    if (outputEl) {
                        outputEl.classList.add('visible');
                    }
                    if (callback) {
                        setTimeout(callback, lineDelay);
                    }
                }, 100);
            }
        }
        type();
    }

    function runSequence(index) {
        if (index < lines.length) {
            typeCommand(lines[index], function() {
                runSequence(index + 1);
            });
        }
    }

    setTimeout(function() {
        runSequence(0);
    }, 300);
})();
