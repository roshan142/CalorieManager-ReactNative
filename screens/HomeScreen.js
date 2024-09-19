import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Button, Title, Paragraph, FAB } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
  });
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const now = moment();
        const savedMeals = await AsyncStorage.multiGet(['meals_breakfast', 'meals_lunch', 'meals_snack', 'meals_dinner']);
        const mealData = {
          breakfast: JSON.parse(savedMeals[0][1]) || [],
          lunch: JSON.parse(savedMeals[1][1]) || [],
          snack: JSON.parse(savedMeals[2][1]) || [],
          dinner: JSON.parse(savedMeals[3][1]) || [],
        };
        setMeals(mealData);
        calculateTotals(mealData);
  
  
        if (now.hour() === 23 && now.minute() === 50) {
          saveDailyTotals();
        }
        if (now.hour() === 23 && now.minute() === 55) {
          resetMeals();
        }
  
      } catch (error) {
        Alert.alert('Error', 'Failed to load meals');
      }
    };
  
    fetchMeals(); // Fetch data immediately on mount
  
    const intervalId = setInterval(fetchMeals, 1000); // Set up interval to fetch data every 10 seconds
  
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);
  
  const calculateTotals = (mealsData) => {
    const newTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };

    for (const category in mealsData) {
      mealsData[category].forEach(meal => {
        newTotals.calories += meal.calories || 0;
        newTotals.protein += meal.protein || 0;
        newTotals.carbs += meal.carbs || 0;
        newTotals.fats += meal.fats || 0;
      });
    }

    setTotals(newTotals);
  };


  const saveDailyTotals = async () => {
    try {
      const todayDate = moment().format('D MMM YYYY');
      const historyData = {
        date: todayDate,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fats: totals.fats,
      };

      const existingHistory = await AsyncStorage.getItem('mealHistory');
      let historyArray = existingHistory ? JSON.parse(existingHistory) : [];

      const existingDateIndex = historyArray.findIndex(entry => entry.date === todayDate);
      if (existingDateIndex > -1) {
        historyArray[existingDateIndex] = historyData;
      } else {
        historyArray.push(historyData);
      }

      await AsyncStorage.setItem('mealHistory', JSON.stringify(historyArray));

    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const resetMeals = async () => {
    try {
      await AsyncStorage.multiRemove([
        'meals_breakfast',
        'meals_lunch',
        'meals_snack',
        'meals_dinner',
      ]);

      setMeals({
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: [],
      });
      setTotals({ calories: 0, protein: 0, carbs: 0, fats: 0 });

    } catch (error) {
      Alert.alert('Error', 'Failed to reset meal data');
    }
  };

  const renderMealCard = (mealType, title) => (
    <Card style={styles.mealCard} key={mealType}>
      <Card.Content>
        <Title>{title}</Title>
        {(meals[mealType] || []).length > 0 ? (
          (meals[mealType] || []).map((meal, index) => (
            <Paragraph key={index}>
              {meal.name} - Calories: {meal.calories}, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fats: {meal.fats}g 
            </Paragraph>
          ))
        ) : (
          <Paragraph>No meals added</Paragraph>
        )}
      </Card.Content>
      <Card.Actions>
      <Button mode="outlined" onPress={() => AsyncStorage.removeItem(`meals_${mealType}`)}>Clear</Button>
        <Button mode="contained" onPress={() => navigation.navigate('AddCategoryMealScreen', { category: mealType })}>
          Add Meal
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Today, {moment().format('D MMM YYYY')}</Text>
      </View>

      <View style={styles.totalsContainer}>
        <Card style={styles.totalCard}>
          <Card.Content>
            <Title>Today's Total</Title>
            <Paragraph>Calories: {totals.calories}</Paragraph>
            <Paragraph>Protein: {totals.protein}g</Paragraph>
            <Paragraph>Carbs: {totals.carbs}g</Paragraph>
            <Paragraph>Fats: {totals.fats}g</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.mealsContainer}>
        {renderMealCard('breakfast', 'Breakfast')}
        {renderMealCard('lunch', 'Lunch')}
        {renderMealCard('snack', 'Snack')}
        {renderMealCard('dinner', 'Dinner')}
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Calories History</Title>
          <Paragraph>See the history of everyday Macros</Paragraph>
        </Card.Content>
        <Card.Actions>
        <Button mode="outlined" onPress={() => AsyncStorage.removeItem('mealHistory')}>Clear</Button>
        <Button mode="contained" onPress={() => navigation.navigate('History')} icon="history">History</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>View Meals</Title>
          <Paragraph>See the list of all your meals</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={() => navigation.navigate('ViewMeal')}>View</Button>
          <Button mode="contained" onPress={() => navigation.navigate('AddMeal')} icon="plus">Add</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dateContainer: {
    padding: 16,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalsContainer: {
    padding: 16,
  },
  totalCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  mealsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mealCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
});
