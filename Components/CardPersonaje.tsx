import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Personaje } from "../types/personajes";

type Props = {
    personaje: Personaje;
    seleccionado?: boolean;
    onSelect: () => void;
};

export default function CardPersonaje({ personaje, seleccionado, onSelect }: Props) {
    // Valida si la imagen es una URL externa (string) o un recurso local (number)
    const imageSource = typeof personaje.image === "string"
        ? { uri: personaje.image }
        : personaje.image;

    return (
        <TouchableOpacity
            style={[styles.card, seleccionado && styles.selectedCard]}
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.alias}>{personaje.alias}</Text>
            <Text style={styles.nombre}>{personaje.nombre}</Text>
            <Text style={styles.habilidad}>{personaje.habilidad}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        padding: 15,
        borderWidth: 3,
        borderColor: "white",
        borderRadius: 12,
        backgroundColor: "#111",
        alignItems: "center",
        shadowColor: "red",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5, // Requerido para que las sombras funcionen en Android
    },
    selectedCard: {
        borderColor: "red",
        shadowColor: "yellow",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50, // Opcional: Hace la imagen circular si es necesario
        marginBottom: 10,
    },
    alias: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    nombre: {
        color: "gray",
        fontSize: 14,
        textAlign: "center",
        marginTop: 3,
    },
    habilidad: {
        color: "red",
        fontSize: 12,
        textAlign: "center",
        marginTop: 5,
    },
});
