import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const MyFishGallery = ({ route }) => {
  const { user } = route.params;
  const [fishImages, setFishImages] = useState([]);
  const navigation = useNavigation();

  // Određujemo broj stupaca
  const numColumns = 3;

  // Izračunavanje širine i visine slika
  const imageSize = Dimensions.get("window").width / numColumns - 15;

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return;

      try {
        const q = query(collection(firestore, "fish_catches"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const images = querySnapshot.docs
          .map(doc => doc.data().imageUrl)
          .filter(url => url); // Filtrirajte prazne URL-ove
        setFishImages(images);
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };

    fetchImages();
  }, [user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ImageView", { imageUrl: item })}>
      <Image source={{ uri: item }} style={[styles.image, { width: imageSize, height: imageSize }]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {fishImages.length > 0 ? (
        <FlatList
          data={fishImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns} // Prikazivanje tri slike po redu
          key={numColumns} // Dodajemo ključ za ponovno renderiranje
          columnWrapperStyle={styles.row} // Style za redove
        />
      ) : (
        <Text style={styles.noImagesText}>No images to display</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f8ff",
  },
  row: {
    justifyContent: "space-between", // Rasporedite slike ravnomjerno u redovima
  },
  image: {
    borderRadius: 8,
    marginBottom: 10,
  },
  noImagesText: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});

export default MyFishGallery;
