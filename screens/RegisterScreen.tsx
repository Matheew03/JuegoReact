import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Config";

export default function RegisterScreen({ navigation }: any) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  async function registrarUsuario() {

    if (
      correo.trim() == "" ||
      password.trim() == "" ||
      confirmar.trim() == ""
    ) {
      Alert.alert("Campos vacíos", "Complete toda la información.");
      return;
    }
    if (password != confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );
      Alert.alert("Éxito", "Usuario registrado correctamente.",
        [{
          text: "Aceptar", onPress: () => navigation.navigate("Login")
        }]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Registro de Cazador
      </Text>
      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        style={styles.input}
        value={confirmar}
        onChangeText={setConfirmar}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.boton}
        onPress={registrarUsuario}
      >
        <Text style={styles.textoBoton}>
          Crear Cuenta
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 20
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF003C",
    marginBottom: 40
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    borderColor: "#FF003C",
    borderWidth: 2,
    borderRadius: 12,
    color: "white",
    padding: 15,
    marginBottom: 20
  },
  boton: {
    width: "100%",
    backgroundColor: "#FF003C",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18
  },
  link: {
    marginTop: 25,
    color: "white",
    fontSize: 16
  }
});