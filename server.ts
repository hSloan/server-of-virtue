// import express, { Request, Response } from 'express';
// 
// const app = express();
// 
// app.get('/api/hello', (req: Request, res: Response) => {
//     res.send('Hello, world!');
// });
// 
// const PORT = process.env.PORT || 5000;
// 
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';

const app = express();
const port = 5000;

// Enable CORS for all routes from localhost:3000
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// Enable parsing of JSON bodies
app.use(bodyParser.json());

// Fake users data
// const users = [
//   {
//     username: 'john@doe.com',
//     password: '$2a$10$RTrT.LjyycVK/Ty1CrKWLOkCQ2S4ifOC10CerZIe4b4a4.h4TG.LS', // Password is 'password'
//   },
// ];

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    username: 'john@doe.com',
    password: bcrypt.hashSync('password', 10),
    role: 'Instructor',
  },
  {
    id: 2,
    username: 'jane@doe.com',
    password: bcrypt.hashSync('password', 10),
    role: 'Student',
  },
];

// Authentication route
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;

  // Find user with matching username
  const user = users.find((u) => u.username === username);

  if (!user) {
    // User not found
    return res.status(401).send('Invalid username');
  }

  // Check if password matches hashed password
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    // Password does not match
    return res.status(401).send('Invalid password');
  }

  // Password matches, generate token and send back to client
  // In a real application, this would be a JWT or other authentication token
  res.json({ token: 'some_auth_token', role: user.role});
});

// Registration route
app.post('/api/register', (req, res) => {
  const { username, password, role } = req.body;

  // Check if username is already taken
  const existingUser = users.find((u) => u.username === username);

  if (existingUser) {
    // User already exists
    return res.status(400).send('Username already taken');
  }

  // Generate salt and hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Add new user to users list
  const newUser: User = { id: users.length + 1, username, password: hashedPassword, role };
  users.push(newUser);

  // Send response
  res.sendStatus(201);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

