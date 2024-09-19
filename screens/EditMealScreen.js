import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Appbar, Card, Title, Paragraph } from 'react-native-paper';

export default function EditMealScreen({ route, navigation }) {
  const { meal } = route.params; // Access the passed meal
  const [mealName, setMealName] = useState(meal.name);
  const [calories, setCalories] = useState(meal.calories.toString());
  const [protein, setProtein] = useState(meal.protein.toString());
  const [carbs, setCarbs] = useState(meal.carbs.toString());
  const [fats, setFats] = useState(meal.fats.toString());

  const updateMeal = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];

      const updatedMeals = meals.map((m) =>
        m.id === meal.id
          ? { ...m, name: mealName, calories: parseInt(calories), protein: parseInt(protein), carbs: parseInt(carbs), fats: parseInt(fats) }
          : m
      );

      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update the meal');
    }
  };

  const deleteMeal = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];

      const updatedMeals = meals.filter((m) => m.id !== meal.id);
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the meal');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Edit Meal" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
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
            <Button mode="contained" onPress={updateMeal} style={styles.button}>
              Update Meal
            </Button>
            <Button mode="contained" onPress={deleteMeal} style={[styles.button, styles.deleteButton]}>
              Delete Meal
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});
