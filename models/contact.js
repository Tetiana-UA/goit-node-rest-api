import mongoose from "mongoose";

//Створюємо mongoose схему-модель, на якій в controllers будемо викликати методи для обробки запитів
const contactSchema = new mongoose.Schema(
  {
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

//створюємо і відразу імпортуємо модель на основі схеми
export default mongoose.model("Contact", contactSchema);
