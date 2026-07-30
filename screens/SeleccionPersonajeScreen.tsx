import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import CardPersonaje from "../Components/CardPersonaje";
import { auth, db } from "../firebase/Config";
import { ref, set } from "firebase/database";
import { personajes, Personaje } from "../types/personajes";

const colorsByAlias: Record<string, string> = {
  Joker: "#ff1f4b",
  Skull: "#f0c419",
  Panther: "#ff5c9d",
  Mona: "#4db8ff",
};


const characterSoundsByAlias: Record<string, any> = {
  Joker: require("../assets/sounds/joker.mp3"),
  Skull: require("../assets/sounds/skull.mp3"),
  Panther: require("../assets/sounds/panther.mp3"),
  Mona: require("../assets/sounds/mona.mp3"),
};


const buttonSound = require("../assets/sounds/button.mp3");
const button2Sound = require("../assets/sounds/button2.mp3");

export default function SeleccionPersonajeScreen({ navigation }: any) {
  const [selected, setSelected] = useState<Personaje | null>(null);
  const selectedColor = selected ? colorsByAlias[selected.alias] || "#ff1f4b" : "#555";


  const jokerPlayer = useAudioPlayer(characterSoundsByAlias.Joker);
  const skullPlayer = useAudioPlayer(characterSoundsByAlias.Skull);
  const pantherPlayer = useAudioPlayer(characterSoundsByAlias.Panther);
  const monaPlayer = useAudioPlayer(characterSoundsByAlias.Mona);

  const characterPlayers: Record<string, ReturnType<typeof useAudioPlayer>> = {
    Joker: jokerPlayer,
    Skull: skullPlayer,
    Panther: pantherPlayer,
    Mona: monaPlayer,
  };

  const buttonPlayer = useAudioPlayer(buttonSound);
  const button2Player = useAudioPlayer(button2Sound);

  const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
    player.seekTo(0);
    player.play();
  };

  const handleSelectPersonaje = (item: Personaje) => {
    setSelected(item);
    playSound(buttonPlayer);

    const characterPlayer = characterPlayers[item.alias];
    if (characterPlayer) {
      playSound(characterPlayer); 
    }
  };

  const confirmSelection = async () => {
    if (!selected) {
      Alert.alert("Elige un personaje", "Selecciona un Phantom Thief para continuar.");
      return;
    }

    playSound(button2Player); 

    const uid = auth.currentUser?.uid;

    if (!uid) {
      Alert.alert("Sesión requerida", "Inicia sesión antes de elegir un personaje.");
      return;
    }

    try {
      await set(ref(db, `users/${uid}/seleccionPersonaje`), {
        id: selected.id,
        nombre: selected.nombre,
        alias: selected.alias,
        habilidad: selected.habilidad,
      });

      navigation.replace("Tabs", {
        screen: "Game",
        params: { personaje: selected },
      });
    } catch (error) {
      console.error("Error guardando personaje:", error);
      Alert.alert("Error", "No se pudo guardar tu personaje. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige tu Phantom Thief</Text>
      <Text style={styles.subtitle}>Cada personaje cambia la forma de jugar.</Text>

      <FlatList
        data={personajes}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CardPersonaje
            personaje={item}
            seleccionado={selected?.id === item.id}
            onSelect={() => handleSelectPersonaje(item)}
          />
        )}
      />

      <View style={[styles.preview, { borderColor: selectedColor }]}>
        {selected ? (
          <>
            <Text style={[styles.selectedAlias, { color: selectedColor }]}>{selected.alias}</Text>
            <Text style={styles.selectedName}>{selected.nombre}</Text>
            <Text style={styles.abilityLabel}>HABILIDAD</Text>
            <Text style={styles.ability}>{selected.habilidad}</Text>
          </>
        ) : (
          <Text style={styles.emptyPreview}>Toca una tarjeta para ver su habilidad.</Text>
        )}
      </View>

      <TouchableOpacity
        disabled={!selected}
        onPress={confirmSelection}
        style={[styles.playButton, { backgroundColor: selectedColor }, !selected && styles.disabledButton]}
      >
        <Text style={styles.playButtonText}>
          {selected ? `JUGAR CON ${selected.alias.toUpperCase()}` : "ELIGE UN PERSONAJE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070707",
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  title: {
    color: "white",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#b8b8b8",
    fontSize: 15,
    marginBottom: 16,
    marginTop: 6,
    textAlign: "center",
  },
  list: {
    paddingBottom: 6,
  },
  preview: {
    backgroundColor: "#151515",
    borderRadius: 14,
    borderWidth: 2,
    marginTop: 10,
    minHeight: 112,
    padding: 14,
  },
  selectedAlias: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedName: {
    color: "#d2d2d2",
    fontSize: 14,
    marginTop: 2,
    textAlign: "center",
  },
  abilityLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 10,
    textAlign: "center",
  },
  ability: {
    color: "white",
    fontSize: 14,
    marginTop: 3,
    textAlign: "center",
  },
  emptyPreview: {
    color: "#b8b8b8",
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  playButton: {
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 12,
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: "#454545",
  },
  playButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
