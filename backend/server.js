require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfThumbnail = require("pdf-thumbnail");
const DashboardStats = require("./models/DashboardStats"); // Import the model
const Paper = require("./models/Paper");
const authRoutes = require("./routes/auth");

const stream = require("stream");
const util = require("util");
const pipeline = util.promisify(stream.pipeline);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);

// Set up file storage with multer
const upload = multer({ dest: "uploads/" });
const questionBanks = []; // Array to store file metadata

// Routes
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/queLogin")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route to create a paper
app.post("/api/create-paper", async (req, res) => {
  try {
    console.log("Received request to create paper", req.body); // Log the incoming request body

    const { courseCode, courseName, examDate, examTime, maxMarks, questions } =
      req.body;

    const newPaper = new Paper({
      courseCode,
      courseName,
      examDate,
      examTime,
      maxMarks,
      questions,
    });

    // Save the paper to the database
    await newPaper.save();

    // Respond back to the client with success message
    res.status(201).json({ message: "Paper created", paperId: newPaper._id });
  } catch (error) {
    console.error("Error creating paper:", error); // Log any errors during paper creation
    res.status(500).json({ message: "Failed to create paper" });
  }
});

app.get("/api/user-details", async (req, res) => {
  try {
    const userDetails = await getUserDetails(req.user.id); // Assuming you have user ID in the request (e.g., from JWT)
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

app.post("/api/change-password", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await changeUserPassword(username, password);
    if (result) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(400).json({ error: "Failed to change password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Route to preview a paper by courseCode
app.get("/api/preview-paper/:courseCode", async (req, res) => {
  try {
    const { courseCode } = req.params;
    console.log(
      `Received request to preview paper with courseCode: ${courseCode}`
    ); // Log courseCode

    // Find the paper based on the courseCode
    const paper = await Paper.findOne({ courseCode });
    if (!paper) {
      console.log(`No paper found with courseCode: ${courseCode}`); // Log when no paper is found
      return res.status(404).json({ message: "Paper not found" });
    }

    console.log("Found paper:", paper); // Log the paper if found

    // Return the paper preview to the client
    res.status(200).json(paper);
  } catch (error) {
    console.error("Error retrieving paper preview:", error); // Log any errors during paper preview
    res.status(500).json({ message: "Failed to retrieve paper preview" });
  }
});

// Route to get stats for dashboard
app.get("/api/dashboard-stats", async (req, res) => {
  console.log("Received request for dashboard stats");
  try {
    const dashboardStats = await DashboardStats.findOne();
    if (!dashboardStats) {
      console.log("Dashboard stats not found");
      return res.status(404).json({ message: "Dashboard stats not found" });
    }

    console.log("Dashboard stats found:", dashboardStats);
    res.status(200).json({
      totalPapers: dashboardStats.totalPapers,
      totalQuestions: dashboardStats.totalQuestions,
      recentActivity: dashboardStats.recentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// API to upload a new question bank
app.post(
  "/api/upload-question-bank",
  upload.single("file"),
  async (req, res) => {
    const { file } = req;
    const thumbnailPath = `thumbnails/${file.filename}.png`;

    try {
      // Generate thumbnail for the PDF
      const thumbnailStream = await pdfThumbnail(file.path);

      // Create a writable stream for the thumbnail path
      const writableStream = fs.createWriteStream(thumbnailPath);

      // Pipe the thumbnail stream to the writable stream
      await pipeline(thumbnailStream, writableStream);

      // Save file metadata to the array (or database)
      questionBanks.push({
        filename: file.originalname,
        path: file.path,
        thumbnail: thumbnailPath,
      });

      res.json({ message: "File uploaded successfully!" });
    } catch (err) {
      console.error("Error generating thumbnail:", err);
      res.status(500).json({ error: "Failed to generate thumbnail" });
    }
  }
);

// API to get the list of uploaded question banks
app.get("/api/question-banks", (req, res) => {
  res.json(questionBanks);
});

// Serve uploaded files and thumbnails
app.use("/uploads", express.static("uploads"));
app.use("/thumbnails", express.static("thumbnails"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
