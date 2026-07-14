import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (isSignedIn) return <Redirect href={"/"} />;

  return <Stack screenOptions={{headerShown: false}}/>;
}
