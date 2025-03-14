// This is a helper script to assist with capturing screenshots for all games

// Games to capture (copied from app/page.tsx)
const allGames = [
  {
    id: "15",
    title: "FPS Warehouse",
    url: "https://fps-warehouse.netlify.app/",
    filename: "fps-warehouse.png",
  },
  {
    id: "16",
    title: "3D Solar System",
    url: "https://solarsystem.connekt.studio/",
    filename: "3d-solar-system.png",
  },
  {
    id: "17",
    title: "Crossy Roads Clone",
    url: "https://ueqmvyno.manus.space",
    filename: "crossy-roads.png",
  },
  {
    id: "18",
    title: "Polytrack",
    url: "http://beta-polytrack.kodub.com",
    filename: "polytrack.png",
  },
  {
    id: "19",
    title: "Party",
    url: "https://party.wearezizo.com",
    filename: "party.png",
  },
  {
    id: "20",
    title: "Vibe Sail",
    url: "http://vibesail.com",
    filename: "vibe-sail.png",
  },
  {
    id: "10",
    title: "Fly Pieter",
    url: "https://fly.pieterlevels.com",
    filename: "fly-pieter.png",
  },
  {
    id: "1",
    title: "Kawaii Characters",
    url: "https://kawaiicharacters.pretzel.design",
    filename: "kawaii-characters.png",
  },
  {
    id: "14",
    title: "Pulsr Quanta",
    url: "https://pulsrquanta.com",
    filename: "pulsr-quanta.png",
  }
];

// Print instructions
console.log("=== Screenshot Helper ===");
console.log("To capture screenshots for all games, follow these steps for each game:");
console.log("1. Open the URL in your browser");
console.log("2. Take a screenshot (cmd+shift+4 on Mac, Win+Shift+S on Windows)");
console.log("3. Save it to the public/screenshots folder with the filename provided");
console.log("4. Move to the next game");
console.log("\n=== Games to Screenshot ===\n");

// Print each game's info
allGames.forEach((game, index) => {
  console.log(`Game ${index + 1}: ${game.title}`);
  console.log(`URL: ${game.url}`);
  console.log(`Save as: public/screenshots/${game.filename}`);
  console.log("-".repeat(50));
});

console.log("\nAfter you've taken all screenshots, be sure they're saved in the public/screenshots folder!"); 