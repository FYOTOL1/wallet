import { useAuth, useSignUp, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";
import { styles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrorMessage(err.errors[0]?.longMessage ?? err.errors[0]?.message);
      } else {
        console.error(JSON.stringify(err, null, 2));
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(root)/index");
      } else {
        // Check why the sign-up is not complete
        console.error("Sign-up attempt not complete:", signUpAttempt);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrorMessage(err.errors[0]?.longMessage ?? err.errors[0]?.message);
      } else {
        console.error(JSON.stringify(err, null, 2));
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSignedIn) {
    return null;
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your account</Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name={"alert-circle"} size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorMessage("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, errorMessage && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />

        <Pressable
          style={styles.button}
          onPress={handleVerify}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll={true}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/revenue-i2.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Sign up</Text>

        <Text style={styles.footerText}>Email address</Text>
        <TextInput
          style={[styles.input, errorMessage && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#666666"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          keyboardType="email-address"
        />

        <Text style={styles.footerText}>Password</Text>

        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name={"alert-circle"} size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorMessage("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || isSubmitting}
        >
          <Text style={styles.buttonText}>
            {" "}
            {!isSubmitting ? "Sign up" : "loading..."}
          </Text>
        </Pressable>

        <View style={styles.footerContainer}>
          <Text>Already have an account? </Text>
          <Link style={styles.linkText} href="/(auth)/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAwareScrollView>
  );
}
