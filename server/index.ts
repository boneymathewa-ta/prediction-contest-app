import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma.js';
import adminRoutes from './routes/admin.routes.js';
import sspi from "node-sspi";
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;

const nodeSSPI = new sspi({
  offerBasic: false, // Don't offer Basic auth (username/password prompt)
  offerNTLM: true, // Enable NTLM
  offerNegotiate: true, // Enable Negotiate (tries Kerberos, falls back to NTLM)
});

app.use(express.json()); // Parses JSON bodies

app.use('/api/admin', adminRoutes);

// Middleware
app.use(cors()); // Allows React to connect


// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 Sports Prediction API is running!');
});

// Windows Authentication

app.get(
  "/api/auth/windows",
  (req, res, next) => {
    nodeSSPI.authenticate(req, res, (err) => {
      if (res.finished) {
        // Handshake in progress (401 sent), STOP execution here.
        return;
      }
      if (err) {
        return next(err);
      }
      // Authentication successful, move to the next function block
      next();
    });
  },
  (req, res) => {
    // 2. This block ONLY runs if next() was called above
    try {
      let username = req.connection.user;
      console.log("Raw authenticated username:", username);
      if (!username) {
        return res.status(401).json({
          error: "Authentication failed",
          message: "Unable to retrieve Windows credentials",
        });
      }

      // Clean up username
      if (username.includes("\\")) {
        username = username.split("\\")[1];
      }

      console.log("✓ User authenticated automatically:", username);

      const jwtToken = jwt.sign(
        {
          username: username,
          authMethod: "windows",
          iat: Math.floor(Date.now() / 1000),
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );

      // Send successful response
      res.json({
        success: true,
        token: jwtToken,
        username: username,
        expiresIn: 28800,
        message: "Authenticated via Windows credentials",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      // Safety check: don't send if headers already went out
      if (!res.headersSent) {
        res.status(500).json({
          error: "Server Error",
          message: error.message,
        });
      }
    }
  },
);

// GET: All Users from Database
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST: Create a new User
// app.post('/api/users', async (req, res) => {
//   const { email, name } = req.body;
//   try {
//     const newUser = await prisma.user.create({
//       data: { email, name },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ error: 'User already exists' });
//   }
// });

//POST: Create a tournament
app.post('/api/tournaments', async (req, res) => {
  const data = req.body.tournamentData || req.body;
  const { name, startDate, endDate, sport, logoUrl } = data;
  console.log('Received tournament data:', data); // Debug log
  try {
    const newTournament = await prisma.tournament.create({
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate), sport, logoUrl }
    });
    res.status(201).json(newTournament);
  } catch (error) {
    console.error("❌ Prisma Create Error:", error);
    res.status(400).json({ error: 'Tournament already exists or invalid data' + error });
  }
});

app.get('/api/tournaments', async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

app.get('/api/tournaments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: id },
    });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

app.put('/api/tournaments/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body.tournamentData || req.body;
  try {
    const updatedTournament = await prisma.tournament.update({
      where: { id: id },
      data: data,
    });
    res.json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tournament' });
  }
});

app.delete('/api/tournaments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tournament.delete({
      where: { id: id },
    });
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tournament' });
  }
});

app.get('/api/contests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: id },
    });
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contest' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Server started successfully!`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});