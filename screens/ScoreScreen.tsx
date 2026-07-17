import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";

export default function ScoreScreen() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Puntuaciones</Text>
            <Text style={globalStyles.scoreText}>Mejor Puntaje:</Text>
        </View>
    );
}
