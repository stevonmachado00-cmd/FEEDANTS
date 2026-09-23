import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CompetitionDetailsScreen from '../screens/CompetitionDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CompetitionDetails"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="CompetitionDetails"
        component={CompetitionDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
