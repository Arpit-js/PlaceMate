const mongoose = require('mongoose');


const ApplicationSchema = new mongoose.Schema({
userId: { type: String, required: true },
company: { type: String, required: true },
role: { type: String, required: true },
package: { type: String },
drives: { type: Number, default: 1 },
deadline: { type: Date },
topics: { type: [String], default: [] },
status: { type: String, enum: ['ongoing','completed','upcoming'], default: 'upcoming' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Application', ApplicationSchema);