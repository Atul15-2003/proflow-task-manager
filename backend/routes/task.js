const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/task');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getTasks)
    .post(createTask);

router
    .route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
