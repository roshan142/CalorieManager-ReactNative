import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Button, Card, List,FAB } from 'react-native-paper';

export default function AddCategoryMealScreen({ route, navigation }) {
  const [meals, setMeals] = useState([]);
  const [categoryMeals, setCategoryMeals] = useState([]);
  const { category } = route.params || {}; // Extract category from params

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const savedMeals = await AsyncStorage.getItem('meals');
        const parsedMeals = savedMeals ? JSON.parse(savedMeals) : [];
        setMeals(parsedMeals);
      } catch (error) {
        Alert.alert('Error', 'Failed to load meals');
      }
    };

    const fetchCategoryMeals = async () => {
      try {
        const existingMeals = await AsyncStorage.getItem(`meals_${category}`);
        const parsedCategoryMeals = existingMeals ? JSON.parse(existingMeals) : [];
        setCategoryMeals(parsedCategoryMeals);
      } catch (error) {
        Alert.alert('Error', 'Failed to load category meals');
      }
    };

    fetchMeals();
    fetchCategoryMeals();
    const intervalId = setInterval(fetchMeals, 100); // Set up interval to fetch data every 10 seconds
  
    return () => clearInterval(intervalId);
    
  }, [category]);

  const isMealInCategory = (mealId) => {
    return categoryMeals.some(meal => meal.id === mealId);
  };

  const handleMealToggle = async (meal) => {
    try {
      let updatedCategoryMeals = [...categoryMeals];
      
      if (isMealInCategory(meal.id)) {
        // Remove meal from category
        updatedCategoryMeals = updatedCategoryMeals.filter(m => m.id !== meal.id);
      } else {
        // Add meal to category
        updatedCategoryMeals.push(meal);
      }
      
      // Update AsyncStorage
      await AsyncStorage.setItem(`meals_${category}`, JSON.stringify(updatedCategoryMeals));
      
      // Update local state
      setCategoryMeals(updatedCategoryMeals);
    } catch (error) {
      Alert.alert('Error', 'Failed to update meal in category');
    }
  };

  const handleSave = () => {
    navigation.goBack(); // Navigate back to HomeScreen
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Manage ${category.charAt(0).toUpperCase() + category.slice(1)}`} />
      </Appbar.Header>

      <FlatList
        data={meals}
        renderItem={({ item }) => (
          <Card style={styles.mealCard}>
            <Card.Content>
              <List.Item
                title={item.name}
                right={() => (
                  <Button
                    mode={isMealInCategory(item.id) ? "outlined" : "contained"}
                    onPress={() => handleMealToggle(item)}
                    style={styles.button}
                  >
                    {isMealInCategory(item.id) ? "Remove" : "Add"}
                  </Button>
                )}
              />
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddMeal', "cat")}
      />

      <Button mode="contained" onPress={handleSave} style={styles.doneButton}>
        Done
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  mealCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  button: {
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
    backgroundColor: 'violet',
  },
  doneButton: {
    marginTop: 20,
  },
});
