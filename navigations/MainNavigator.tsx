import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Pantallas
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SeleccionPersonajeScreen from "../screens/SeleccionPersonajeScreen";
import GameScreen from "../screens/GameScreen";
import ScoreScreen from "../screens/ScoreScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pestañas principales de la aplicación (Juego y Puntajes)
function MyTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: true }}>
            <Tab.Screen
                name="Game"
                component={GameScreen}
                options={{ title: '¡A Jugar!' }}
            />
            <Tab.Screen
                name="Score"
                component={ScoreScreen}
                options={{ title: 'Puntajes' }}
            />
        </Tab.Navigator>
    );
}

// Flujo general (Autenticación -> Selección -> Juego)
function MyStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegisterScreen} />
            <Stack.Screen name="SeleccionarPersonaje" component={SeleccionPersonajeScreen} />
            <Stack.Screen name="Tabs" component={MyTabs} />
        </Stack.Navigator>
    );
}

// Contenedor principal exportado
export function Navegador() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
