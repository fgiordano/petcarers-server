const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email      : { type: String, required: true },
  username   : { type: String, required: true },
  password   : { type: String, required: true },
  aboutme    : { type: String, required: true },
  role       : { type: String, enum: ROLES, required: true },
  pet        : { type: Schema.Types.ObjectId, ref: 'Pet'},
  image      : { type: String, default: "https://www.menon.no/wp-content/uploads/person-placeholder.jpg" }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;