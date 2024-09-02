import React, { useState, useEffect } from "react";
import 'react-native-get-random-values';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FishList from "./screens/FishList";
import FishDetails from "./screens/FishDetails";
import AddFish from "./screens/AddFish";
import UpdateFish from "./screens/UpdateForm";
import Login from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen"; 
import MyFishGallery from "./screens/MyFishGallery";
import ImageView from "./screens/ImageView"; // Import the new ImageView screen
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

const InsideLayout = ({ route }) => {
  const { user } = route.params;

  return (
    <InsideStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#006400", 
        },
        headerTintColor: "#fff", 
      }}
    >
      <InsideStack.Screen 
        name="My Fish List"
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10,
                backgroundColor: "black", 
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => auth.signOut()}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={{ color: "#fff", marginLeft: 5 }}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      >
        {(props) => <FishList {...props} user={user} />}
      </InsideStack.Screen>
      <InsideStack.Screen name="Fish Details" component={FishDetails} />
      <InsideStack.Screen name="Add Fish">
        {(props) => <AddFish {...props} user={user} />}
      </InsideStack.Screen>
      <InsideStack.Screen name="Update Fish" component={UpdateFish} />
      <InsideStack.Screen 
        name="MyFishGallery"
        options={{ title: "My Fish Gallery" }} // Dodajte ovaj red za prikaz "My Fish Gallery" u zaglavlju
      > 
        {(props) => <MyFishGallery {...props} user={user} />} 
      </InsideStack.Screen>
      <InsideStack.Screen name="ImageView" component={ImageView} /> 
    </InsideStack.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="InsideLayout"
            options={{ headerShown: false }}
            component={InsideLayout}
            initialParams={{ user }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={Login}
            />
            <Stack.Screen
              name="SignUpScreen"
              options={{ headerShown: false }}
              component={SignUpScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
