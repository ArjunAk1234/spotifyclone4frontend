
// app.listen(3000, () => console.log('Server running on port 3000'));
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/music', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const UserSchema = new mongoose.Schema({
    username: String,
    password: String
},{ collection: 'user' });
 // Specify the collection name here
 const MusicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    url: String,
    albumCover: String
}, { collection: 'music' });

const User = mongoose.model('User', UserSchema);
const Music = mongoose.model('Music', MusicSchema);

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     console.log('Request Body:', req.body); // Debug incoming request

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             console.log('User not found');
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             console.log('Password does not match');
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         console.log('Login successful for user:', username);
//         res.status(200).json({ message: 'Login successful' });
//     } catch (err) {
//         console.error('Server error:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Request body:', req.body);

    try {
        // Check connection and collection
        console.log('Searching in database: useers, collection: users');

        const user = await User.findOne({ username });
        console.log('User query result:', user);

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful for user:', username);
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save(); // Save user to database
        console.log('User registered successfully:', username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/songs', async (req, res) => {
    try {
        const songs = await Music.find();
        res.status(200).json(songs);
    } catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
