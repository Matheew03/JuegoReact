import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1c1c1c", 
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#485685",
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    scoreText: {
        fontSize: 20,
        color: "red",
        fontWeight: "bold",
    },
});
