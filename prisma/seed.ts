import { PrismaClient, Sport, MatchStatus, Roles, TournamentStatus, ContestStatus } from '@prisma/client';


const prisma = new PrismaClient();
async function main() {
    console.log("Seeding database with initial data...");
    const teamsData = [
        { externalId: '601420', name: 'Argentina', shortName: 'ARG', primaryColor: '#75AADB', logoUrl: 'https://example.com/arg.png' },
        { externalId: '601421', name: 'France', shortName: 'FRA', primaryColor: '#002395', logoUrl: 'https://example.com/fra.png' },
        { externalId: '601422', name: 'Brazil', shortName: 'BRA', primaryColor: '#FFDF00', logoUrl: 'https://example.com/bra.png' },
        { externalId: '601423', name: 'England', shortName: 'ENG', primaryColor: '#FFFFFF', logoUrl: 'https://example.com/eng.png' },
    ];

    const createdTeams = await Promise.all(teamsData.map(team => prisma.team.upsert({
        where: { name: team.name },
        update: {},
        create: team,
    })));
    console.log(`Teams seeded: ${createdTeams.length} teams.`);

    //seed tournaments
    console.log("Seeding tournaments.");
    const tournamentsData = [
        {
            externalId: '601410',
            name: 'FIFA World Cup 2022',
            startDate: new Date('2022-11-20'),
            endDate: new Date('2022-12-18'),
            sport: Sport.FOOTBALL,
            logoUrl: 'https://example.com/wc2022.png',
            status: TournamentStatus.UPCOMING
        },
        {
            externalId: '601411',
            name: 'UEFA Euro 2020',
            startDate: new Date('2021-06-11'),
            endDate: new Date('2021-07-11'),
            sport: Sport.FOOTBALL,
            logoUrl: 'https://example.com/euro2020.png',
            status: TournamentStatus.COMPLETED
        },
    ];
    const createdTournaments = await Promise.all(tournamentsData.map(tournament => prisma.tournament.upsert({
        where: { name: tournament.name },
        update: {},
        create: tournament,
    })));
    console.log(`Tournaments seeded: ${createdTournaments.length} tournaments.`);

    //seed matches
    console.log("Seeding matches.");
    const matchesData = [
        {
            externalId: '602410',
            homeTeamId: createdTeams[0]!.id,
            awayTeamId: createdTeams[1]!.id,
            matchDate: new Date('2022-12-18T18:00:00Z'),
            status: MatchStatus.SCHEDULED,
            venue: 'Lusail Iconic Stadium'
        },
        {
            externalId: '602411',
            homeTeamId: createdTeams[2]!.id,
            awayTeamId: createdTeams[3]!.id,
            matchDate: new Date('2022-12-18T21:00:00Z'),
            status: MatchStatus.SCHEDULED,
            venue: 'Stadium 2'
        },
    ];
    const createdMatches = await Promise.all(matchesData.map(match => prisma.match.create({
        data: {
            ...match,
            tournamentId: createdTournaments[0]!.id, // Assign to first tournament
        },
    })));
    console.log(`Matches seeded: ${createdMatches.length} matches.`);

    //seed static user
    console.log("Seeding users.");
    const usersData = [
        { email: 'admin@example.com', name: 'Admin User', role: Roles.ADMIN },
        { email: 'user@example.com', name: 'Regular User', role: Roles.USER },
    ];
    const createdUsers = await Promise.all(usersData.map(user => prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
    })));
    console.log(`Users seeded: ${createdUsers.length} users.`);

    // seed contests
    console.log("Seeding contests.");
    // const contest = await prisma.contest.upsert({
    //     where: { id: 'world-cup-final-contest' }, // Using a static ID for seeding reliability
    //     update: {},
    //     create: {
    //         id: 'world-cup-final-contest',
    //         name: "World Cup Final Mega Contest",
    //         matchId: createdMatches[0]!.id, // Links to the match you just seeded
    //         entryFee: 0,
    //         status: ContestStatus.OPEN,
    //     }
    // });

    // 2. Create Questions for that Contest
    const questionsData = [
        {
            text: "Who will win the match?",
            pointValue: 10,
            options: ["Argentina", "France", "Draw"],
            category: "WINNER"
        },
        {
            text: "Total goals scored in the match?",
            pointValue: 20,
            options: ["0-1", "2-3", "4+"],
            category: "STATS"
        },
        {
            text: "Will there be a Red Card?",
            pointValue: 15,
            options: ["Yes", "No"],
            category: "DISCIPLINE"
        }
    ];

    const contest = await prisma.contest.create({
        data: {
            name: "Finals Prediction Mega Pool",
            matchId: createdMatches[0]!.id,
            status: ContestStatus.OPEN,
            entryFee: 0,
            prizePool: 100.0
        }
    });

    // 2. Create Questions linked to that specific Contest
    await prisma.questions.createMany({
        data: [
            {
                contestId: contest.id, // <--- Linking happens here
                text: "Which team will have more possession?",
                pointValue: 15,
                options: ["Argentina", "France"],
            },
            {
                contestId: contest.id,
                text: "Total number of corner kicks?",
                pointValue: 20,
                options: ["0-5", "6-10", "11+"],
            }
        ]
    });

    const contestWithQuestions = await prisma.contest.findUnique({
        where: { id: contest.id },
        include: { questions: true } // This works because of the relation you just defined
    });
}

main()
    .catch(e => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
