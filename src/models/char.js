import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CharSchema = new Schema({
  name: { type: String, required: true, trim: true },
  occupation: { type: String, required: true },
  weapon: { type: String, required: true },
  debt: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const CharModel = model("Char", CharSchema);

export default CharModel;
