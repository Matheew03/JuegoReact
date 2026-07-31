import { useEffect, useRef, useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import CardSombras from "../Components/CardSombras";
import { auth } from "../firebase/Config";
import { supabase } from "../supabase/config";
import { sombras } from "../types/sombras";

const SIZE = 80;


const jokerFSounds = [
    require("../assets/sounds/jokerF.mp3"),
    require("../assets/sounds/jokerF2.mp3"),
    require("../assets/sounds/jokerF3.mp3"),
];
const monaFSound = require("../assets/sounds/monaF.mp3");
const pantherFSound = require("../assets/sounds/pantherF.mp3");
const skullFSounds = [
    require("../assets/sounds/skullF.mp3"),
    require("../assets/sounds/skullF2.mp3"),
];


const sombraSound = require("../assets/sounds/sombra.mp3");
const timeSound = require("../assets/sounds/time.mp3");

const colorsByAlias: Record<string, string> = {
    Joker: "#ff1f4b",
    Skull: "#f0c419",
    Panther: "#ff5c9d",
    Mona: "#4db8ff",
};


const JOKER_SOUND_CHANCE = 0.4;

export default function GameScreen({ route }: any) {
    const personaje = route?.params?.personaje;
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [activeShadows, setActiveShadows] = useState<any[]>([]);
    const [gameArea, setGameArea] = useState({ width: 0, height: 0 });
    const [gameId, setGameId] = useState(0);
    const savedGameId = useRef<number | null>(null);
    const timeSoundPlayed = useRef(false);

    const jokerF1 = useAudioPlayer(jokerFSounds[0]);
    const jokerF2 = useAudioPlayer(jokerFSounds[1]);
    const jokerF3 = useAudioPlayer(jokerFSounds[2]);
    const monaFPlayer = useAudioPlayer(monaFSound);
    const pantherFPlayer = useAudioPlayer(pantherFSound);
    const skullF1 = useAudioPlayer(skullFSounds[0]);
    const skullF2 = useAudioPlayer(skullFSounds[1]);

    const sombraPlayer = useAudioPlayer(sombraSound);
    const timePlayer = useAudioPlayer(timeSound);

    const jokerFPlayers = [jokerF1, jokerF2, jokerF3];
    const skullFPlayers = [skullF1, skullF2];

    const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
        player.seekTo(0);
        player.play();
    };

    const playRandom = (players: ReturnType<typeof useAudioPlayer>[]) => {
        const player = players[Math.floor(Math.random() * players.length)];
        playSound(player);
    };

    useEffect(() => {
        if (personaje?.alias === "Skull") {
            playRandom(skullFPlayers);
        }
    }, [gameId]);

    const restartGame = () => {
        setScore(0);
        setTime(30);
        setActiveShadows([]);
        setGameId((previous) => previous + 1);
        timeSoundPlayed.current = false;
    };

    useEffect(() => {
        if (time <= 0) return;

        const timer = setInterval(() => {
            setTime((previous) => Math.max(0, previous - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    useEffect(() => {
        if (time === 10 && !timeSoundPlayed.current) {
            playSound(timePlayer);
            timeSoundPlayed.current = true;
        }
    }, [time]);

    useEffect(() => {
        if (!personaje || time <= 0 || gameArea.width === 0 || gameArea.height === 0) {
            return;
        }

        const intervalo = personaje.alias === "Skull" ? 800 : 400;

        const interval = setInterval(() => {
            setActiveShadows((previous) => {
                if (previous.length >= 5) return previous;

                const newShadows = Array.from({ length: 2 }, (_, index) => {
                    const shadow = sombras[Math.floor(Math.random() * sombras.length)];
                    const maxTop = Math.max(0, gameArea.height - SIZE);
                    const maxLeft = Math.max(0, gameArea.width - SIZE);
                    const id = `${Date.now()}-${index}-${Math.random()}`;

                    setTimeout(() => {
                        setActiveShadows((current) => current.filter((item) => item.id !== id));
                    }, 1000);

                    return {
                        ...shadow,
                        id,
                        top: Math.floor(Math.random() * maxTop),
                        left: Math.floor(Math.random() * maxLeft),
                    };
                });

                return [...previous, ...newShadows].slice(0, 5);
            });
        }, intervalo);

        return () => clearInterval(interval);
    }, [time, personaje?.alias, gameArea]);

    const handleCatch = (id: string, puntos: number) => {
        if (!personaje || time <= 0) return;

        let extra = puntos;

        playSound(sombraPlayer);

        if (personaje.alias === "Joker") {
            extra = puntos * 2;
            if (Math.random() < JOKER_SOUND_CHANCE) {
                playRandom(jokerFPlayers);
            }
        }

        if (personaje.alias === "Mona" && Math.random() < 0.5) {
            extra = puntos * 1.5;
            playSound(monaFPlayer);
        }

        if (personaje.alias === "Panther" && Math.random() < 0.3) {
            playSound(pantherFPlayer);
            setActiveShadows((previous) => {
                const puntosTotales = previous.reduce((total, shadow) => total + shadow.puntos, 0);
                setScore((previousScore) => previousScore + puntosTotales);
                return [];
            });
            return;
        }

        setScore((previous) => previous + extra);
        setActiveShadows((previous) => previous.filter((shadow) => shadow.id !== id));
    };


    useEffect(() => {
        if (!personaje || time !== 0 || savedGameId.current === gameId) return;

        savedGameId.current = gameId;

        const guardarPuntaje = async () => {
            const { error } = await supabase.from("scores").insert([
                {
                    usuario: auth.currentUser?.email || personaje.alias,
                    personaje: personaje.alias,
                    puntaje: Math.round(score),
                    fecha: new Date().toISOString(),
                },
            ]);

            if (error) {
                console.error("Error guardando puntaje:", error);
                Alert.alert("Error", "No se pudo guardar el puntaje.");
            }
        };

        guardarPuntaje();
    }, [time, score, gameId, personaje?.alias]);

    if (!personaje) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No se recibió el personaje.</Text>
            </View>
        );
    }

    const themeColor = colorsByAlias[personaje.alias] || "#ff1f4b";

    return (
        <ImageBackground
            source={require("../assets/fondojuego.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>PHANTOM THIEVES OPERATION</Text>
                    <Text style={styles.title}>ATRAPA SOMBRAS</Text>
                </View>

                <View style={styles.hud}>
                    <View style={[styles.playerCard, { borderColor: themeColor }]}>
                        <Text style={styles.hudLabel}>LADRÓN ELEGIDO</Text>
                        <Text style={[styles.playerName, { color: themeColor }]}>{personaje.alias}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.hudLabel}>PUNTAJE</Text>
                        <Text style={styles.scoreValue}>{score}</Text>
                    </View>

                    <View style={[styles.statCard, time <= 10 && styles.dangerCard]}>
                        <Text style={styles.hudLabel}>TIEMPO</Text>
                        <Text style={[styles.timeValue, time <= 10 && styles.dangerText]}>{time}s</Text>
                    </View>
                </View>

                {time === 0 && (
                    <TouchableOpacity
                        onPress={restartGame}
                        style={[styles.restartButton, { backgroundColor: themeColor }]}
                    >
                        <Text style={styles.restartText}>JUGAR OTRA VEZ</Text>
                    </TouchableOpacity>
                )}

                <View
                    style={[styles.gameArea, { borderColor: themeColor }]}
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    overlay: {
        backgroundColor: "rgba(4, 4, 8, 0.45)",
        flex: 1,
        padding: 16,
    },
    errorContainer: {
        alignItems: "center",
        backgroundColor: "#080808",
        flex: 1,
        justifyContent: "center",
    },
    errorText: { color: "white", fontSize: 17 },
    header: { alignItems: "center", marginBottom: 14 },
    eyebrow: {
        color: "#d7d7d7",
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 1.6,
    },
    title: {
        color: "white",
        fontSize: 27,
        fontWeight: "bold",
        letterSpacing: 1,
        marginTop: 3,
    },
    hud: { flexDirection: "row", gap: 8, marginBottom: 12 },
    playerCard: {
        backgroundColor: "rgba(6, 8, 15, 0.88)",
        borderRadius: 10,
        borderWidth: 2,
        flex: 1.25,
        padding: 10,
    },
    statCard: {
        alignItems: "center",
        backgroundColor: "rgba(6, 8, 15, 0.88)",
        borderColor: "#4a4f5b",
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        padding: 10,
    },
    dangerCard: { borderColor: "#ff1f4b" },
    hudLabel: { color: "#bfc3ca", fontSize: 9, fontWeight: "bold", letterSpacing: 0.8 },
    playerName: { fontSize: 19, fontWeight: "bold", marginTop: 3 },
    scoreValue: { color: "#71d5ff", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    timeValue: { color: "white", fontSize: 20, fontWeight: "bold", marginTop: 3 },
    dangerText: { color: "#ff516d" },
    restartButton: {
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 12,
        paddingVertical: 13,
    },
    restartText: { color: "white", fontSize: 15, fontWeight: "bold", letterSpacing: 0.8 },
    gameArea: {
        backgroundColor: "rgba(0, 0, 0, 0.36)",
        borderRadius: 16,
        borderWidth: 2,
        flex: 1,
        overflow: "hidden",
        position: "relative",
    },
});
