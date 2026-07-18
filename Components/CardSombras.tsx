import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

const SIZE = 80;

type CardSombrasProps = {
    onCatch: () => void;
    active: boolean;
    image: any;
    top: number;
    left: number;
};

export default function CardSombras({ onCatch, active, image, top, left }: CardSombrasProps) {
    if (!active) return null;

    const handlePress = () => {
        onCatch();
    };

    return (
        <TouchableOpacity
            style={[styles.shadowCard, { top, left, width: SIZE, height: SIZE }]}
            onPress={handlePress}
        >
            <Image source={image} style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shadowCard: {
        position: "absolute",
    },
    image: {
        width: SIZE,
        height: SIZE,
        resizeMode: "contain",
    },
});
