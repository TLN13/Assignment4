import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust path as needed
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function Welcome() {
  const [userDetails, setUserDetails] = useState<{
    first_name: string;
    last_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch additional user details from your user_details table
        const { data, error } = await supabase
          .from('user_details')
          .select('first_name, last_name')
          .eq('uuid', user.id)
          .single();

        if (data) {
          setUserDetails({
            first_name: data.first_name,
            last_name: data.last_name
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      else router.replace('./sign_in');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to My New App </Text>
      
      {userDetails && (
        <Text style={styles.userText}>
          Hello, {userDetails.first_name} {userDetails.last_name}!
        </Text>
      )}

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging out...' : 'Log Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userText: {
    fontSize: 20,
    marginVertical: 20,
    fontFamily: 'Times New Roman',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});