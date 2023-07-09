import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const datePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

let countdownInterval;
let countdownDate;

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const timeDifference = countdownDate - currentTime;

    if (timeDifference > 0) {
        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        daysElement.textContent = addLeadingZero(days);
        hoursElement.textContent = addLeadingZero(hours);
        minutesElement.textContent = addLeadingZero(minutes);
        secondsElement.textContent = addLeadingZero(seconds);
    } else {
        clearInterval(countdownInterval);
        Notiflix.Notify.info("Timer has ended!");
        startButton.disabled = false;
    }
}

flatpickr("#datetime-picker", {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            Notiflix.Notify.failure("Please choose a date in the future");
            startButton.disabled = true;
        } else {
            Notiflix.Notify.success("Timer is set!");
            countdownDate = selectedDate.getTime();
            startButton.disabled = false;
        }
    },
});

startButton.addEventListener("click", () => {
    startButton.disabled = true;
    countdownInterval = setInterval(updateTimer, 1000);
});
