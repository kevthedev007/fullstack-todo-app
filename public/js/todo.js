
const todoList = document.querySelector('ul');
const add = document.getElementById('add');
const btn = document.getElementById('btn');
let deleteAll = document.getElementById("deleteAll");

//on load, fetch the todos of the user
window.addEventListener('load', () => {
    let url = '/books/getbooks';
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        let newLiTag = '';
            for(let element of data) {
            let id = element.id
            newLiTag += `<li> ${element.tasks} <span onclick="deleteTasks(${id})";><i class="fas fa-trash"></i></span></li>`;
            // console.log(id)
            todoList.innerHTML = newLiTag;
        }
    })
})

//onclick, add a todo
btn.addEventListener('click', () => {
    if (add.value.length > 0) {
        fetch('/post', {
            method: 'post',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({
                task: add.value
            })
        })
        window.location.reload()
    }
})

//on keypress, add a todo
add.addEventListener("keypress", () => {
    if (add.value.length > 0 && event.which === 13) {
        fetch('/post', {
            method: 'post',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({
                task: add.value
            })
        })
        window.location.reload()
    }
})

//delete a task based on the id
const deleteTasks = (id) => {
    fetch(`/delete/task/${id}`, {
        method: 'delete'
    })
    window.location.reload();
}

//delete all tasks
deleteAll.addEventListener('click', () => {
    fetch('/delete/deleteAll', {
        method: 'delete'
    })
    window.location.reload();
})