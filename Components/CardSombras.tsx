import React from "react";
import { TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from "react-native";

const SIZE = 80;

type CardSombrasProps = {
    onCatch: () => void;
    active: boolean;
    image: ImageSourcePropType;
    top: number;
    left: number;
};

export default function CardSombras({ onCatch, active, image, top, left }: CardSombrasProps) {
    if (!active) return null;

    return (
        <TouchableOpacity
            style={[styles.shadowCard, { top, left }]}
            onPress={onCatch}
            activeOpacity={0.7}
        >
            <Image source={image} style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shadowCard: {
        position: "absolute",
        width: SIZE,
        height: SIZE,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});
