import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native"; // Quitado Dimensions
import { globalStyles } from "../styles/GlobalStyles";
import CardSombras from "../Components/CardSombras";
import { sombras } from "../types/sombras";
import { supabase } from "../supabase/config";
import { auth } from "../firebase/Config";

const SIZE = 80;

export default function GameScreen({ route }: any) {
    const personaje = route?.params?.personaje;

    if (!personaje) {
        return (
            <View style={globalStyles.container}>
                <Text>No se recibió el personaje.</Text>
            </View>
        );
    }

    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [activeShadows, setActiveShadows] = useState<any[]>([]);

    const [gameArea, setGameArea] = useState({ width: 0, height: 0 });


    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [time]);


    useEffect(() => {
        if (time <= 0) return;

        if (gameArea.width === 0 || gameArea.height === 0) return;

        const intervalo = personaje.alias === "Skull" ? 800 : 400;

        const interval = setInterval(() => {
            setActiveShadows((prev) => {
                if (prev.length >= 5) return prev;

                const nuevasSombras: any[] = [];

                for (let i = 0; i < 2; i++) {
                    const randomShadow = sombras[Math.floor(Math.random() * sombras.length)];


                    const maxTop = gameArea.height - SIZE;
                    const maxLeft = gameArea.width - SIZE;

                    const randomTop = Math.max(0, Math.floor(Math.random() * maxTop));
                    const randomLeft = Math.max(0, Math.floor(Math.random() * maxLeft));

                    const shadowId = `${Date.now()}-${i}-${Math.random()}`;

                    const newShadow = {
                        ...randomShadow,
                        id: shadowId,
                        top: randomTop,
                        left: randomLeft,
                    };

                    nuevasSombras.push(newShadow);

                    setTimeout(() => {
                        setActiveShadows((current) => current.filter((s) => s.id !== shadowId));
                    }, 1000);
                }

                return [...prev, ...nuevasSombras];
            });
        }, intervalo);

        return () => clearInterval(interval);
    }, [time, personaje.alias, gameArea]); 


    const handleCatch = (id: string, puntos: number) => {
        let extra = puntos;

        if (personaje.alias === "Joker") {
            extra = puntos * 2;
        }

        if (personaje.alias === "Mona") {
            if (Math.random() < 0.5) {
                extra = puntos * 1.5;
            }
        }

        if (personaje.alias === "Panther" && Math.random() < 0.30) {
            setActiveShadows((prev) => {
                const puntosTotalesPantalla = prev.reduce((total, s) => total + (s.puntos || 0), 0);
                setScore((scorePrev) => scorePrev + puntosTotalesPantalla);
                return [];
            });
            return;
        }

        setScore((prev) => prev + extra);
        setActiveShadows((prev) => prev.filter((s) => s.id !== id));
    };

    useEffect(() => {
        if (time === 0) {
            const guardarPuntaje = async () => {
                const { error } = await supabase.from("scores").insert([
                    {
                        usuario: auth.currentUser?.email || personaje.alias,
                        puntaje: score,
                        fecha: new Date().toISOString(),
                    },
                ]);
                if (error) {
                    console.error(" Error guardando puntaje:", error);
                } else {
                    console.log("Puntaje guardado en Supabase:", score);
                }
            };
            guardarPuntaje();
        }
    }, [time]);

    return (
        <View style={globalStyles.container}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={globalStyles.title}>Atrapa Sombras</Text>
                <Text style={globalStyles.scoreText}>Jugador: {personaje.alias}</Text>
                <Text style={globalStyles.scoreText}>Puntaje: {score}</Text>
                <Text style={globalStyles.scoreText}>Tiempo: {time}</Text>
            </View>


            <View
                style={{ flex: 1, position: "relative", width: "100%" }}
                onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setGameArea({ width, height });
                }}
            >
                {activeShadows.map((sombra) => (
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
