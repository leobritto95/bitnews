import React from 'react';

import {StatusBar} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Feeds from './src/screens/Feeds';
import Detalhes from './src/screens/Detalhes';
import Comentarios from './src/screens/Comentarios';

const Navigator = createStackNavigator(
  {
    Feeds: {screen: Feeds},
    Detalhes: {screen: Detalhes},
    Comentarios: {screen: Comentarios},
  },
  {
    headerMode: 'none',
  },
);

const Container = createAppContainer(Navigator);

export default function App() {
  return (
    <MenuProvider>
      <StatusBar />
      <Container />
    </MenuProvider>
  );
}
