//requires needed
const express = require('express');
const path = require('path');
const fs = require('fs');
let noteData = require('./db/db.json');
//const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));

//home page route
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

//notes page route
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//gets note data
app.get('/api/notes', (req, res) => res.json(noteData));

//delete notes
app.delete(`/api/notes/:id`, (req, res) => {
  console.log("delete request called" + req.params.id);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      let parsedNotes = JSON.parse(data);
      
      parsedNotes = parsedNotes.filter(function( obj ) {
        return obj.id !== req.params.id;
      });
      console.log(parsedNotes);
      noteData = parsedNotes;

      // Write updated reviews back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('updated notes')
      );
    }
  });
});

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);
  const id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  //checks if fields are filled if they are makes a new note object
  const {title, text} = req.body;
  if(title && text) {
    const newNote = {
      title,
      text,
      id,
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note to the json file
        parsedNotes.push(newNote);
        //updates note data with changes to json file
        noteData = parsedNotes;

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('updated notes')
        );
      }
    });


  }

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
