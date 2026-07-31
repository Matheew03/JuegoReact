import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAudioPlayer } from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase/config";
import { auth } from "../firebase/Config";
import { File } from "expo-file-system";

const buttonSound = require("../assets/sounds/button.mp3");
const button2Sound = require("../assets/sounds/button2.mp3");

export default function RegisterScreen({ navigation }: any) {

  const [correo, setcorreo] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [confirmar, setconfirmar] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const buttonPlayer = useAudioPlayer(buttonSound);
  const button2Player = useAudioPlayer(button2Sound);

  const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
    player.seekTo(0);
    player.play();
  };

  const elegirGaleria = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesitas permitir acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const tomarFoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesitas permitir acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const subirImagen = async () => {

    if (!image) {
      return null;
    }

    try {

      const avatarFile = await new File(image).bytes();

      const nombreArchivo = `avatar_${Date.now()}.jpg`;


      const { error } = await supabase
        .storage
        .from("jugador")
        .upload(nombreArchivo, avatarFile, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false
        });


      if (error) {

        console.log("Error subiendo imagen:", error);

        Alert.alert(
          "Error",
          "No se pudo subir la imagen."
        );

        return null;
      }


      const { data } = supabase
        .storage
        .from("jugador")
        .getPublicUrl(nombreArchivo);


      console.log("Imagen subida:", data.publicUrl);


      return data.publicUrl;


    } catch (error) {

      console.log("Error imagen:", error);

      Alert.alert(
        "Error",
        "No se pudo procesar la imagen."
      );

      return null;

    }

  };

  function registro() {
    playSound(button2Player);

    if (
      correo.trim() == "" ||
      contrasenia.trim() == "" ||
      confirmar.trim() == "" ||
      !image
    ) {
      Alert.alert("Campos vacíos", "Complete toda la información y seleccione una foto.");
      return;
    }
    if (contrasenia != confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    createUserWithEmailAndPassword(auth, correo, contrasenia)
      .then(async (userCredential) => {

        const user = userCredential.user;
        console.log(user);


        const imagenUrl = await subirImagen();


        if (imagenUrl) {
          console.log("Imagen guardada:", imagenUrl);
        }


        Alert.alert(
          "Éxito",
          "Usuario registrado correctamente.",
          [{
            text: "Aceptar",
            onPress: () => navigation.navigate("Login")
          }]
        );

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);

        if (errorCode == "auth/email-already-in-use") {
          Alert.alert("Correo existente", "Este correo ya está registrado.");
        } else if (errorCode == "auth/invalid-email") {
          Alert.alert("Correo inválido", "Ingrese un correo válido.");
        } else if (errorCode == "auth/weak-password") {
          Alert.alert("Contraseña débil", "La contraseña debe tener más seguridad.");
        } else {
          Alert.alert("Error", errorMessage);
        }
      });
  }

  const handleGoToLogin = () => {
    playSound(buttonPlayer);
    navigation.navigate("Login");
  };

  return (
    <ImageBackground 
      source={require("../assets/fondos.jpg")} 
      style={styles.fondo}
    >

    <View style={styles.container}>
      <Text style={styles.titulo}>
        Registro
      </Text>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.imagenPerfil}
        />
      )}

      <View style={styles.contenedorImagen}>

        <TouchableOpacity
          style={styles.botonImagen}
          onPress={tomarFoto}
        >
          <Text style={styles.textoBoton}>
            Tomar foto
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.botonImagen}
          onPress={elegirGaleria}
        >
          <Text style={styles.textoBoton}>
            Galería
          </Text>
        </TouchableOpacity>

      </View>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setcorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setcontrasenia}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setconfirmar}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={registro}
      >

        <Text style={styles.textoBoton}>
          Crear Cuenta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoToLogin}
      >
        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
        </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
  width: "90%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.82)",
  padding: 25,
  borderRadius: 20
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
  borderColor: "#ff1f4b",
  borderWidth: 1,
  borderRadius: 12,
  color: "white",
  padding: 15,
  marginBottom: 18
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
  },
  imagenPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FF003C",
  },

  contenedorImagen: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  botonImagen: {
    backgroundColor: "#222",
    borderColor: "#FF003C",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: "48%",
    alignItems: "center",
  },
  fondo: { 
  flex: 1, 
  justifyContent: "center", 
  alignItems: "center" 
},
});