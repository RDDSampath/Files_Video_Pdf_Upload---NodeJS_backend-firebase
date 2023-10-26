const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());
app.use(express.json());

const multer = require('multer');
const firebase = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MSID,
  appId: APPID,
  measurementId: MID
};

firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Handle PDF upload
app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('No PDF file uploaded.');
      return;
    }

    const storageRef = ref(storage, req.file.originalname);
    const metadata = {
      contentType: 'application/pdf',
    };

    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    console.log('Uploaded a PDF file!');
    
    const url = await getDownloadURL(storageRef);
    res.send(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Handle video upload
app.post('/upload/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('No video file uploaded.');
      return;
    }

    const storageRef = ref(storage, req.file.originalname);
    const metadata = {
      contentType: 'video/mp4',
    };

    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    console.log('Uploaded a video file!');
    
    const url = await getDownloadURL(storageRef);
    res.send(url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
