import mongoose from "mongoose";

//Створюємо mongoose схему-модель, на якій в controllers будемо викликати методи для обробки запитів
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  // owner: {
  //  type: Schema.Types.ObjectId,
  //  ref: 'user',
  //}
});

//створюємо і відразу імпортуємо модель на основі схеми
export default mongoose.model("Contact", contactSchema);
