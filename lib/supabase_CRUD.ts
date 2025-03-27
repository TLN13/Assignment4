// src/lib/supabase/supabase.crud.ts
import { supabase } from './supabase';

// User CRUD Operations
export const UserService = {
  // Create a new user in user_details table
  async createUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const { data, error } = await supabase
      .from('user_details')
      .insert([
        {
          uuid: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data?.[0];
  },

  // Get user profile by ID
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_details')
      .select('*')
      .eq('uuid', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: {
      first_name?: string;
      last_name?: string;
      email?: string;
    }
  ) {
    const { data, error } = await supabase
      .from('user_details')
      .update(updates)
      .eq('uuid', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data?.[0];
  },

  // Delete user profile
  async deleteUserProfile(userId: string) {
    const { error } = await supabase
      .from('user_details')
      .delete()
      .eq('uuid', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }

    return true;
  },
};

// Auth Operations
export const AuthService = {
  // Sign up with email and password
  async signUpWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    if (data.user) {
      // Create user profile in user_details table
      await UserService.createUserProfile(
        data.user.id,
        firstName,
        lastName,
        email
      );
    }

    return data;
  },

  // Sign in with email and password
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }

    return true;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }

    return data.user;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }

    return data.session;
  },
};