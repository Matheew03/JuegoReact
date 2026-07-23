import { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
import CardSombras from "../Components/CardSombras";
import { sombras } from "../types/sombras";

const { width, height } = Dimensions.get("window");
const SIZE = 80;

// Margen de seguridad para que no aparezcan fuera de la pantalla visible
const MAX_TOP = height - SIZE - 100;
const MAX_LEFT = width - SIZE - 20;

export default function GameScreen({ route }: any) {
    const personaje = route?.params?.personaje;

    if (!personaje) {
        return (
            <View style={globalStyles.container}>
                <Text>No se recibió el personaje.</Text>
            </View>
        )
    }

    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [activeShadows, setActiveShadows] = useState<any[]>([]);

    // Timer del juego
    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => setTime(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time]);

    // Generador de sombras corregido
    useEffect(() => {
        if (time <= 0) return;

        const intervalo = personaje.alias === "Skull" ? 800 : 400;

        const interval = setInterval(() => {
            setActiveShadows(prev => {
                // Límite máximo de 5 sombras simultáneas
                if (prev.length >= 5) return prev;

                const nuevasSombras: any[] = [];

                for (let i = 0; i < 2; i++) {
                    const randomShadow = sombras[Math.floor(Math.random() * sombras.length)];
                    const randomTop = Math.floor(Math.random() * MAX_TOP);
                    const randomLeft = Math.floor(Math.random() * MAX_LEFT);

                    // ID único combinando tiempo, iteración y un número aleatorio
                    const shadowId = `${Date.now()}-${i}-${Math.random()}`;

                    const newShadow = {
                        ...randomShadow,
                        id: shadowId,
                        top: randomTop,
                        left: randomLeft
                    };

                    nuevasSombras.push(newShadow);

                    // Auto-eliminación después de 1 segundo
                    setTimeout(() => {
                        setActiveShadows(current => current.filter(s => s.id !== shadowId));
                    }, 1000);
                }

                return [...prev, ...nuevasSombras];
            });
        }, intervalo);

        return () => clearInterval(interval);
    }, [time, personaje.alias]); // Removido activeShadows de las dependencias

    const handleCatch = (id: string, puntos: number) => {
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
