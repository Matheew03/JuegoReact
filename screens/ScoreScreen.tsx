import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase/Config";
import { supabase } from "../supabase/config";

const characterColors: Record<string, string> = {
  Joker: "#ff4d68",
  Skull: "#f4c542",
  Panther: "#ff79b5",
  Mona: "#71d5ff",
};

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

  const correoActual = auth.currentUser?.email;
  const mejorPuntaje = scores.find((item) => item.usuario === correoActual);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#71d5ff" />
        <Text style={styles.loadingText}>Consultando el registro...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THE VELVET ROOM</Text>
        <Text style={styles.title}>Registro de Puntuaciones</Text>
        <Text style={styles.subtitle}>Elige tu destino. Demuestra tu poder.</Text>
      </View>

      <View style={styles.personalBest}>
        <Text style={styles.personalBestLabel}>TU MEJOR PUNTAJE</Text>
        <Text style={styles.personalBestValue}>
          {mejorPuntaje ? `${mejorPuntaje.puntaje} pts` : "Aún no registrado"}
        </Text>
      </View>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no hay partidas registradas.</Text>}
        renderItem={({ item, index }) => {
          const personaje = item.personaje || "Desconocido";
          const characterColor = characterColors[personaje] || "#b7c8e8";

          return (
            <View style={[styles.item, index === 0 && styles.firstPlace]}>
              <View style={styles.rankBadge}>
                <Text style={styles.rank}>#{index + 1}</Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.personaje, { color: characterColor }]}>{personaje}</Text>
                <Text numberOfLines={1} style={styles.user}>{item.usuario}</Text>
              </View>

              <Text style={styles.score}>{item.puntaje} pts</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07142e",
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#b7c8e8",
    marginTop: 12,
  },
  header: {
    alignItems: "center",
    borderBottomColor: "#2855a6",
    borderBottomWidth: 1,
    paddingBottom: 18,
  },
  eyebrow: {
    color: "#f5c542",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2.5,
  },
  title: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 7,
    textAlign: "center",
  },
  subtitle: {
    color: "#b7c8e8",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  personalBest: {
    alignItems: "center",
    backgroundColor: "#102a5c",
    borderColor: "#f5c542",
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
    paddingVertical: 12,
  },
  personalBestLabel: {
    color: "#f5c542",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  personalBestValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 3,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    alignItems: "center",
    backgroundColor: "#102a5c",
    borderColor: "#2855a6",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    minHeight: 68,
    paddingHorizontal: 12,
  },
  firstPlace: {
    borderColor: "#f5c542",
  },
  rankBadge: {
    alignItems: "center",
    backgroundColor: "#07142e",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  rank: {
    color: "#f5c542",
    fontSize: 15,
    fontWeight: "bold",
  },
  playerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  personaje: {
    fontSize: 17,
    fontWeight: "bold",
  },
  user: {
    color: "#b7c8e8",
    fontSize: 13,
    marginTop: 3,
  },
  score: {
    color: "#71d5ff",
    fontSize: 17,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#b7c8e8",
    marginTop: 30,
    textAlign: "center",
  },
});
