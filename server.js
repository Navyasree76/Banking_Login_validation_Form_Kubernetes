const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/banking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for storing user login details
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  accountNumber: { type: String, required: true },
  dob: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// API route to handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { username, accountNumber, dob, password } = req.body;
    
    if (!username || !accountNumber || !dob || !password) {
      return res.status(400).send('All fields are required.');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ accountNumber });
    if (existingUser) {
      return res.status(400).send('User with this account number already exists.');
    }

    // Create a new user
    const user = new User({ username, accountNumber, dob, password });
    await user.save();
    
    res.status(200).send('User details saved successfully.');
  } catch (error) {
    console.error('Error saving user details:', error);
    res.status(500).send('Error saving user details.');
  }
});

// Serve the HTML file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
