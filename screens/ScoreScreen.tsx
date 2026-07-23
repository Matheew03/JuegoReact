import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../supabase/config";
import { globalStyles } from "../styles/GlobalStyles";

export default function ScoreScreen() {
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchScores = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("scores")
            .select("*")
            .order("puntaje", { ascending: false }); 

        if (error) {
            console.error("Error al traer puntuaciones:", error);
        } else {
            setScores(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchScores();
    }, []);

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <ActivityIndicator size="large" color="red" />
                <Text style={globalStyles.scoreText}>Cargando puntuaciones...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Puntuaciones</Text>
            <FlatList
                data={scores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Text style={styles.rank}>{index + 1}.</Text>
                        <Text style={styles.user}>{item.usuario}</Text>
                        <Text style={styles.score}>{item.puntaje}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "gray",
    },
    rank: { color: "yellow", fontSize: 18 },
    user: { color: "white", fontSize: 18 },
    score: { color: "lightgreen", fontSize: 18, fontWeight: "bold" },
});
