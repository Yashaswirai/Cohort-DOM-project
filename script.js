function CardsandCloseBtn() {
  const cards = document.querySelectorAll(".card");
  const details = document.querySelectorAll(".details");
  const CloseBtns = document.querySelectorAll(".clsBtn");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      details[card.id].style.display = "block";
    });
  });

  CloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      details[btn.id].style.display = "none";
    });
  });
}
CardsandCloseBtn();

var list = [];
function renderLists() {
  if (localStorage.getItem("taskLists")) {
    list = [...JSON.parse(localStorage.getItem("taskLists"))];
  } else {
    localStorage.setItem("taskLists", JSON.stringify(list));
  }
  let todoList = document.querySelector(".todoLists");
  let sum = "";
  list.forEach((item, idx) => {
    sum += `<li class="item" id=${idx}>
                            <input type="text" id=${idx} value="${item.title}" readonly>
                            <span class=imp-${item.imp}>imp</span>
                            <div class="btns">
                                <button id=${idx} class="edit">Edit</button>
                                <button id=${idx} class="delete">Delete</button>
                            </div>
                        </li>`;
  });
  todoList.innerHTML = sum;

  // Re-attach event listeners after DOM update
  editTodo();
  deleteTodo();
}
renderLists();

function createTodos() {
  const todoInput = document.querySelector("#todoInput");
  const desc = document.querySelector("#Desc");
  const check = document.querySelector("#important");
  const form = document.querySelector(".create-todo form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    list.push({ title: todoInput.value, desc: desc.value, imp: check.checked });
    localStorage.setItem("taskLists", JSON.stringify(list));
    renderLists();
    todoInput.value = "";
    desc.value = "";
    check.checked = false;
  });
}
createTodos();

function editTodo() {
  let editbtns = document.querySelectorAll(".item .btns .edit");
  let input = document.querySelectorAll(".item input");
  editbtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      if (editBtn.classList.contains("edit")) {
        input[editBtn.id].removeAttribute("readonly");
        input[editBtn.id].style.backgroundColor = "#f0f0f0";
        input[editBtn.id].focus();
        editBtn.innerHTML = "Save";
        editBtn.classList.remove("edit");
        editBtn.classList.add("save");
      } else if (editBtn.classList.contains("save")) {
        list[editBtn.id].title = input[editBtn.id].value;
        input[editBtn.id].readOnly = true;
        input[editBtn.id].style.backgroundColor = "transparent";
        editBtn.innerHTML = "edit";
        editBtn.classList.remove("save");
        editBtn.classList.add("edit");
        localStorage.setItem("taskLists", JSON.stringify(list));
        renderLists();
        // Remove location.reload() - not needed anymore
      }
    });
  });
}

function deleteTodo() {
  let deletebtns = document.querySelectorAll(".item .btns .delete");
  deletebtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      list.splice(deleteBtn.id, 1);
      localStorage.setItem("taskLists", JSON.stringify(list));
      renderLists();
      // Remove location.reload() - not needed anymore
    });
  });
}

let dailyPlans = [];
function renderPlans() {
  dailyPlans = JSON.parse(localStorage.getItem("dailyPlans")) || [];
  const time = Array.from(
    { length: 18 },
    (_, idx) => `${5 + idx}:00 - ${6 + idx}:00`
  );
  const schedules = document.querySelector(".schedules");
  let schedule = "";
  time.forEach((hour, idx) => {
    schedule += `<div class="plan" id=${idx}>
                    <h5>${hour}</h5>
                    <input id=${idx} type="text" placeholder="..." value=${
      dailyPlans[idx] || ""
    }>
                </div>`;
  });
  schedules.innerHTML = schedule;
  Plans();
}
renderPlans();
function Plans() {
  let allInputs = document.querySelectorAll(".plan input");

  allInputs.forEach((inpt, index) => {
    inpt.addEventListener("input", () => {
      dailyPlans[index] = inpt.value;
      localStorage.setItem("dailyPlans", JSON.stringify(dailyPlans));
    });
  });
}

async function MotivationalQuote() {
  let res = await fetch("https://api.realinspire.live/v1/quotes/random");
  const dets = await res.json();
  let quote = document.querySelector(".motivation .quote");
  let author = document.querySelector(".motivation .author");
  quote.innerHTML = dets[0].content;
  author.innerHTML = `- ${dets[0].author}`;
}
MotivationalQuote();

