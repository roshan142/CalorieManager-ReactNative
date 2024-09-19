// screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('mealHistory');
        console.log(savedHistory)
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          const aggregatedHistory = aggregateHistory(parsedHistory);
          setHistory(aggregatedHistory);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load history');
      }
    };

    fetchHistory();
  }, []);

  // Function to aggregate history by date
  const aggregateHistory = (entries) => {
    const aggregated = {};

    entries.forEach(entry => {
      const { date, calories, protein, carbs, fats } = entry;
      if (!aggregated[date]) {
        aggregated[date] = { date, calories: 0, protein: 0, carbs: 0, fats: 0 };
      }
      aggregated[date].calories += calories;
      aggregated[date].protein += protein;
      aggregated[date].carbs += carbs;
      aggregated[date].fats += fats;
    });

    return Object.values(aggregated);
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="History" />
      </Appbar.Header>

      <View style={styles.historyContainer}>
        {history.length === 0 ? (
          <Paragraph>No history available</Paragraph>
        ) : (
          history.map((entry, index) => (
            <Card key={index} style={styles.historyCard}>
              <Card.Content>
                <Title>{entry.date}</Title>
                <Paragraph>Calories: {entry.calories}</Paragraph>
                <Paragraph>Protein: {entry.protein}g</Paragraph>
                <Paragraph>Carbs: {entry.carbs}g</Paragraph>
                <Paragraph>Fats: {entry.fats}g</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  historyContainer: {
    padding: 16,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
});
