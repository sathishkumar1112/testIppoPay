const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  password: { type: String, required: true  },
  createdAt: { type: Date, default: Date.now },
  modifieddAt: { type: Date, default: Date.now },
});

const Password = mongoose.model('passwords', passwordSchema);

module.exports = Password;