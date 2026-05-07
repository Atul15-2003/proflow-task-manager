const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res, next) => {
    try {
        let query;
        if (req.query.projectId) {
            query = Task.find({ project: req.query.projectId }).populate('assignedTo', 'name email');
        } else {
            query = Task.find({
                $or: [
                    { assignedTo: req.user.id },
                    { createdBy: req.user.id }
                ]
            }).populate('project', 'name').populate('assignedTo', 'name email');
        }

        const tasks = await query;
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        next(err);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        
        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
