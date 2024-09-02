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
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Funkcija za prijavu
  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showAlert("Success", "Login successful!"); // Poruka za uspjeh
    } catch (error) {
      console.log(error);
      showAlert("Login Failed", getErrorMessage(error)); // Poruka za grešku
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <Image 
          source={require('../assets/fish.png')} // Postavite putanju do slike
          style={styles.fishImage}
        />
        <Text style={styles.title}>Welcome to Fisher</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={signIn}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupTextMessage}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
            <Text style={styles.signupText}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
  fishImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "black", // 
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupTextMessage: {
    color: "#fff", // Bela boja za tekst
    fontSize: 16,
    marginRight: 5,
  },
  signupText: {
    color: "#4682B4",
    fontWeight: "bold",
    fontSize: 16,
  },
});
