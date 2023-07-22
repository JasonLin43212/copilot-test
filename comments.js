// Create web server
// 1. Create web server
// 2. Load the comments from file
// 3. Insert a new comment
// 4. Save the comments to file
// 5. Return all comments to client

// 1. Create web server
const express = require('express');
const app = express();
const port = 3000;

// 2. Load the comments from file
const fs = require('fs');
const comments = JSON.parse(fs.readFileSync('./comments.json', 'utf8'));

// 3. Insert a new comment
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/comments', (req, res) => {
    const comment = req.body;
    comment.id = Date.now();
    comments.push(comment);
    res.send(comment);
});

// 4. Save the comments to file
function saveComments() {
    fs.writeFileSync('./comments.json', JSON.stringify(comments), 'utf8');
}

// 5. Return all comments to client
app.get('/comments', (req, res) => {
    res.send(comments);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Path: index.html
// Create client
// 1. Create a form to add a new comment
// 2. Display all comments

// 1. Create a form to add a new comment
// 2. Display all comments
function displayComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('li');
        commentElement.innerHTML = `<strong>${comment.name}</strong>: ${comment.text}`;
        commentsList.appendChild(commentElement);
    });
}

displayComments();

document.getElementById('comment-form').addEventListener('submit', event => {
    event.preventDefault();
    const comment = {
        name: document.getElementById('name').value,
        text: document.getElementById('comment').value
    };
    fetch('/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
        .then(response => response.json())
        .then(comment => {
            comments.push(comment);
            displayComments();
        });
});