function pomodoroTimer() {
  const minute = document.querySelector("#minutes");
  const second = document.querySelector("#seconds");
  const start = document.querySelector("#startBtn");
  const pause = document.querySelector("#pauseBtn");
  const reset = document.querySelector("#resetBtn");
  const session = document.querySelector(".session");
  let min = Number(minute.value);
  let sec = Number(second.value);
  let totalSecond = min * 60 + sec;
  minute.addEventListener("input", () => {
    min = minute.value;
    totalSecond = min * 60 + sec;
  });
  second.addEventListener("input", () => {
    sec = second.value;
    totalSecond = min * 60 + sec;
  });

  let timerInterval;
  let working = true;
  function startTimer() {
    start.disabled = true;
    pause.disabled = false;
    reset.disabled = false;
    session.innerHTML = working ? "Focus" : "Break Time";
    pause.style.cursor = "pointer";
    start.style.cursor = "not-allowed";
    reset.style.cursor = "pointer";
    timerInterval = setInterval(() => {
      if (totalSecond <= 0 && working) {
        clearInterval(timerInterval);
        session.innerHTML = "Now Take a Break";
        working = false;
        start.disabled = false;
        pause.disabled = true;
        reset.disabled = true;
        pause.style.cursor = "not-allowed";
        start.style.cursor = "pointer";
        reset.style.cursor = "not-allowed";
        return;
      } else if (totalSecond <= 0 && !working) {
        clearInterval(timerInterval);
        session.innerHTML = "Focus Again";
        working = true;
        start.disabled = false;
        pause.disabled = true;
        reset.disabled = true;
        pause.style.cursor = "not-allowed";
        start.style.cursor = "pointer";
        reset.style.cursor = "not-allowed";
        return;
      }

      totalSecond--;
      min = Math.floor(totalSecond / 60);
      sec = totalSecond % 60;

      minute.value = min < 10 ? `0${min}` : min;
      second.value = sec < 10 ? `0${sec}` : sec;
    }, 1000);
  }
  function pauseTimer() {
    start.disabled = false;
    pause.disabled = true;
    reset.disabled = false;
    pause.style.cursor = "not-allowed";
    start.style.cursor = "pointer";
    reset.style.cursor = "pointer";
    session.innerHTML = "Paused";
    // Clear the interval to pause the timer
    clearInterval(timerInterval);
  }
  function resetTimer() {
    start.disabled = false;
    pause.disabled = true;
    reset.disabled = true;
    pause.style.cursor = "not-allowed";
    start.style.cursor = "pointer";
    reset.style.cursor = "not-allowed";
    session.innerHTML = "Focus";
    minute.value = "25";
    second.value = "00";
    totalSecond = 25 * 60;
    working = true;
    clearInterval(timerInterval);
  }
  start.addEventListener("click", startTimer);
  pause.addEventListener("click", pauseTimer);
  reset.addEventListener("click", resetTimer);
}
pomodoroTimer();

