"use server"

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// Note: You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Export a function that creates and returns a Supabase client
export async function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please check your configuration.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Type for game submission
export type GameSubmission = {
  id?: string;
  title: string;
  url: string;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  description?: string;
  screenshot?: string;
};

// Submit a new game to Supabase
export async function submitGameToSupabase(submission: Omit<GameSubmission, 'id' | 'created_at'>) {
  const supabase = await getSupabaseClient();
  
  // Insert the game into the 'games' table
  const { data, error } = await supabase
    .from('games')
    .insert([{
      title: submission.title,
      url: submission.url,
      description: submission.description,
      screenshot: submission.screenshot,
      status: submission.status,
      submitted_by: submission.submitted_by,
      created_at: new Date().toISOString(),
    }])
    .select();
    
  if (error) {
    console.error('Error submitting game:', error);
    throw new Error('Failed to submit game. Please try again.');
  }
  
  return data?.[0];
}

// Get all submitted games
export async function getSubmittedGamesFromSupabase() {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching submitted games:', error);
    throw new Error('Failed to fetch submitted games.');
  }
  
  return data as GameSubmission[];
}

// Get all approved games
export async function getApprovedGamesFromSupabase() {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching approved games:', error);
    throw new Error('Failed to fetch approved games.');
  }
  
  return data as GameSubmission[];
}

// Update game status (approve/reject)
export async function updateGameStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await getSupabaseClient();
  
  const { error } = await supabase
    .from('games')
    .update({ status })
    .eq('id', id);
    
  if (error) {
    console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} game:`, error);
    throw new Error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} game.`);
  }
  
  return true;
}

// Delete a game
export async function deleteGameFromSupabase(id: string) {
  const supabase = await getSupabaseClient();
  
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting game:', error);
    throw new Error('Failed to delete game.');
  }
  
  return true;
} 