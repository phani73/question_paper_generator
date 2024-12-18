const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  courseCode: { type: String, required: true ,unique:true}, // Removed unique constraint if multiple papers for the same courseCode
  courseName: { type: String, required: true },
  examDate: { type: Date, required: true },
  examTime: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  questions: [
    {
      unit: { type: String, required: true },
      co: { type: String, required: true },
      level: { type: String, required: true },
      marks: { type: Number, required: true },
      question: { type: String, required: true },
    },
  ],
  
});

module.exports = mongoose.model("Paper", paperSchema);
