import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator  } from 'react-native';
import { Button, TextInput, Card, Title, useTheme  } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Setting({ navigation }) {

  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const resetData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Data Reset', 'All data has been reset.');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset data');
    }
  };



  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Reset Options</Title>
          <Button mode="outlined" onPress={() => AsyncStorage.removeItem('mealHistory')} style={styles.resetButton}>
            Reset Calorie History
          </Button>
          <Button mode="outlined" onPress={() => AsyncStorage.removeItem('meals')} style={styles.resetButton}>
            Reset Meals
          </Button>
          <Button mode="outlined" onPress={resetData} style={styles.resetButton}>
            Reset All Data
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
          <Card.Content>
            <Title>History</Title>
            <Text>See the History for all your meals</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate('History')} icon={'history'}>
              View
            </Button>
          </Card.Actions>
        </Card>
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#3e3e3e',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  resetButton: {
    marginVertical: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});
