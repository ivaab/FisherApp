import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Location from "expo-location";
import 'react-native-get-random-values';
import * as ImagePicker from 'expo-image-picker';
import { firestore, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from 'uuid';

const AddFish = ({ user }) => {
  const [species, setSpecies] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uuidv4();
    const storageRef = ref(storage, `fish_images/${filename}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSaveFish = async () => {
    if (species && weight && length && location) {
      let imageUrl = "";
      if (image) {
        try {
          imageUrl = await uploadImage(image);
        } catch (error) {
          console.error("Error uploading image: ", error);
          Alert.alert("Error", "Failed to upload image.");
          return;
        }
      }

      try {
        await addDoc(collection(firestore, "fish_catches"), {
          species,
          weight: parseFloat(weight),
          length: parseFloat(length),
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
          imageUrl,
          createdAt: serverTimestamp(),
          userId: user.uid,
        });

        Alert.alert("Success", "Fish data saved successfully!");
        setSpecies("");
        setWeight("");
        setLength("");
        setImage(null);
        navigation.goBack();
      } catch (error) {
        console.error("Error saving fish data: ", error);
        Alert.alert("Error", "Failed to save fish data.");
      }
    } else {
      Alert.alert(
        "Error",
        "Please fill in all fields and ensure location is available."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formBox}>
            <Text style={styles.label}>Species:</Text>
            <TextInput
              style={styles.input}
              value={species}
              onChangeText={setSpecies}
              placeholder="Enter species"
            />
            <Text style={styles.label}>Weight (kg):</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter weight"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Length (cm):</Text>
            <TextInput
              style={styles.input}
              value={length}
              onChangeText={setLength}
              placeholder="Enter length"
              keyboardType="numeric"
            />
            <Button title="Pick an image from gallery" onPress={pickImage} />
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }}
              />
            )}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveFish}>
            <Text style={styles.saveButtonText}>Save Fish</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eaf2f8",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formBox: {
    padding: 20,
    backgroundColor: "#fff", // White background for the box
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#006400",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#006400",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddFish;
