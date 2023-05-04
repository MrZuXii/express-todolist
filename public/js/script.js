const btnAdd = document.querySelector('.add');
const inputText = document.querySelector('.inputText');
const ul = document.querySelector('.todo-list');
const all = document.querySelector('.all');
const active = document.querySelector('.active');
const completed = document.querySelector('.completed');
const clear = document.querySelector('.clear');

let flagForEdit = true;
let option = 1;

const complete = async (nr) => {
  await fetch('/task/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nr,
    }),
  });
  reportTask('TASK WAS DONE');
};
const edit = async (input, iconEdit, task) => {
  if (iconEdit.className === 'fa-regular fa-pen-to-square' && flagForEdit) {
    iconEdit.className = 'fa-solid fa-check';
    input.disabled = false;
    input.focus();
    input.addEventListener('keypress', (e) => (e.key === 'Enter' ? this.edit(input, iconEdit, task) : ''));
    flagForEdit = false;
  } else if (input.value !== '' && iconEdit.className === 'fa-solid fa-check') {
    await fetch('/task/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nr: task.nr,
        text: input.value,
      }),
    });
    flagForEdit = true;
    reportTask('TASK WAS EDIT');
    await render();
  }
};
async function render() {
  let res;
  if (option === 1) {
    res = await fetch('/render', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (option === 2) {
    res = await fetch('/filter/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else if (option === 3) {
    res = await fetch('/filter/completed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const tasks = await res.json();

  ul.innerHTML = '';
  document.querySelector('.items-left span').textContent = tasks.length;

  for (const task of tasks) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const btn = document.createElement('button');
    const btnEdit = document.createElement('button');
    const btnRemove = document.createElement('button');
    const iconEdit = document.createElement('i');
    const iconRemove = document.createElement('i');
    const p = document.createElement('p');

    btnEdit.className = 'edit';
    iconEdit.className = 'fa-regular fa-pen-to-square';
    btnEdit.appendChild(iconEdit);

    btnRemove.className = 'delete';
    iconRemove.className = 'fa-regular fa-trash-can';
    btnRemove.appendChild(iconRemove);

    input.value = task.text;
    input.disabled = true;

    p.appendChild(input);

    input.type = 'text';

    li.append(btn, p, btnEdit, btnRemove);

    btn.className = '';
    input.style.textDecoration = 'none';
    ul.appendChild(li);

    if (task.checked) {
      btn.className = 'on';
      input.style.textDecoration = 'line-through';
    } else {
      btn.className = '';
      input.style.textDecoration = 'none';
    }

    btn.addEventListener('click', async () => {
      await complete(task.nr);
      await render();
    });

    btnEdit.addEventListener('click', () => {
      edit(input, iconEdit, task);
    });

    btnRemove.addEventListener('click', async () => {
      await deleteTask(task.nr);
      await render();
    });
  }
}
async function deleteTask(nr) {
  await fetch('/task/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nr,
    }),
  });
  reportTask('REMOVE TASK');
}

let flagForReportTask = true;
const reportTask = (txt) => {
  if (flagForReportTask) {
    flagForReportTask = false;
    const reportTask = document.querySelector('.report-task');
    reportTask.textContent = txt;
    reportTask.classList.add('active');
    setTimeout(() => {
      reportTask.classList.remove('active');
      flagForReportTask = true;
    }, 1000);
  }
};

const addTask = async () => {
  if (inputText.value.length > 0) {
    await fetch('/task/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText.value,
        nr: Date.now(),
        checked: false,
      }),
    });
    inputText.value = '';
    reportTask('ADD NEW TASK');
    await render();
  }
};

btnAdd.addEventListener('click', async () => await addTask());
inputText.addEventListener('keypress', async (e) => (e.key === 'Enter' ? await addTask() : ''));

all.addEventListener('click', () => {
  option = 1;
  all.classList.add('on');
  active.classList.remove('on');
  completed.classList.remove('on');
  render();
});
active.addEventListener('click', () => {
  option = 2;
  all.classList.remove('on');
  active.classList.add('on');
  completed.classList.remove('on');
  render();
});
completed.addEventListener('click', () => {
  option = 3;
  all.classList.remove('on');
  active.classList.remove('on');
  completed.classList.add('on');
  render();
});
clear.addEventListener('click', async () => {
  await fetch('/filter/clear-completed', {
    method: 'POST',
  });
  render();
  reportTask('ALL COMPLETED TASK WAS DELETED');
});

render();
