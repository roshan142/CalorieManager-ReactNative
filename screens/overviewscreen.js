import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Appbar, Card, Divider, Subheading, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';

export default function Overview({ navigation }) {
  const [historyData, setHistoryData] = useState([]);
  const [targetCalories, setTargetCalories] = useState(0);
  const [targetProteins, setTargetProteins] = useState(0);
  const [targetFats, setTargetFats] = useState(0);
  const [targetCarbs, setTargetCarbs] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('mealHistory');
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const last7Days = parsedHistory.slice(-7);
        setHistoryData(last7Days);

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setTargetCalories(parsedUserData.calories);
          setTargetProteins(parsedUserData.protein);
          setTargetFats(parsedUserData.fats);
          setTargetCarbs(parsedUserData.carbs);
        }

        // Simulate a loading time of 2 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistoryData();
  }, []);

  const labels = historyData.length > 0 ? historyData.map(entry => moment(entry.date, 'D MMM YYYY').format('ddd')) : [];
  const caloriesData = historyData.length > 0 ? historyData.map(entry => entry.calories) : [];
  const proteinsData = historyData.length > 0 ? historyData.map(entry => entry.protein) : [];
  const fatsData = historyData.length > 0 ? historyData.map(entry => entry.fats) : [];
  const carbsData = historyData.length > 0 ? historyData.map(entry => entry.carbs) : [];

  const charts = [
    {
      title: "Weekly Calorie Intake",
      data: caloriesData,
      color: 'rgba(0, 150, 136, 1)',
      target: targetCalories,
    },
    {
      title: "Weekly Protein Intake",
      data: proteinsData,
      color: 'red',
      target: targetProteins,
    },
    {
      title: "Weekly Fats Intake",
      data: fatsData,
      color: 'blue',
      target: targetFats,
    },
    {
      title: "Weekly Carbs Intake",
      data: carbsData,
      color: 'grey',
      target: targetCarbs,
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Overview" />
      </Appbar.Header>

      {charts.map((chart, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Subheading style={[styles.title, { color: colors.primary }]}>{chart.title}</Subheading>
            {historyData.length > 0 ? (
              <>
                <BarChart
                  data={{
                    labels,
                    datasets: [{ data: chart.data, color: (opacity = 1) => chart.color }],
                  }}
                  width={screenWidth - 48}
                  height={250}
                  yAxisSuffix={chart.title.includes('Calories') ? ' cal' : ' g'}
                  fromZero
                  chartConfig={{
                    backgroundColor: '#f5f5f5',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#e0f7fa',
                    decimalPlaces: 0,
                    color: (opacity = 1) => chart.color,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForHorizontalLabels: {
                      fontSize: 10,
                      color: '#00796b',
                    },
                    propsForVerticalLabels: {
                      fontSize: 10,
                      color: '#00796b',
                    },
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  verticalLabelRotation={0}
                />
                <Divider style={{ marginVertical: 8 }} />
                <Text style={styles.targetLabel}>{`Target: ${chart.target} ${chart.title.includes('Calories') ? 'cal' : 'g'}`}</Text>
              </>
            ) : (
              <Text style={styles.noDataText}>No Data Saved</Text>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  card: {
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  targetLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#757575',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
});
