require('dotenv').config();

const app = require('./src/app');
const initTables = require('./src/db/init_tables'); // adjust path if needed
const seedSpaces = require('./src/db/seedSpaces'); // adjust path if needed

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database tables
    await initTables();
    console.log("Database initialized");

    await seedSpaces();
    console.log("Database seeded with spaces");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`SpaceBook server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();