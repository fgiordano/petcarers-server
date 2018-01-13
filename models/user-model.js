const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ROLES    = require('./roles-types');
const Pet      = mongoose.model.Pet;
const Rating   = mongoose.model.Rating;


const myUserSchema = new Schema({
  email           : { type: String},
  username        : { type: String, required: true },
  password        : { type: String, required: true },
  aboutme         : { type: String},
  // role         : { type: String, enum: ROLES },
  pets            : [{ type: Schema.Types.ObjectId, 'default': [], ref: 'Pet'}],
  receivedRatings : [{ type: Schema.Types.ObjectId, 'default': [], ref: 'Rating'}],
  image           : { type: String, default: "https://www.atomix.com.au/media/2015/06/atomix_user31.png" }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const UserModel = mongoose.model('User', myUserSchema);
module.exports = UserModel;