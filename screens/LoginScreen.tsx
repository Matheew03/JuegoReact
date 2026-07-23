import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  Alert,  ImageBackground,  StyleSheet,} from "react-native";
import {  sendPasswordResetEmail,  signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../firebase/Config";

export default function LoginScreen({ navigation }: any) {

  const [correo, setcorreo] = useState("");
  const [contrasenia, setcontrasenia] = useState("");

  function login() {
    if (correo.trim() === "" || contrasenia.trim() === "") {
      Alert.alert("Campos vacíos","Complete todos los campos");
      return;
    }
    signInWithEmailAndPassword(auth,correo,contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        Alert.alert("Bienvenido","Inicio de sesión exitoso");
        navigation.navigate("Tabs");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode == "auth/invalid-email") {
          Alert.alert("Correo inválido","Verificar el campo de correo");
        } else if (errorCode == "auth/missing-password") {
          Alert.alert("Contraseña incorrecta","Verificar el campo de contraseña");
        } else if (errorCode == "auth/invalid-credential") {
          Alert.alert("Error","Verifica tus credenciales");
        } else {
          Alert.alert("Error", errorMessage);
        }
      });
  }

  function restablecerContrasenia() {
    sendPasswordResetEmail(auth,correo)
      .then(() => {
        Alert.alert("Mensaje", "Se envió un mensaje a tu correo");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        Alert.alert("Error", errorMessage);
      });
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
          placeholder="Ingresar Correo"
          placeholderTextColor="#bbb"
          style={styles.input}
          onChangeText={setcorreo}
        />
        <TextInput
          placeholder="Ingresar Contraseña"
          placeholderTextColor="#bbb"
          secureTextEntry
          style={styles.input}
          onChangeText={setcontrasenia}
        />
        <TouchableOpacity
          style={styles.boton}
          onPress={login}
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
        <TouchableOpacity
          onPress={restablecerContrasenia}
        >
          <Text style={styles.link}>
            ¿Olvidaste la contraseña?
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