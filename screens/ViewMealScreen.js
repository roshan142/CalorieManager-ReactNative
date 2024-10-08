import React, { useState, useEffect,useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

export default function ViewMealScreen({ navigation }) {
  const [meals, setMeals] = useState([]);
  const [visibleMeals, setVisibleMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useFocusEffect(
    useCallback(() => {
    const fetchMeals = async () => {
      try {
        const savedMeals = await AsyncStorage.getItem('meals');
        const parsedMeals = savedMeals ? JSON.parse(savedMeals) : [];
        setMeals(parsedMeals);
        setVisibleMeals(parsedMeals.slice(0, itemsPerPage)); // Load the first 4 meals initially
      } catch (error) {
        console.error('Failed to load meals', error);
      }
    };

    fetchMeals();
  }, [])
);

  const loadMoreMeals = () => {
    if (!loading && visibleMeals.length < meals.length) {
      setLoading(true);
      setTimeout(() => {
        const newPage = page + 1;
        const newMeals = meals.slice(0, newPage * itemsPerPage);
        setVisibleMeals(newMeals);
        setPage(newPage);
        setLoading(false);
      }, 1000); // Simulate a network delay
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      const savedMeals = await AsyncStorage.getItem('meals');
      const meals = savedMeals ? JSON.parse(savedMeals) : [];
      const updatedMeals = meals.filter((m) => m.id !== mealId);
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
      setVisibleMeals(updatedMeals.slice(0, page * itemsPerPage)); // Update visible meals
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
          data={visibleMeals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          onEndReached={loadMoreMeals} // Load more when scrolled to the bottom
          onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#000" /> : null} // Show loading spinner
        />
      )}

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
