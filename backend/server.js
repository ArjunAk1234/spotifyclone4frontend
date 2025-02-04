const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/audio'); // Save uploaded files to public/songs folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
//   },
// });

// const upload = multer({ storage: storage });

// // POST /upload-song
// // POST /upload-song
// app.post('/upload-song', upload.single('file'), async (req, res) => {
//   const { title, artist } = req.body;
//   const fileUrl = `/public/audio/${req.file.filename}`; // Path to the uploaded song file

//   if (!title || !artist || !req.file) {
//     return res.status(400).json({ message: 'Missing title, artist, or file' });
//   }

//   try {
//     const newSong = new Music({
//       title,
//       artist,
//       genre: 'Unknown', // Default genre
//       url: fileUrl, // Path to the uploaded song file
//       albumCover: '', // Optional: Add album cover if needed
//     });

//     await newSong.save();
//     res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
//   } catch (err) {
//     console.error('Error uploading song:', err);
//     res.status(500).json({ message: 'Error uploading song' });
//   }
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'file') {
      cb(null, 'public/audio'); // Store songs in public/songs
    } else if (file.fieldname === 'albumCover') {
      cb(null, 'public/images'); // Store album covers in public/album-covers
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid overwriting
  },
});

const upload = multer({ storage: storage });

// POST /upload-song
app.post('/upload-song', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'albumCover', maxCount: 1 }]), async (req, res) => {
  const { title, artist } = req.body;

  const fileUrl = `audio/${req.files['file'][0].filename}`; // Song file URL
  const albumCoverUrl = req.files['albumCover'] ? `images/${req.files['albumCover'][0].filename}` : ''; // Album cover URL

  if (!title || !artist || !req.files['file']) {
    return res.status(400).json({ message: 'Missing title, artist, or song file' });
  }

  try {
    const newSong = new Music({
      title,
      artist,
      genre: 'Unknown', // Default genre
      url: fileUrl, // Path to the uploaded song file
      albumCover: albumCoverUrl, // Path to the uploaded album cover
    });

    await newSong.save();
    res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
  } catch (err) {
    console.error('Error uploading song:', err);
    res.status(500).json({ message: 'Error uploading song' });
  }
});
require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/music', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
const uri1 = "mongodb+srv://ananthakrishnans0608:ArjunAk1234@spotify1.gqzqg.mongodb.net/music?retryWrites=true&w=majority&appName=spotify1";
mongoose.connect(uri1)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => console.error(' MongoDB connection error:', err));
// mongoose.connect(uri1, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
  
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'user' });

const MusicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  url: String,
  albumCover: String
}, { collection: 'music' });

const PlaylistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }]
}, { collection: 'playlist' });

const Playlist = mongoose.model('Playlist', PlaylistSchema);
const User = mongoose.model('User', UserSchema);
const Music = mongoose.model('Music', MusicSchema);

// POST /register
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
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /songs
app.get('/songs', async (req, res) => {
  try {
    const songs = await Music.find();
    res.status(200).json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Playlist
app.post('/playlists', async (req, res) => {
  const { name, userId } = req.body;

  try {
    const newPlaylist = new Playlist({
      userId,
      name,
      songs: []
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /playlists
app.get('/playlists', async (req, res) => {
  const { userId } = req.query; // Assuming userId is passed as query param

  try {
    const playlists = await Playlist.find({ userId }).populate('songs');
    res.status(200).json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/playlists/:playlistId/songs', async (req, res) => {
    const { playlistId } = req.params;
    const { songId } = req.body; // Expect a single songId, not an array

    if (!songId) {
        return res.status(400).json({ message: 'songId is required' });
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        // Check if song already exists in the playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already exists in the playlist' });
        }

        // Add the song to the playlist
        playlist.songs.push(songId);
        await playlist.save();

        res.status(200).json(playlist);
    } catch (err) {
        console.error('Error adding song to playlist:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// // Remove Song from Playlist
// app.delete('/playlists/:playlistId/songs/:songId', async (req, res) => {
//   const { playlistId, songId } = req.params;

//   try {
//     const playlist = await Playlist.findById(playlistId);
//     if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

//     playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
//     await playlist.save();

//     res.status(200).json(playlist);
//   } catch (err) {
//     console.error('Error removing song from playlist:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


app.delete('/playlists/:playlistId/songs/:songId', async (req, res) => {
    const { playlistId, songId } = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ success: false, message: 'Playlist not found' });
        }

        // Convert songId to MongoDB ObjectId
        const songObjectId = new mongoose.Types.ObjectId(songId);

        // Ensure songs array does not contain null values
        playlist.songs = playlist.songs.filter(song => song && song.toString() !== songObjectId.toString());

        // Save updated playlist
        await playlist.save();

        res.status(200).json({ success: true, updatedPlaylist: playlist });
    } catch (err) {
        console.error('Error removing song from playlist:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.delete('/playlists/:playlistId', async (req, res) => {
  try {
      const { playlistId } = req.params;

      const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
      if (!deletedPlaylist) {
          return res.status(404).json({ success: false, message: 'Playlist not found' });
      }

      res.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (err) {
      console.error('Error deleting playlist:', err);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));
