const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});

tutorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Tutor", tutorSchema);
