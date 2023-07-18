import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";

// constants
import colors from "../constants/colors";

// custom components
import { CustomInput } from "../components/CustomInput";
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { UserService } from "../services/UserService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 28,
    marginHorizontal: 20,
    marginBottom: 20,
    color: colors.text,
  },
  responseText: {
    marginVertical: 5,
    marginHorizontal: 25,
    fontSize: 14,
    alignSelf: "center",
  },
});

export default () => {
  // request states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // input fields
  const [email, setEmail] = useState("");

  const recoverAccount = async () => {
    if (isLoading === true) {
      return;
    }
    if (email === "") {
      setError("You have to provide the email!");
      return;
    }
    setError("");
    setSuccess("");
    setIsLoading(true);

    await UserService.recoverAccount(email)
      .then(setSuccess)
      .catch((err) => {
        if (err?.response?.request?._response) {
          setError(
            `${
              JSON.parse(err.response.request._response).errorMessages[0]
                .errorMessage
            }`
          );
        } else {
          setError("Oops, something went wrong!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Recover your account</Text>

        <ScrollView>
          <View>
            <CustomInput
              autoCapitalize="none"
              placeholder="Enter your email..."
              onTextChange={setEmail}
              icon={<Fontisto name="email" size={28} color={colors.text} />}
            />

            {isLoading === false && error !== "" && success === "" && (
              <Text style={{ ...styles.responseText, color: "red" }}>
                {error}
              </Text>
            )}

            {isLoading === false && error === "" && success !== "" && (
              <Text style={{ ...styles.responseText, color: "green" }}>
                {success}
              </Text>
            )}

            <GeneralButton
              text="Send a new password"
              onPress={recoverAccount}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
