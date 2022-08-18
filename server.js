const express = require("express");
const { Logger } = require("mongodb");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 3000;
require("dotenv").config();
const fetch = require("node-fetch");

let db,
  dbConnectionStr = process.env.DB_STRING,
  // replace ... with a string representing the name of the database
  dbName = "APODTemplate",
  myCollection;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
    // replace ... with a string representing the name of the collection
    myCollection = db.collection("Pictures");
  }
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// process.env.PORT is so heroku can choose a port for our app
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port 3000`);
});

app.get("/", (req, res) => {
  myCollection
    // use .find to get elements from the database
    .find()
    .toArray()
    //   .then is for the result
    .then((data) => {
      // response.render defines the file that is going to render the ejs, and the object we are passing to ejs takes form of {key : value}
      // console.log(data.slice(-17));
      res.render("index.ejs", { pictures: data.slice(-17) });
      // res.render("index.ejs");
    })
    .catch((error) => console.error(error));
});

// replace ... with the route has the form of '/...'
app.post("/getPic", async (request, response) => {
  // console.log(request.body.date);
  //Get today's date using the JavaScript Date object.
  let ourDate = new Date();

  //Change it so that it is 7 days in the past.
  let pastDate = ourDate.getDate() - 17;
  ourDate.setDate(pastDate);

  //Log the date to our web console.
  // console.log(new Date(ourDate));
  let year, month, day;
  // console.log(ourDate.getFullYear());
  // console.log(ourDate.getMonth());
  // console.log(ourDate.getDate());
  year = ourDate.getFullYear();
  // console.log(ourDate.getMonth() < 50);
  if (ourDate.getMonth() < 10) {
    month = `0${ourDate.getMonth() + 1}`;
  } else {
    month = ourDate.getMonth() + 1;
  }

  if (ourDate.getDate() < 10) {
    day = `0${ourDate.getDate()}`;
  } else {
    day = ourDate.getDate();
  }

  let daySince = `${year}-${month}-${day}`;

  // console.log(`${year}-${month}-${day}`);
  // console.log(new Date(request.body.date));

  // console.log(new Date(daySince) < new Date(request.body.date));

  if (new Date(daySince) <= new Date(request.body.date)) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=ebT5998P6DYNoZ3kSfAD1BJKdP4xEDWKljXfcjdW&start_date=${daySince}&thumbs=true`;
    const fetch_response = await fetch(url);
    const data = await fetch_response.json();
    data.dateAdded = request.body.date;
    // console.log(new Date(data.dateAdded).getDate() - 17);
    // console.log(data);
    myCollection
      // replace ... with what you want to insert into the database usually request.body
      // to add individual fields it takes the form of {key: value , ...}
      .insertMany(data)
      .then((result) => {
        // replace ... with custom message for the post being run
        console.log("nasa object uploaded");
        response.redirect("/");
      })
      .catch((error) => console.error(error));
  } else {
    // console.log(request.body.date);
    //Get today's date using the JavaScript Date object.
    let oldOurDate = new Date(request.body.date);

    //Change it so that it is 7 days in the past.
    let oldPastDate = oldOurDate.getDate() - 15;
    oldOurDate.setDate(oldPastDate);

    //Log the date to our web console.
    // console.log(new Date(ourDate));
    let oldYear, oldMonth, oldDay;
    // console.log(ourDate.getFullYear());
    // console.log(ourDate.getMonth());
    // console.log(ourDate.getDate());
    oldYear = oldOurDate.getFullYear();
    // console.log(ourDate.getMonth() < 50);
    if (oldOurDate.getMonth() < 10) {
      oldMonth = `0${oldOurDate.getMonth() + 1}`;
    } else {
      oldMonth = oldOurDate.getMonth() + 1;
    }

    if (oldOurDate.getDate() < 10) {
      oldDay = `0${oldOurDate.getDate()}`;
    } else {
      oldDay = oldOurDate.getDate();
    }

    let oldDaySince = `${oldYear}-${oldMonth}-${oldDay}`;
    console.log(request.body.date);
    console.log(oldDaySince);

    const url = `https://api.nasa.gov/planetary/apod?api_key=ebT5998P6DYNoZ3kSfAD1BJKdP4xEDWKljXfcjdW&start_date=${oldDaySince}&end_date=${request.body.date}&thumbs=true`;
    const oldFetchResponse = await fetch(url);
    const oldData = await oldFetchResponse.json();
    // console.log(new Date(data.dateAdded).getDate() - 17);
    // console.log(oldData);
    myCollection
      // replace ... with what you want to insert into the database usually request.body
      // to add individual fields it takes the form of {key: value , ...}
      .insertMany(oldData)
      .then((result) => {
        // replace ... with custom message for the post being run
        console.log("nasa object uploaded");
        response.redirect("/");
      })
      .catch((error) => console.error(error));
  }

  // console.log("hi");
  // const url = `https://api.nasa.gov/planetary/apod?api_key=ebT5998P6DYNoZ3kSfAD1BJKdP4xEDWKljXfcjdW&start_date=${request.body.date}&thumbs=true`;
  // const fetch_response = await fetch(url);
  // const data = await fetch_response.json();
  // data.dateAdded = request.body.date;
  // console.log(new Date(data.dateAdded).getDate() - 17);
  // console.log(data);
  // myCollection
  //   // replace ... with what you want to insert into the database usually request.body
  //   // to add individual fields it takes the form of {key: value , ...}
  //   .insertMany(data)
  //   .then((result) => {
  //     // replace ... with custom message for the post being run
  //     console.log("nasa object uploaded");
  //     response.redirect("/");
  //   })
  //   .catch((error) => console.error(error));
});

