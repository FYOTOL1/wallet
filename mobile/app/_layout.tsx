import SafeScreen from "../components/safeScreen";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { View } from "react-native";
import { COLORS } from "@/constants/colors";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey)
  throw new Error("Add your Clerk Publishable Key to the .env file!");

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey as string}
      tokenCache={tokenCache}
    >
      <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </View>
    </ClerkProvider>
  );
}
