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
                            <div class="btns">
                                <button id=${idx} class="edit">Edit</button>
                                <button id=${idx} class="delete">Delete</button>
                            </div>
                        </li>`;
  });
  todoList.innerHTML = sum;
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
        location.reload();
      }
    });
  });
}
editTodo();

function deleteTodo(){
  
}