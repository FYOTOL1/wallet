import { View, ActivityIndicator } from "react-native";
import React from "react";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";

export default function PageLoader() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={75} color={COLORS.primary} />
    </View>
  );
}