// // replace ... with the route has the form of '/...'
// app.put("/fav", (request, response) => {
//   console.log(request.body);
//   // first agrument is the filter which finds a specific document
//   // takes form of {key : value, ...}
//   // replace first ... with the key the key comes from what is defined in mongo
//   // replace second ... with value which is usually request.body...
//   myCollection
//     .updateOne(
//       { hdurl: request.body.hdurl },
//       {
//         // second argument defines what part of the object to change
//         $set: {
//           // takes the form of {key: value}
//           // replace first ... with the key that will be updated same as the key in mongo
//           // replace second ... with the new value usually request.body...
//           favorite: true,
//         },
//       }
//       // has optional third argument for options
//       //   ,{
//       //     sort: {_id: -1},
//       //     upsert: true
//       // }
//     )
//     .then((result) => {
//       // replace ... with server console log for successful put
//       console.log("made favorite on the server");
//       // replace ... with what message you are ending back to the client
//       response.json("made favorite on the client");
//     })
//     .catch((error) => console.error(error));
// });

// app.put("/removefav", (request, response) => {
//   console.log(request.body);
//   // first agrument is the filter which finds a specific document
//   // takes form of {key : value, ...}
//   // replace first ... with the key the key comes from what is defined in mongo
//   // replace second ... with value which is usually request.body...
//   myCollection
//     .updateOne(
//       { hdurl: request.body.hdurl },
//       {
//         // second argument defines what part of the object to change
//         $set: {
//           // takes the form of {key: value}
//           // replace first ... with the key that will be updated same as the key in mongo
//           // replace second ... with the new value
//           favorite: false,
//         },
//       }
//       // has optional third argument for options
//       //   ,{
//       //     sort: {_id: -1},
//       //     upsert: true
//       // }
//     )
//     .then((result) => {
//       // replace ... with server console log for successful put
//       console.log("removed favorite on the server");
//       // replace ... with what message you are ending back to the client
//       response.json("removed favorite on the client");
//     })
//     .catch((error) => console.error(error));
// });

// // replace ... with the route has the form of '/...'
// app.delete('...', (request, response) => {
//   // deleteOne takes the form {key : value}
//   // replace first ... with the key the key comes from what is defined in mongo
//   // replace second ... with the value usually request.body...
//   myCollection.deleteOne({...: ...})
//   .then(result => {
//     // message from server if delete goes through
//       console.log('...')
//       // message sent to client if delete goes through
//       response.json('...')
//   })
//   .catch(error => console.error(error))

// })
