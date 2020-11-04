const express = require ('express');
const cors = require ('cors');

const app = express ();
app.use (express.json ());
app.use (cors ());
app.use (express.urlencoded ({extended: true}));

//Use this array as your (in-memory) data store.
const bookings = require ('./bookings.json');

app.get ('/', function (request, response) {
  response.send ('Hotel booking server.  Ask for /bookings, etc.');
});

// return all of the bokkings
app.get ('/bookings', (req, res) => {
  res.send (bookings);
});

//Level 5 search with given term

app.get ('/bookings/search', (req, res) => {
  let term = req.query.term;
  let filtered = bookings.filter (
    booking =>
      booking.firstName.includes (term) ||
      booking.surname.includes (term) ||
      booking.email.includes (term)
  );
  if (filtered) {
    res.json (filtered);
  } else {
    res.sendStatus (404);
  }
});

//for Level3 date validation
let moment = require ('moment');
//moment.format ();
app.get ('/bookings/search', (req, res) => {
  let chosenDate = req.query.date;
  if (moment (chosenDate, 'YYYY-MM-DD').isValid ()) {
    let searchedBooking = bookings.filter (booking =>
      moment (booking.checkInDate).isBefore (chosenDate)
    );
    if (searchedBooking) {
      res.json (searchedBooking);
    } else {
      res.send ('Date is not the right format');
    }
  }
});

//display booking by id
app.get ('/bookings/:id', (req, res) => {
  const id = req.params.id;
  const searchedBooking = bookings.find (booking => booking.id == id);
  if (searchedBooking) {
    res.json (searchedBooking);
  } else {
    res.sendStatus (404);
  }
});

// Add new booking
var validator = require ('email-validator');

app.post ('/bookings', (req, res) => {
  let booking = req.body;
  let check = 0;
  booking.id = bookings.length + 1;

  if (
    booking.id !== null &&
    booking.id != '' &&
    (booking.title !== null && booking.title != '') &&
    (booking.firstName !== null && booking.firstName != '') &&
    (booking.surname !== null && booking.surname != '') &&
    (booking.email !== null && booking.email != '') &&
    (booking.roomId !== null && booking.roomId != '') &&
    (booking.checkInDate !== null && booking.checkInDate != '') &&
    (booking.checkOutDate !== null && booking.checkOutDate != '')
  ) {
    check = 1;
  }

  if (!validator.validate (booking.email)) {
    res.send ('not valid email');
  } else if (!moment (booking.checkOutDate).isAfter (booking.checkInDate)) {
    res.send ('check out date is before check in date');
  } else if (check === 1) {
    bookings.push (booking);
    res.send ('One record added');
  } else {
    res.sendStatus (400);
  }
});

//delete by id

app.delete ('/bookings/:id', (req, res) => {
  const id = req.params.id;
  const searchedBooking = bookings.findIndex (booking => id == booking.id);
  if (searchedBooking) {
    console.log (searchedBooking);
    bookings.splice (searchedBooking, 1);
    res.send (bookings);
  } else {
    res.sendStatus (404);
  }
});

// let dateTime = moment ().format ('YYYY-MM-DD');

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
const listener = app.listen (3000, () => {
  console.log ('hey your server is running');
});
