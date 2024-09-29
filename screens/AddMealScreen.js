import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Card, Title, Paragraph,Appbar } from 'react-native-paper';

const max = 10000;

export default function AddMealScreen({ route,navigation }) {
  const { from } = route.params;
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const addMeal = async () => {
    if (!mealName || !calories || !protein || !carbs || !fats) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const newMeal = {
      id: Math.floor(Math.random() * max),
      name: mealName,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fats: parseInt(fats),
    };

    try {
      const savedMeals = await AsyncStorage.getItem('meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];
      const updatedMeals = [...meals, newMeal];
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add the meal');
    }
  };

  const fromtab = () =>{ 
    if(from ==="cat"){
      navigation.navigate('ViewMeal')
    } else {
      navigation.goBack()
    }

  };

  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => fromtab()} />
        <Appbar.Content title="Go Back" />
      </Appbar.Header>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add a New Meal</Title>
          <TextInput
            mode="outlined"
            label="Meal Name"
            value={mealName}
            onChangeText={setMealName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Calories"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Protein (g)"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Carbs (g)"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Fats (g)"
            keyboardType="numeric"
            value={fats}
            onChangeText={setFats}
            style={styles.input}
          />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={addMeal} style={styles.button}>
            Add Meal
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    width: '100%',
  },
});
