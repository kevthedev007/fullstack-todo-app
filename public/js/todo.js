
const todoList = document.querySelector('ul');
const add = document.getElementById('add');
const btn = document.getElementById('btn');
let deleteAll = document.getElementById("deleteAll");

window.addEventListener('load', () => {
    let url = '/books/getbooks';
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        let newLiTag = '';
        // data.forEach((element, index) => {
            for(let element of data) {
            let id = element.id
            newLiTag += `<li> ${element.tasks} <span onclick="deleteTasks(${id})";><i class="fas fa-trash"></i></span></li>`;
            console.log(id)
            todoList.innerHTML = newLiTag;
        }
    })
})

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


const deleteTasks = (id) => {
    // const xhttp = new XMLHttpRequest();
    // xhttp.open('DELETE', `/delete/task/${id}`, false);
    // xhttp.send();
    // window.location.reload();
    fetch(`/delete/task/${id}`, {
        method: 'delete'
    })
    window.location.reload();
}


deleteAll.addEventListener('click', () => {
    // const xhttp = new XMLHttpRequest();
    // xhttp.open('DELETE', '/delete/deleteAll', false);
    // xhttp.send();
    // window.location.reload();
    fetch('/delete/deleteAll', {
        method: 'delete'
    })
    window.location.reload();
})