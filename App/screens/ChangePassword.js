/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Input } from "react-native-elements";
import { Ionicons } from "react-native-vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// constants
import colors from "../constants/colors";

// services
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/UserStorage";

const styles = StyleSheet.create({
  inputContainerStyle: {
    marginHorizontal: 5,
  },
  leftIconContainerStyle: {
    marginLeft: 5,
    marginRight: 12,
  },
  text: {
    fontSize: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    color: colors.text,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // input fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

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
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.text}>Change your password</Text>

          <Input
            secureTextEntry
            leftIcon={
              <Ionicons name="key-outline" size={24} color={colors.text} />
            }
            placeholder="Old password..."
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={oldPassword}
            onChangeText={(pass) => setOldPassword(pass)}
            autoCapitalize="none"
          />

          <Input
            secureTextEntry
            leftIcon={
              <Ionicons name="key-outline" size={24} color={colors.text} />
            }
            placeholder="New password..."
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
          />

          <Input
            secureTextEntry
            leftIcon={
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={colors.text}
              />
            }
            placeholder="Repeat new password..."
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={repeatNewPassword}
            onChangeText={setRepeatNewPassword}
            autoCapitalize="none"
          />

          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text="Change password"
            onPress={async () => {
              if (isLoading === true) {
                return;
              }
              if (newPassword !== repeatNewPassword) {
                setError("Passwords not matching!");
                return;
              }
              setError("");
              setIsLoading(true);

              const { userId } = await UserStorage.retrieveUserIdAndToken();

              UserService.changePassword(userId, oldPassword, newPassword)
                .then(async () => {
                  await UserStorage.clearStorage();

                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "Authentication",
                          state: {
                            routes: [{ name: "Login" }],
                          },
                        },
                      ],
                    })
                  );
                })
                .catch((err) => {
                  if (err?.response?.request?._response) {
                    setError(
                      `${
                        JSON.parse(err.response.request._response)
                          .errorMessages[0].errorMessage
                      }`
                    );
                  } else {
                    setError("Oops, something went wrong!");
                  }
                })
                .finally(() => setIsLoading(false));
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
