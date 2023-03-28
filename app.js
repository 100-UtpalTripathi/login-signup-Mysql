const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require('mysql');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html');
});
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: "",
  database: "student",
  connectionLimit: 10,
});

app.post('/register', function (req, res) {

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  var query = `
              INSERT INTO registration
              (username, email, password)
              VALUES("${username}", "${email}", "${password}")
  `;

  pool.query(query, function (err, result) {
    if (err)
      console.log(err);

    else
      res.sendFile(__dirname + '/login.html');
  });
});

app.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  var query = `SELECT * from registration WHERE email = "${email}"`;

  pool.query(query, function (err, result) {
    if (err)
      console.log(err);

    else {
      var temp = -1;
      if (result.length > 0) {
        for (var count = 0; count < result.length; count++) {
          if (result[count].password == password) {
            temp = 0;
            res.send("Successfully logged in!!");
          }
          else if (temp == -1) {
            temp = 1;
          }
        }
      }
      else {
        res.send("Incorrect credentials!");
      }

      if (temp == 1)
        res.send("Incorrect Password!!")
    }
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});
