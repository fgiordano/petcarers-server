const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ROLES     = require('./roles-types');
const Pet       = mongoose.model.Pet;


const userSchema = new Schema({
  email      : { type: String},
  username   : { type: String, required: true },
  password   : { type: String, required: true },
  aboutme    : { type: String},
  // role       : { type: String, enum: ROLES },
  pets       [{ type: Schema.Types.ObjectId, 'default': [], ref: 'Pet'}],
  image      : { type: String, default: "https://www.menon.no/wp-content/uploads/person-placeholder.jpg" }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;