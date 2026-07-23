import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { personajes, Personaje } from "../types/personajes";
import { db } from "../firebase/Config";
import { ref, set } from "firebase/database";
import CardPersonaje from "../Components/CardPersonaje";

export default function SeleccionPersonajeScreen({ navigation }: any) {
  const [selected, setSelected] = useState<Personaje | null>(null);

  const handleSelect = async (p: Personaje) => {
    setSelected(p);

    try {
      await set(ref(db, "seleccionPersonaje"), {
        id: p.id,
        nombre: p.nombre,
        alias: p.alias,
        habilidad: p.habilidad,
      });
      console.log("Personaje guardado en Firebase:", p.alias);
    } catch (error) {
      console.error("Error guardando personaje:", error);
    }


    navigation.replace("Tabs", {
      screen: "Game",
      params: { personaje: p },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu Phantom Thief</Text>
      <FlatList
        data={personajes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardPersonaje
            personaje={item}
            seleccionado={selected?.id === item.id}
            onSelect={() => handleSelect(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", padding: 20 },
  title: { color: "red", fontSize: 26, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
});
