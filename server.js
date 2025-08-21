const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const app = express();
const PORT = 4000;
const Contact = require('./Contact/Contact');
const Appointment = require('./Appointment/Appointment');
const Doctor = require('./models/Doctor'); 

app.use(cors());
app.use(bodyParser.json());


const allowedOrigins = [ 
 "http://localhost:3000", 
 "https://aithospital.netlify.app" 
];app.use((req, res, next) => { 
 const origin = req.headers.origin; 
 if (allowedOrigins.includes(origin)) { 
 res.setHeader("Access-Control-Allow-Origin", origin); 
 } 
 res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
 res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
 res.setHeader("Access-Control-Allow-Credentials", "true"); 
 
 if (req.method === "OPTIONS") { 
 return res.sendStatus(200); 
 } 
 next(); 
});

 
mongoose.connect('mongodb+srv://koustubhrayamane2001:LkJzWaEL4EGYG5bV@cluster0.byb9xqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

 
app.post('/appointments', async (req, res) => {
  try {
    // const newBooking = new Book(req.body);
    
    const newBooking = new Appointment(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Appointment saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save appointment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
app.post('/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: 'Contact saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save contact' });
  }
  
});
app.get('/appointments', async (req, res) => {
  const { email } = req.query;

  try {
    const appointments = email
      ? await Appointment.find({ email }) 
      : await Appointment.find();          

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: 'Could not fetch appointments' });
  }
});

app.post('/doctor-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email, password });  
    if (doctor) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});
app.delete('/appointments/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ Check if the id is a valid ObjectId first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await Appointment.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});



