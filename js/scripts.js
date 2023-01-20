//Select elements
const todoForm = document.querySelector("#add-task-form");
const todoInput = document.querySelector("#task-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-task-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const cleanBtn = document.querySelector("#cln-btn");
const filterBtn = document.querySelector("#filter-select");
const errorMsg = document.querySelector("#text-error");
let oldInputValue;

/***** Event submit new task form *****/
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue !== "") {
    saveTodo(inputValue);
  } else {
    const error = document.createElement("span");
    error.innerText = "Insira um nome válido para tarefa";
    error.setAttribute("id", "text-error");
    todoForm.appendChild(error);
    setTimeout(function () {
      todoForm.appendChild(error).remove();
    }, 5000);
  }
});

/****** Function for create a new task *******/
const saveTodo = (text, done = 0, save = 1) => {
  //Create a general div
  const todo = document.createElement("div");
  todo.classList.add("todo");

  //Create a title
  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  //Create finish button
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.setAttribute("title", "Concluir tarefa");
  doneBtn.innerHTML =
    '<ion-icon class="done-btn" name="checkmark-outline"></ion-icon>';
  todo.appendChild(doneBtn);

  //Create edit button
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.setAttribute("title", "Editar tarefa");
  editBtn.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
  todo.appendChild(editBtn);

  //Create remove button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.setAttribute("title", "Excluir tarefa");
  deleteBtn.innerHTML =
    '<ion-icon class="remove-btn" name="close-outline"></ion-icon>';
  todo.appendChild(deleteBtn);

  //Utilizando dados da localstorage
  if (done) {
    todo.classList.add("done");
  }
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  //Add the new task to the task list
  todoList.appendChild(todo);

  //Reset input
  todoInput.value = "";

  //Focus input
  todoInput.focus();
};

/***** Changing the 'hide' class of the tasks ******/
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

/***** Event buttons task ******/
document.addEventListener("click", (e) => {
  //Inserting the element into a constant
  const targetElement = e.target;

  //Inserting the parent element into a constant
  const parentElement = targetElement.closest("div");

  //Creating a variable to capture title of elements
  let todoTitle;

  //Condicional to capturing the task title
  if (parentElement && parentElement.querySelector("h3")) {
    todoTitle = parentElement.querySelector("h3").innerText || "";
  }

  //Codicional to inserting 'done' class into the parent element
  if (targetElement.classList.contains("finish-todo")) {
    parentElement.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  //Codicional to inserting 'remove' the parent element
  if (targetElement.classList.contains("remove-todo")) {
    parentElement.remove();

    removeTodoLocalStorage(todoTitle);
  }

  //Codicional to inserting 'edit' task
  if (targetElement.classList.contains("edit-todo")) {
    toggleForms();

    //Insert the atual name of task into input edit
    editInput.value = todoTitle;

    //Insert the atual name into a oldInputValue ?????
    oldInputValue = todoTitle;
  }
});

/***** Adding a cancel event to the edit form button *****/
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

/***** Função para editar o nome da tarefa *****/
const updateTodo = (text) => {
  //Seleciona todas as tarefas criadas da DOM
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    //Para cada tarefa ele seleciona o titulo da mesma
    let todoTitle = todo.querySelector("h3");

    //Compara com o nome adicionado na variável oldInputValue
    if (todoTitle.innerText === oldInputValue) {
      //Substitui o nome antigo pelo novo
      todoTitle.innerText = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

/***** Adding a new name to the task edit *****/
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Adiciona na variável o novo nome digitado no campo de input de edição
  const editInputValue = editInput.value;

  //Condicional se tiver um valor dentro do input é chamado a função de update
  if (editInputValue) {
    updateTodo(editInputValue);
  }

  //Change again to hide edit form
  toggleForms();
});

/***** Função para localizar tarefa *****/
const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  //Mapeaia todos os titulos para apresentar somente o procurado
  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    //Faz com que o display volte ao estado normal após encontrar alguma tarefa
    todo.style.display = "flex";

    //Caso a tarefa mapeada não tiver relação com o procurado ele esconde da tela
    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

/***** Procura uma tarefa cadastrada no sistema através da tecla digitada *****/
searchInput.addEventListener("keyup", (e) => {
  //Adiciona a opção keyup (que faz o evento ao soltar o dedo da tecla) e vai guardando os valores em search
  const search = e.target.value;

  //Cada tecla digitada dispara a funçào abaixo, deixando em tempo real o filtro das tarefas encontradas
  getSearchedTodos(search);
});

/***** Limpa input de procura *****/
cleanBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

/***** Função para filtrar tarefas *****/
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    default:
      break;
  }
};

/***** Filtra as tarefas completadas e não completadas *****/
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

/***** Funções para inserir Local Data Storage *****/

//Cria um JSON (array) e insere dentro dele todos as tarefas que foram criadas
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

//Reconstroi todas as tarefas que estavam alojadas no JSON ao recarregar a página
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

//Salva no localstorage a tarefa que é criada
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

//Remove do localstorage a tarefa
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();
