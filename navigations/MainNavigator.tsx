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

function MyStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegisterScreen} />
            <Stack.Screen name="SeleccionarPersonaje" component={SeleccionPersonajeScreen}/>
            <Stack.Screen name="Tabs" component={MyTabs} />
        </Stack.Navigator>
    )
}

function MyTabs(){
    return(
        <Tab.Navigator>
            
            <Tab.Screen name="Game" component={GameScreen}/>
            <Tab.Screen name="Score" component={ScoreScreen}/>
        </Tab.Navigator>
    )
}

export function Navegador(){
    return(
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    )
}