import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; // Dodajemo ikonicu za strelicu nazad

// Funkcija za mapiranje Firebase grešaka na korisnički prijateljske poruke
const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please use a different email.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/invalid-email":
      return "The email address is not valid. Please enter a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

// Funkcija za prikazivanje Alert poruka
const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: "OK" }]);
};

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Funkcija za registraciju
  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showAlert("Success", "Account created successfully!"); // Poruka za uspjeh
      navigation.navigate("LoginScreen"); // Povratak na login screen nakon uspešne registracije
    } catch (error) {
      console.log(error);
      showAlert("Sign Up Failed", getErrorMessage(error)); // Poruka za grešku
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Strelica za nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        {/* Slika ribe */}
        <Image 
          source={require('../assets/fish.png')} // Postavite putanju do slike
          style={styles.fishImage}
        />
        
        {/* Naslov */}
        <Text style={styles.title}>Create a New Account</Text>
        
        {/* Forma za registraciju */}
        <View style={styles.formBox}>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor="#427042"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            placeholderTextColor="#427042"
            onChangeText={(text) => setPassword(text)}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#006400" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={signUp}>
              <Text style={styles.loginButtonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006400", // Tamnozelena pozadina
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50, // Pomerena strelica niže
    left: 10, // Postavljena strelica bliže levoj ivici ekrana
  },
  fishImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Bela boja za naslov
    marginBottom: 20,
    textAlign: "center",
  },
  formBox: {
    width: "100%",
    padding: 20,
    backgroundColor: "#7bab7b", // Bijela boja za pozadinu forme
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5", // Svjetlosiva boja za input polja
    color: "#333",
  },
  loginButton: {
    backgroundColor: "black", // Boja dugmeta za registraciju
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