function DateTimeWeather() {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let wallpaper = {
    morning:
      "url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    afternoon:
      "url('https://images.unsplash.com/photo-1577257108037-e85032e84049?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    evening:
      "url('https://images.unsplash.com/photo-1508727786488-0d7201955bc0?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    night:
      "url('https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1162&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  };
  let header = document.querySelector("header");
  let displaygreeting = document.querySelector(".greeting");
  let displayDate = document.querySelector(".date");
  let displayDay = document.querySelector(".day");
  let displayTime = document.querySelector(".time");
  let displayLoc = document.querySelector(".location");
  let weatherIcon = document.querySelector(".weather-info img");
  let displayTemp = document.querySelector(".temperature");
  let displayHumidity = document.querySelector(".humidity");

  function updateTime() {
    let dt = new Date();
    let day = dt.getDate();
    let month = dt.getMonth(); // Months are zero-indexed
    let year = dt.getFullYear();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();
    if (hours >= 5 && hours < 12) {
      displaygreeting.innerHTML = "Hello, Good Morning User!";
      header.style.backgroundImage = wallpaper.morning;
    } else if (hours >= 12 && hours < 17) {
      displaygreeting.innerHTML = "Hello, Good Afternoon User!";
      header.style.backgroundImage = wallpaper.afternoon;
    } else if (hours >= 17 && hours < 21) {
      displaygreeting.innerHTML = "Hello, Good Evening User!";
      header.style.backgroundImage = wallpaper.evening;
    } else {
      displaygreeting.innerHTML = "Hello, Good Night User!";
      header.style.backgroundImage = wallpaper.night;
    }
    if (hours > 12) {
      hours -= 12;
      displayTime.innerHTML = `${String(hours).padStart("2", 0)}:${String(
        minutes
      ).padStart("2", 0)}:${String(seconds).padStart("2", 0)} PM`;
    } else {
      displayTime.innerHTML = `${String(hours).padStart("2", 0)}:${String(
        minutes
      ).padStart("2", 0)}:${String(seconds).padStart("2", 0)} AM`;
    }
    displayDate.innerHTML = `${String(day).padStart("2", 0)} ${
      monthNames[month]
    } ${year}`;

    displayDay.innerHTML = `, &nbsp${days[dt.getDay()]}`;
  }
  setInterval(updateTime, 1000);
  function updateWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const key = "8b255b5a5c864081b6e55252252706";
      let res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${lon}&aqi=no`
      );
      let data = await res.json();
      displayLoc.innerHTML = `Location:- ${data.location.name}`;
      displayTemp.innerHTML = `Temperature:- ${data.current.temp_c}°C`;
      displayHumidity.innerHTML = `Humidity:- ${data.current.humidity}%`;
      weatherIcon.src = data.current.condition.icon;
    });
  }
  updateWeather();
}
DateTimeWeather();

let flag = 1;
function changeTheme() {
  const themeToggle = document.querySelector(".theme");
  const root = document.documentElement;
  themeToggle.addEventListener("click", () => {
    if (flag === 1) {
      root.style.setProperty("--primary-color", "#FFF2E0");
      root.style.setProperty("--secondary-color", "#C0C9EE");
      root.style.setProperty("--text-color", "#A2AADB");
      root.style.setProperty("--accent-color", "#898AC4");
      flag = 2;
    } else if (flag === 2) {
      root.style.setProperty("--primary-color", "#E3FDFD");
      root.style.setProperty("--secondary-color", "#CBF1F5");
      root.style.setProperty("--text-color", "#A6E3E9");
      root.style.setProperty("--accent-color", "#71C9CE");
      flag = 3;
    } else if (flag === 3) {
      root.style.setProperty("--primary-color", "#090040");
      root.style.setProperty("--secondary-color", "#471396");
      root.style.setProperty("--text-color", "#B13BFF");
      root.style.setProperty("--accent-color", "#FFCC00");
      flag = 0;
    } else if (flag === 0) {
      root.style.setProperty("--primary-color", "#222831");
      root.style.setProperty("--secondary-color", "#393e46");
      root.style.setProperty("--text-color", "#00adb5");
      root.style.setProperty("--accent-color", "#eeeeee");
      flag = 1;
    }
  });
}
changeTheme();

const frm = document.querySelector(".goal-form");
const inp = document.querySelector("#goalInput");
let dailyGoals = [];

frm.addEventListener("submit", (e) => {
  e.preventDefault();
  let dt = new Date();
  let hours = dt.getHours();
  let minutes = dt.getMinutes();
  let t = "";
  if (hours > 12) {
    hours -= 12;
    t = `${String(hours).padStart("2", 0)}:${String(minutes).padStart(
      "2",
      0
    )} PM`;
  } else {
    t = `${String(hours).padStart("2", 0)}:${String(minutes).padStart(
      "2",
      0
    )} AM`;
  }
  dailyGoals.push({
    id: inp.value.replaceAll(" ", "-"),
    topic: inp.value,
    time: t,
  });  
  localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals));  
  renderGoals();
  inp.value = "";  
});
function renderGoals() {
  const goalList = document.querySelector(".goal-list");
  let s = '';
  dailyGoals = JSON.parse(localStorage.getItem("dailyGoals")) || [];
  if (dailyGoals.length > 0) {
    s = dailyGoals
      .map(
        (goal) => `<div class="goal" id="${goal.id}">
                        <input type="checkbox" name="${goal.id}" id="${goal.id}">
                        <label for="${goal.id}">${goal.topic}</label>
                        <div class="rightEnd">
                            <h5 class="created-Time">${goal.time}</h5>
                            <button class="delete-btn" id=${goal.id}>Delete</button>
                        </div>
                    </div>`
      )
      .join('');
  } else {
    s = `<h1>Add your todays Goal</h1>`;
  }
  goalList.innerHTML = s;
  deleteGoal();
}
renderGoals();
function deleteGoal() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let goalId = btn.id;
      dailyGoals = dailyGoals.filter((goal) => goal.id !== goalId);
      localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals));
      renderGoals();
    });
  });
}
deleteGoal();