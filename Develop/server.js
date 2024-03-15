//requires needed
const express = require('express');
const path = require('path');
const fs = require('fs');
let noteData = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));

//home page route
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

//notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//gets note data
app.get('/api/notes', (req, res) => res.json(noteData));


app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  //checks if fields are filled if they are makes a new note object
  const {title, text} = req.body;
  if(title && text) {
    const newNote = {
      title,
      text,
    };

    //convert object to a string for storing
    //const noteString = JSON.stringify(newNote);
    //console.log(noteString);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);
        noteData = parsedNotes;

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        );
      }
    });


  }

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
