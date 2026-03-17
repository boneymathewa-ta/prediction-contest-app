import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/admin', adminRoutes);

// Middleware
app.use(cors()); // Allows React to connect
app.use(express.json()); // Parses JSON bodies

// --- ROUTES ---

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 Sports Prediction API is running!');
});

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