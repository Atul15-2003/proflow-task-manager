const Project = require('../models/Project');

exports.getProjects = async (req, res, next) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Project.find().populate('owner', 'name email');
        } else {
            query = Project.find({
                $or: [
                    { owner: req.user.id },
                    { members: req.user.id }
                ]
            }).populate('owner', 'name email');
        }

        const projects = await query;
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        next(err);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('members', 'name email');

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        req.body.owner = req.user.id;
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await project.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
