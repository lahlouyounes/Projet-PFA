const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: { 
        type: String, 
        required: true,
        enum: [
            'CREATE_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT',
            'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK', 'MOVE_TASK',
            'INVITE_MEMBER', 'REMOVE_MEMBER'
        ]
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    details: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);