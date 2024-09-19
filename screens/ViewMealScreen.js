import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FAB, Card, Title, Paragraph, Button, Appbar } from 'react-native-paper';

export default function ViewMealScreen({ navigation }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const savedMeals = await AsyncStorage.getItem('meals');
        const parsedMeals = savedMeals ? JSON.parse(savedMeals) : [];
        setMeals(parsedMeals);
      } catch (error) {
        console.error('Failed to load meals', error);
      }
    };

  const intervalId = setInterval(fetchMeals, 100); // Set up interval to fetch data every 10 seconds
  
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  

  const deleteMeal = async (mealId) => {
    try {
      // Step 1: Retrieve the saved main 'meals' list from AsyncStorage
      const savedMeals = await AsyncStorage.getItem('meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];
  
      // Step 2: Filter out the meal with the matching mealId
      const updatedMeals = meals.filter((m) => m.id !== mealId);
  
      // Step 3: Save the updated meals list back to AsyncStorage
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
  
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the meal');
    }
  };
  

  const renderMeal = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.cardParagraph}>Calories: {item.calories} cal</Paragraph>
        <Paragraph style={styles.cardParagraph}>Protein: {item.protein}g</Paragraph>
        <Paragraph style={styles.cardParagraph}>Carbs: {item.carbs}g</Paragraph>
        <Paragraph style={styles.cardParagraph}>Fats: {item.fats}g</Paragraph>
      </Card.Content>
      <Card.Actions>
      <Button mode="contained" onPress={() => navigation.navigate('EditMeal', { meal: item })}>
          Edit
        </Button>
      <Button mode="contained" onPress={() => deleteMeal(item.id)} style={[styles.button, styles.deleteButton]}>
              Delete
          </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="View Meals" />
      </Appbar.Header>
      <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Title style={styles.title}>Total Meals: {meals.length}</Title>}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddMeal')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  title: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Make space for FAB
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardParagraph: {
    fontSize: 16,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'violet',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});
