"use server"

import { redirect } from "next/navigation"
import { 
  submitGameToSupabase, 
  getSubmittedGamesFromSupabase,
  getApprovedGamesFromSupabase,
  updateGameStatus,
  deleteGameFromSupabase
} from './supabase'

// In-memory implementation for fallback when Supabase is not configured
const submittedGames: any[] = []
const approvedGames: any[] = []

// Helper to extract a title from a URL
function getTitleFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    // Clean up domain name to make a nicer title
    return domain
      .replace(/^www\./, '')
      .replace(/\.(com|io|net|org|gg|app)$/, '')
      .split('.')
      .join(' ')
      .split('-')
      .join(' ')
      .split('_')
      .join(' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  } catch {
    return url.split('/')[0];
  }
}

// Helper function to generate a screenshot URL
function generateScreenshotUrl(url: string): string | undefined {
  try {
    const gameUrl = new URL(url);
    const domain = gameUrl.hostname;
    // Generate a screenshot using thum.io service
    return `https://image.thum.io/get/width/600/crop/900/https://${domain}`;
  } catch {
    return undefined;
  }
}

export async function submitGame(formData: FormData) {
  // Validate the form data
  const url = formData.get("url") as string

  if (!url) {
    throw new Error("Game URL is required")
  }

  // Generate screenshot
  const screenshot = generateScreenshotUrl(url);

  // Create a new game object
  const newGameSubmission = {
    title: getTitleFromUrl(url),
    url,
    submitted_by: "anonymous",
    status: 'pending' as const,
    description: `Game submission from website`, 
    screenshot,
    created_at: new Date().toISOString(), // Adding created_at here for better sorting
  }

  // Check for Supabase configuration
  const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    if (hasSupabaseConfig) {
      // Try to submit to Supabase
      await submitGameToSupabase(newGameSubmission);
      console.log("Game submitted to Supabase successfully!");
    } else {
      throw new Error("Supabase not configured");
    }
  } catch (error) {
    console.warn('Using in-memory fallback for game submission:', error);
    
    // Fallback to in-memory storage
    const inMemoryGame = {
      id: `submitted-${Date.now()}`,
      ...newGameSubmission,
      submitted_by: "anonymous",
    };
    
    // Add to global submittedGames array
    submittedGames.push(inMemoryGame);
    console.log("Game added to in-memory storage, accessible in admin panel at /admin");
  }

  // Redirect to a success page
  redirect("/submit/success")
}

// Get all submitted games for the admin page
export async function getSubmittedGames() {
  try {
    // Try to fetch from Supabase first
    const games = await getSubmittedGamesFromSupabase();
    
    // Transform the data to match the expected format
    return games.map(game => ({
      id: game.id,
      title: game.title,
      url: game.url,
      submittedBy: { email: game.submitted_by },
      status: game.status,
      createdAt: game.created_at,
    }));
  } catch (error) {
    console.warn('Failed to fetch from Supabase, using in-memory fallback:', error);
    // Fallback to in-memory storage
    return submittedGames;
  }
}

// Get approved games
export async function getApprovedGames() {
  try {
    // Try to fetch from Supabase first
    const games = await getApprovedGamesFromSupabase();
    
    // Transform to match the expected format for game cards
    return games.map(game => ({
      id: game.id || `approved-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: game.title,
      url: game.url,
      description: game.description || `Approved game submission`,
      screenshot: game.screenshot,
    }));
  } catch (error) {
    console.warn('Failed to fetch from Supabase, using in-memory fallback:', error);
    // Fallback to in-memory storage
    return approvedGames;
  }
}

// Approve a game
export async function approveGame(formData: FormData) {
  const id = formData.get("id") as string
  
  try {
    // Try to approve via Supabase first
    await updateGameStatus(id, 'approved');
  } catch (error) {
    console.warn('Failed to approve game in Supabase, using in-memory fallback:', error);
    
    // Fallback to in-memory implementation
    const gameIndex = submittedGames.findIndex((game) => game.id === id);
    if (gameIndex !== -1) {
      const game = submittedGames[gameIndex];
      game.status = "approved";

      // Add to approved games
      approvedGames.push({
        id: game.id,
        title: game.title,
        url: game.url,
        description: `Game submitted by ${game.submitted_by}`,
        approvedAt: new Date().toISOString(),
      });
    }
  }

  redirect("/admin")
}

// Reject a game
export async function rejectGame(formData: FormData) {
  const id = formData.get("id") as string
  
  try {
    // Try to reject via Supabase first
    await updateGameStatus(id, 'rejected');
  } catch (error) {
    console.warn('Failed to reject game in Supabase, using in-memory fallback:', error);
    
    // Fallback to in-memory implementation
    const gameIndex = submittedGames.findIndex((game) => game.id === id);
    if (gameIndex !== -1) {
      submittedGames[gameIndex].status = "rejected";
    }
  }

  redirect("/admin")
}

// Delete a game
export async function deleteGame(formData: FormData) {
  const id = formData.get("id") as string
  
  try {
    // Try to delete via Supabase first
    await deleteGameFromSupabase(id);
  } catch (error) {
    console.warn('Failed to delete game in Supabase, using in-memory fallback:', error);
    
    // Fallback to in-memory implementation
    const gameIndex = submittedGames.findIndex((game) => game.id === id);
    if (gameIndex !== -1) {
      submittedGames.splice(gameIndex, 1);
    }
    
    // Also check in approved games
    const approvedIndex = approvedGames.findIndex((game) => game.id === id);
    if (approvedIndex !== -1) {
      approvedGames.splice(approvedIndex, 1);
    }
  }

  redirect("/admin")
}

