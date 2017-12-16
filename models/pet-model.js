const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const PETTYPE   = require('./pet-types');
const User     = require('./user-model');


const PetSchema = new Schema({
  // owner      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name       : { type: String, required: true },
  // type       : { type: String, enum: PETTYPE, required: true },
  // breed      : { type: String },
  // aboutme    : { type: String, required: true },
  // weight     : { type: Number, required: true },
  age        : { type: Number, required: true },
  // image     : { type: String, default: "https://www.menon.no/wp-content/uploads/person-placeholder.jpg" }
  // imgUrl     : { type: String, default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }
});

PetSchema.methods.belongsTo = function(user){
  return this.owner.equals(user._id);
}

const Pet = mongoose.model('Pet', PetSchema);
module.exports = Pet;