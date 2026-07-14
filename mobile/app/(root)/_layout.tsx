import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function LayoutRoot() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
