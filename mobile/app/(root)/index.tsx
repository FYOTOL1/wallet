import { useTransactions } from "@/hooks/useTransactions";
import { useUser, useClerk, SignedOut, SignedIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user?.id as string);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("transactions: ", transactions);
  console.log("summary: ", summary);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
      <SignedIn>
        <Text>Hello {user?.id}</Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </SignedIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
