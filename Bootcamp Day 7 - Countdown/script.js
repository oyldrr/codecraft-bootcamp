let interval;
let remainingTime = 0;

const input = document.getElementById("secondsInput");
const display = document.getElementById("countdownDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.addEventListener("click", function () {
    clearInterval(interval);

    remainingTime = parseInt(input.value);

    if (isNaN(remainingTime) || remainingTime <= 0) {
        display.textContent = "Lütfen geçerli bir süre girin!";
        return;
    }

    display.textContent = remainingTime;

    interval = setInterval(function () {
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(interval);
            display.textContent = "Süre doldu!";
        } else {
            display.textContent = remainingTime;
        }
    }, 1000);
});

resetBtn.addEventListener("click", function () {
    clearInterval(interval);
    remainingTime = 0;
    display.textContent = "00";
    input.value = "";
});
