const hasProjectAccess = (project, user) => {
    if (!project || !user) return false;
    if (user.role === 'admin') return true;

    const userId = (user._id || user.id)?.toString();
    if (!userId) return false;

    const ownerId = (project.owner?._id || project.owner)?.toString();
    if (ownerId && ownerId === userId) return true;

    if (Array.isArray(project.members)) {
        return project.members.some(member => {
            const memberId = (member?._id || member)?.toString();
            return memberId === userId;
        });
    }

    return false;
};

module.exports = hasProjectAccess;
module.exports.hasProjectAccess = hasProjectAccess;
