const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8000;
const publicPath = path.join(__dirname, "public");
const uploadsDir = path.join(__dirname, "public", "uploads");
app.use(express.static(__dirname + "/public"));
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
            <button type="submit">SignUp</button>
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