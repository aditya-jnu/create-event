const express = require('express');
require('dotenv').config();
const axios = require('axios');
const session = require('express-session');
const cors = require('cors');

const app = express();
app.use(express.json());
/********** CORS configuration **********/
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

/********** Session setup **********/
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

const Base_Url = "https://create-event-server.onrender.com"
const REDIRECT_URI = `${Base_Url}/auth/google/callback`;
/********** Google OAuth initiation **********/
app.get('/auth/google', (req, res) => {
  console.log("Hi at auth/google")
  console.log("Client_id ",process.env.CLIENT_ID)
  console.log("redirect_uri ",REDIRECT_URI)
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email https://www.googleapis.com/auth/calendar`;
  res.redirect(url);
});

/********** Google OAuth callback handling **********/
app.get('/auth/google/callback', async (req, res) => {
  console.log("Hiii at auth/google/callback")
  const { code } = req.query;
  console.log("code ",code)
  // Uses Axios to exchange the code for an access token by sending a POST request to Google's OAuth 2.0 token endpoint.
  try{
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri: 'https://create-event-server.onrender.com/auth/google/callback',
          grant_type: 'authorization_code',
      });
      const { access_token } = data;
      // Fetch user profile
      const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      req.session.user = { profile, access_token }; // Store in session
      res.redirect('http://localhost:5173/create');
  }
  catch(error){
      console.error('Error:', error.response?.data || error.message);
      res.status(500).send('Authentication failed');
  }
});

/********** Event creation endpoint **********/
app.post('/create-event', async (req, res) => {
  if (!req.session.user || !req.session.user.access_token) {
    return res.status(401).send('Unauthorized. Please log in first.');
  }
  const { access_token } = req.session.user;
  const { summary, location, description, startDateTime, endDateTime } = req.body;
  const event = { summary, location, description, 
                  start:{ dateTime: startDateTime, timeZone: 'UTC'},
                  end:{ dateTime: endDateTime, timeZone: 'UTC'},
  };

  try{
    const response = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events',    event, { headers: {Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json'}}
    );
    res.status(201).send({
      message: 'Event created successfully!',
      eventLink: response.data.htmlLink,
    });
  } 
  catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    res.status(500).send('Failed to create event.');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('Server running on PORT', PORT);
});
