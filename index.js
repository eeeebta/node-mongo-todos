const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const TodoTask = require('./models/TodoTask');

dotenv.config();

// Technically this entire thing is a REST API

// Static files
app.use('/static', express.static('public'));

// This is middleware, which is interesting
// Since Flask doesn't have anything like this to my knowledge
app.use(express.urlencoded({ extended: true }));

// Being able to set database params with the db object
// is also something python can do I think?
mongoose.set('strictQuery', false);

// Connection to database is also interesting --
// Seems like everything is a promise
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('Connected to DB');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

// Setting engine? This is interesting because this is
// also a concept, but not something that I've seen before
app.set('view engine', 'ejs');

// CRUD -- database operations, but for web applications

// Get: Read
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks });
    });
});


// Post: Create
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

// Update: Edit
app.route('/edit/:id').get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.status(500, err).send(body);
        res.redirect('/');
    });
});

// Delete: Remove
app.route('/remove/:id').get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.status(500, err).send(body);
        res.redirect('/');
    });
});