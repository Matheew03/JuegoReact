import { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
import CardSombras from "../Components/CardSombras";
import { sombras } from "../types/sombras";

const { width, height } = Dimensions.get("window");
const SIZE = 80;

export default function GameScreen({ route }: any) {
    const { personaje } = route.params; 
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [activeShadows, setActiveShadows] = useState<any[]>([]);


    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => setTime(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time]);


    useEffect(() => {
        if (time > 0) {
            const intervalo = personaje.alias === "Skull" ? 800 : 400; 
            const interval = setInterval(() => {
                if (activeShadows.length < 5) {
                    for (let i = 0; i < 2; i++) {
                        const randomShadow = sombras[Math.floor(Math.random() * sombras.length)];
                        const randomTop = Math.floor(Math.random() * (height - SIZE));
                        const randomLeft = Math.floor(Math.random() * (width - SIZE));
                        const newShadow = {
                            ...randomShadow,
                            id: Date.now() + i,
                            top: randomTop,
                            left: randomLeft
                        };
                        setActiveShadows(prev => [...prev, newShadow]);
                        setTimeout(() => {
                            setActiveShadows(prev => prev.filter(s => s.id !== newShadow.id));
                        }, 1000);
                    }
                }
            }, intervalo);
            return () => clearInterval(interval);
        }
    }, [time, activeShadows, personaje]);


    const handleCatch = (id: number, puntos: number) => {
        let extra = puntos;

        if (personaje.alias === "Joker") {
            extra = puntos * 2; 
        }

        if (personaje.alias === "Panther") {
            setTime(prev => prev + 2); 
        }

        if (personaje.alias === "Mona") {
            if (Math.random() < 0.5) { 
                extra = puntos * 1.5;
            }
        }

        setScore(prev => prev + extra);
        setActiveShadows(prev => prev.filter(s => s.id !== id));
    };

    return (
        <View style={globalStyles.container}>


            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={globalStyles.title}>Atrapa Sombras</Text>
                <Text style={globalStyles.scoreText}>Jugador: {personaje.alias}</Text>
                <Text style={globalStyles.scoreText}>Puntaje: {score}</Text>
                <Text style={globalStyles.scoreText}>Tiempo: {time}</Text>
            </View>



            <View style={{ flex: 1, position: "relative" }}>
                {activeShadows.map(sombra => (
                    <CardSombras
                        key={sombra.id}
                        onCatch={() => handleCatch(sombra.id, sombra.puntos)}
                        active={time > 0}
                        image={sombra.image}
                        top={sombra.top}
                        left={sombra.left}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
