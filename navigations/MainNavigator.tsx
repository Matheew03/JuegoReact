import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SeleccionPersonajeScreen from "../screens/SeleccionPersonajeScreen";
import GameScreen from "../screens/GameScreen";
import ScoreScreen from "../screens/ScoreScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#485685", },
                headerTintColor: "white",
                tabBarActiveTintColor: "white",
                tabBarActiveBackgroundColor: "#485685",
                tabBarStyle: { backgroundColor: "#535c7a", },
            }}
        >
            <Tab.Screen name="Juego" component={GameScreen} />
            <Tab.Screen name="Puntuaciones" component={ScoreScreen} />
        </Tab.Navigator>
    );
}

export function MainNavigator() {
    return (
        <NavigationContainer>

            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: { backgroundColor: "#485685", },
                    headerTintColor: "white",
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registro" component={RegisterScreen} />
                <Stack.Screen name="SeleccionPersonaje" component={SeleccionPersonajeScreen} />
                <Stack.Screen name="AtrapaSombras" component={MainTabs}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}