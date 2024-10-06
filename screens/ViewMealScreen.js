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

  const intervalId = setInterval(fetchMeals, 100); 
  
    return () => clearInterval(intervalId);
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
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Total Meals: {meals.length}</Title>
      </View>

       {meals.length === 0 ? (
          <Paragraph style={styles.noMeals}>No Meals Available</Paragraph>
        ) : (
          <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />  
        )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddMeal','notu')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  noMeals: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
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
    backgroundColor: 'grey',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});
