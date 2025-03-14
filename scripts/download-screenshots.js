// This script automatically downloads screenshots for all games
// Note: You must have Node.js installed with the 'node-fetch' package
// Install with: npm install node-fetch

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Games to capture screenshots for
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
    url: "https://fly.pieter.com",
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

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log(`Created directory: ${screenshotsDir}`);
}

// Function to generate a screenshot URL using a screenshot service
function getScreenshotUrl(url) {
  try {
    const domain = new URL(url).hostname;
    // Using thum.io service as an example
    return `https://image.thum.io/get/width/1200/crop/675/maxAge/24/https://${domain}`;
  } catch (error) {
    console.error(`Error generating screenshot URL for ${url}:`, error);
    return null;
  }
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`Downloading: ${url}`);
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filename);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`Successfully downloaded: ${filename}`);
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete the file on error
          console.error(`Error saving file ${filename}:`, err);
          reject(err);
        });
      } else {
        console.error(`Failed to download ${url}, status code: ${response.statusCode}`);
        reject(new Error(`HTTP Status Code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err);
      reject(err);
    });
  });
}

// Create a special function just for the fly-pieter game
async function downloadFlyPieterScreenshot() {
  try {
    console.log(`Re-downloading screenshot for Fly Pieter from the new URL...`);
    const screenshotUrl = `https://image.thum.io/get/width/600/crop/900/https://fly.pieter.com`;
    const outputPath = path.join(process.cwd(), 'public', 'screenshots', 'fly-pieter.png');
    
    await downloadImage(screenshotUrl, outputPath);
    console.log(`Successfully updated screenshot for Fly Pieter at ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading Fly Pieter screenshot:`, error);
  }
}

// Process all games sequentially
async function processGames() {
  console.log('Starting screenshot download process...');
  
  // First download the Fly Pieter screenshot specifically
  await downloadFlyPieterScreenshot();
  
  // Then process all other games
  for (const game of allGames) {
    // Skip Fly Pieter as we've already handled it
    if (game.id === "10") continue;
    
    const screenshotUrl = getScreenshotUrl(game.url);
    if (!screenshotUrl) {
      console.log(`Skipping ${game.title} due to error generating URL`);
      continue;
    }
    
    const outputPath = path.join(screenshotsDir, game.filename);
    
    try {
      await downloadImage(screenshotUrl, outputPath);
      console.log(`Downloaded screenshot for ${game.title}`);
    } catch (error) {
      console.error(`Failed to download screenshot for ${game.title}:`, error);
    }
  }
  
  console.log('Finished processing all games!');
}

// Run the script
processGames().catch(error => {
  console.error('Error in main process:', error);
}); 