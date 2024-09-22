import React,{ useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddMealScreen from './screens/AddMealScreen';
import EditMealScreen from './screens/EditMealScreen';
import ViewMealScreen from './screens/ViewMealScreen.js';
import HistoryScreen from './screens/HistoryScreen.js';
import AddCategoryMealScreen from './screens/AddCategoryMealScreen.js';
import settings from './screens/settings.js';
import InputScreen from './screens/inputscreen.js';

const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
      }}>

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ViewMeal" component={ViewMealScreen} />
        <Stack.Screen name="AddMeal" component={AddMealScreen} initialParams={"back"} />
        <Stack.Screen name="EditMeal" component={EditMealScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={settings} />
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="AddCategoryMealScreen" component={AddCategoryMealScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
