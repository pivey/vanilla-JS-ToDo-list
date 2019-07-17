/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
/* eslint-disable radix */
const formSubmit = document.getElementById('task-submit-button');
const clearAll = document.getElementById('clear-all');
const itemList = document.getElementById('item-list');
let movedItem;
const todoArr = [];
let todoObj = {};

window.onbeforeunload = () => {
  localStorage.setItem('todo', JSON.stringify(todoArr));
};

window.onload = () => {
  if (localStorage.getItem('todo').length >= 1) {
    const prevState = JSON.parse(localStorage.getItem('todo'));
    for (let i = 0; i < prevState.length; i += 1) {
      todoArr.push(prevState[i]);
    }
    todoArr.forEach((e) => {
      const li = document.createElement('li');
      li.innerHTML += `<div id = ${e.itemID} class = ${e.state}>
                                 <p>Task: ${e.taskTitle}</p>
                                 <p>Description: ${e.taskDescription}</p>                              
                                  <p>Deadline: ${e.taskDeadline}</p>                                
                                  <button class='removeBtn'>DONE</button>
                                  </div>`;
      li.innerHTML += '</li>';
      li.childNodes.forEach((x) => {
        // eslint-disable-next-line no-unused-expressions
        x.className === 'completed' ? x.parentNode.classList.add('done') : null;
      });
      itemList.appendChild(li);
    });
  }
};

formSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.getElementById('input-title').value;
  const description = document.getElementById('input-description').value;
  const deadline = document.getElementById('input-deadline').value;
  const form = document.getElementById('to-do-form');

  if (title === '') {
    alert('Write a title for your task');
  } else if (description === '') {
    alert('Write a description of your task');
  } else if (!deadline.match(/([\d]){1,2}\/([\d]){2}\/([\d]){4}/g)) {
    alert('Format your date as such: xx/xx/xxxx');
  } else {
    const li = document.createElement('li');
    todoObj = {
      taskTitle: title,
      taskDescription: description,
      taskDeadline: deadline,
      itemID: todoArr.length + 1,
      state: '',
    };
    todoArr.push(todoObj);
    li.innerHTML += `<div id = ${todoObj.itemID}>
                                 <p>Task: ${todoArr[todoArr.length - 1].taskTitle}</p>
                                 <p>Description: ${todoArr[todoArr.length - 1].taskDescription}</p>                              
                                  <p>Deadline: ${todoArr[todoArr.length - 1].taskDeadline}</p>                                
                                  <button class='removeBtn' >DONE</button>
                                  </div>`;
    li.innerHTML += '</li>';

    itemList.appendChild(li);
    form.reset();
    document.getElementById('input-title').focus();
  }
});

itemList.addEventListener('click', (e) => {
  let list = document.querySelectorAll('li div');
  list = Array.from(list);

  if (e.target.className === 'removeBtn') {
    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    const item = e.target.parentNode;
    todoArr.splice(item.itemID - 1, 1);
  }
  if (e.target.tagName === 'DIV' && e.target.className === 'completed') {
    for (let i = 0; i < todoArr.length; i += 1) {
      parseInt(e.target.id) === todoArr[i].itemID ? todoArr[i].state = '' : null;
    }

    for (let i = 0; i < list.length; i += 1) {
      if (parseInt(e.target.id) === parseInt(list[i].id)) {
        movedItem = todoArr.splice(i, 1);
        movedItem.forEach(z => todoArr.unshift(z));
      }
    }
    e.target.classList.remove('completed');
    e.target.parentNode.classList.remove('done');
    e.target.parentNode.parentNode.prepend(e.target.parentNode);
  } else if (e.target.tagName === 'DIV' && e.target.className !== 'completed') {
    for (let i = 0; i < todoArr.length; i += 1) {
      parseInt(e.target.id) === todoArr[i].itemID ? todoArr[i].state = 'completed' : null;
    }

    for (let i = 0; i < list.length; i += 1) {
      if (parseInt(e.target.id) === parseInt(list[i].id)) {
        movedItem = todoArr.splice(i, 1);
        movedItem.forEach(z => todoArr.push(z));
      }
    }
    e.target.classList.add('completed');
    e.target.parentNode.classList.add('done');
    e.target.parentNode.parentNode.appendChild(e.target.parentNode);
  }
});

clearAll.addEventListener('click', (e) => {
  e.preventDefault();
  const range = document.createRange();
  range.selectNodeContents(itemList);
  range.deleteContents();
  todoArr.splice(0, todoArr.length);
});
