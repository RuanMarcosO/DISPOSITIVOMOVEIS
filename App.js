import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas
import TelaLogin from './TelaLogin';
import CadAlunos from './CadAlunos';
import Agenda from './Agenda'; // A tela de Agenda

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaLogin">
        <Stack.Screen name="TelaLogin" component={TelaLogin} 
          options={{
            headerTitle: '',
          }} 
        />
        <Stack.Screen name="CadAlunos" component={CadAlunos} 
          options={{
            headerTitle: '',
            headerBackTitle: 'Voltar ao login', 
          }} 
        />
        <Stack.Screen name="Agenda" component={Agenda} 
          options={{
            headerTitle: 'Agendamentos',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;