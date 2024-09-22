import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Appbar } from 'react-native-paper';

export default function InputScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Check if input values are already saved in AsyncStorage
  useEffect(() => {
    const checkStoredValue = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          // If data exists, skip this screen and navigate to HomeScreen
          navigation.replace('Home');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to check stored data');
      }
    };
    checkStoredValue();
  }, []);

  // Function to save input data
  const handleSave = async () => {
    if (!name || !age || !weight || !calories || !protein || !carbs || !fats) {
      Alert.alert('Missing Fields', 'Please fill out all fields');
      return;
    }

    const userData = {
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fats: parseInt(fats),
    };

    try {
      // Save user input data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Navigate to HomeScreen
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tell Something About You!</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
        placeholder="Age"
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ''))}
        placeholder="Weight"
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={(text) => setCalories(text.replace(/[^0-9]/g, ''))}
        placeholder="Calorie"
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={protein}
        onChangeText={(text) => setProtein(text.replace(/[^0-9]/g, ''))}
        placeholder="Protein"
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={carbs}
        onChangeText={(text) => setCarbs(text.replace(/[^0-9]/g, ''))}
        placeholder="Carbs"
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        value={fats}
        onChangeText={(text) => setFats(text.replace(/[^0-9]/g, ''))}
        placeholder="Fats"
        keyboardType="numeric"
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Done
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 22,
    marginVertical: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
