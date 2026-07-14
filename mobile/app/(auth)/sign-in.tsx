import React from "react";
import { useSignIn, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { styles } from "@/assets/styles/auth.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [needsSecondFactor, setNeedsSecondFactor] = React.useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/index");
      } else if (signInAttempt.status === "needs_second_factor") {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        setNeedsSecondFactor(true);
      } else {
        console.error("Sign-in attempt not complete:", signInAttempt);
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

  const handleVerify = async () => {
    if (!isLoaded) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/(root)/index");
      } else {
        console.error("Sign-in attempt not complete:", attempt);
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

  const handleResendCode = async () => {
    if (!isLoaded) return;
    try {
      await signIn.prepareSecondFactor({ strategy: "email_code" });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleStartOver = () => {
    setNeedsSecondFactor(false);
    setCode("");
    setErrorMessage(null);
  };

  if (needsSecondFactor) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 24, fontWeight: "bold" }]}>
          Verify your account
        </Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
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
          onPress={handleVerify}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleResendCode}>
          <Text style={styles.buttonText}>I need a new code</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleStartOver}>
          <Text style={styles.buttonText}>Start over</Text>
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
          source={require("@/assets/images/revenue-i4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Sign in</Text>

        <Text style={styles.footerText}>Email address</Text>
        <TextInput
          style={styles.input}
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
            {!isSubmitting ? "Continue" : "loading..."}
          </Text>
        </Pressable>

        <View style={styles.footerContainer}>
          <Text>{"don't"} have an account? </Text>
          <Link style={styles.linkText} href="/(auth)/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
