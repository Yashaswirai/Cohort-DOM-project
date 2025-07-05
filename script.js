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
    // Remove location.reload() - not needed anymore
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