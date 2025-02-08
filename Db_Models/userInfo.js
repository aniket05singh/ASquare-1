const mongoose = require('mongoose');
const userInfoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    nationality: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    dob: { type: Date, required: true },
});

const userInfo = mongoose.model('userInfo', userInfoSchema);

module.exports = userInfo;