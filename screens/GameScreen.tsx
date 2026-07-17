import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";

export default function GameScreen() {
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time]);

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Atrapa Sombras</Text>
            <Text style={globalStyles.scoreText}>Puntaje: {score}</Text>
            <Text style={globalStyles.scoreText}>Tiempo: {time}</Text>
        </View>
    );
}
