import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet, } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Config";

export default function LoginScreen({ navigation }: any) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  async function iniciarSesion() {
    if (correo.trim() === "" || password.trim() === "") {
      Alert.alert("Campos vacíos", "Complete todos los campos.");
      return;
    }
    try {
      await signInWithEmailAndPassword(
        auth,
        correo,
        password
      );
      Alert.alert("Bienvenido", "Inicio de sesión exitoso.",
        [{
          text: "Continuar", onPress: () => navigation.replace("SeleccionPersonaje"),
        },
        ]);
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-credential":
          Alert.alert("Error", "Correo o contraseña incorrectos.");
          break;
        case "auth/user-not-found":
          Alert.alert("Error", "El usuario no existe.");
          break;
        case "auth/wrong-password":
          Alert.alert("Error", "Contraseña incorrecta.");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Correo electrónico inválido.");
          break;

        default:
          Alert.alert("Error", error.message);
      }
    }
  }

  return (

    <ImageBackground
      source={require("../assets/login.jpg")}
      style={styles.fondo}
    >
      <View style={styles.caja}>
        <Text style={styles.titulo}>
          LOGIN
        </Text>
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#bbb"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#bbb"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.boton}
          onPress={iniciarSesion}
        >
          <Text style={styles.textoBoton}>
            Ingresar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Registro")}
        >
          <Text style={styles.link}>
            ¿No tienes cuenta? Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  caja: {
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.82)",
    padding: 25,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 34,
    color: "#ff1f4b",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ff1f4b",
  },
  boton: {
    backgroundColor: "#ff1f4b",
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
  },
  textoBoton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    color: "white",
    textAlign: "center",
    marginTop: 25,
  },
});