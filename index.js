const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 8000;
const publicPath = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "public", "uploads");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
fs.mkdir(publicPath, {}, (error) => {
  if (error) {
    console.log(error.message);
  }
});
fs.mkdir(uploadsDir, {}, (error) => {
  if (error) {
    console.log(error.message);
  }
});
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()} -- ${file.originalname}`);
  }
});
const upload = multer({ storage });
app.get('/', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="width: 150px; height: auto; margin: 5px;">`).join('');
    var html = `
      <!DOCTYPE html>
        <body>
          <h1>Welcome to Learning</h1>
          <h1>Task manager</h1>
          <p1>This is random filler text to imitate a</p1><br/>
          <p1>description or something, this isn't that</p1><br/>
          <p1>important (thats the point)</p1><br/>
          <form action="/Login" method="get">
            <button type="submit">Login</button>
          </form>
          <form action="/SignUp" method="get">
            <button type="submit">Sign Up</button>
          </form>
        </body>
      </html>
    `;
    res.send(html);
  });
});
app.get('/Login', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="width: 150px; height: auto; margin: 5px;">`).join('');
    var html = `
      <!DOCTYPE html>
        <body>
          <h1>Login to Task Manager</h1>
          <form action="/Login" method="post">
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" required placeholder="Email"><br/>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="Password"><br/>
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `;
    res.send(html);
  });
});
app.get('/SignUp', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="width: 150px; height: auto; margin: 5px;">`).join('');
    var html = `
      <!DOCTYPE html>
        <body>
          <h1>Register</h1>
          <form action="/SignUp" method="post">
            <label for="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required placeholder="Full Name"><br/>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" required placeholder="Email"><br/>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="Password"><br/>
            <label for="repeatPassword">Repeat Password:</label>
            <input type="repeatPassword" id="repeatPassword" name="repeatPassword" required placeholder="Repeat Password"><br/>
            <button type="submit">Register</button>
          </form>
        </body>
      </html>
    `;
    res.send(html);
  });
});
app.post('/SignUp', (req, res) => {
  const { fullName, email, password, repeatPassword } = req.body;
  // Check if passwords match
  if (password !== repeatPassword) {
    return res.status(400).send("Passwords do not match");
  }
  // New user information
  const newUser = {
    fullName: fullName,
    email: email,
    password: password,
  };
  // Define the path to the JSON file
  const loginsFilePath = path.join(__dirname, "logins.json");
  // Read the current contents of the JSON file
  fs.readFile(loginsFilePath, "utf8", (err, data) => {
    let logins = [];
    if (err) {
      if (err.code === "ENOENT") {
        logins = [];
      }
      else {
        return res.status(500).send("Error reading logins file");
      }
    }
    else {
      // Parse the current data in the file
      try {
        logins = JSON.parse(data);
      }
      catch (parseError) {
        return res.status(500).send("Error parsing logins file");
      }
    }
    // Append new user to the array
    logins.push(newUser);
    // Update the logins back to the file
    fs.writeFile(loginsFilePath, JSON.stringify(logins, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).send("Error writing to logins file");
      }
      res.cookie('user', JSON.stringify(newUser), { maxAge: 3600000 });
      res.redirect("/HomePage");
    });
  });
});
app.get('/HomePage', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="width: 150px; height: auto; margin: 5px;">`).join('');
    var html = `
      <!DOCTYPE html>
        <body>
          <h1>Welcome to the Home Page!</h1>
          <p1>Full Name:</p1><p1 id="fullName"></p1><br/>
          <p1>Email:</p1><p1 id="email"></p1><br/>
          <p1>Password:</p1><p1 id="password"></p1><br/>
          <script>
            function phase1(){
              const userCookie = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, "$1");
              // Read the user from the cookie
              const user = JSON.parse(decodeURIComponent(userCookie));  // Parse the cookie value into an object
              // If the cookie is present, store it in localStorage
              if (user) {
                localStorage.setItem('user', JSON.stringify(user));
              }
            }
            function phase2(){
              const user = JSON.parse(localStorage.getItem('user'));
              document.getElementById('fullName').innerText = user.fullName;
              document.getElementById('email').innerText = user.email;
              document.getElementById('password').innerText = user.password;
            }
            phase1();
            phase2();
          </script>
        </body>
      </html>
    `;
    res.send(html);
  });
});
app.post('/upload', upload.single('image'), (req, res) => {
  res.redirect("/");
});
app.get('/images', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads directory');
    }
    const images = files.map(file => `<img src="/uploads/${file}" alt="${file}" style="width: 150px; height: auto; margin: 5px;">`).join('');
    const html = `
      <!DOCTYPE html>
        <body>
          <h1>Uploaded Images</h1>
          <div>${images}</div>
          <a href="/">Go To /</a>
        </body>
      </html>
    `;
    res.send(html);
  });
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));