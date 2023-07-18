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
    marginHorizontal: 10,
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

export default ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // input fields
  const [password, setPassword] = useState("");

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
          <Text style={styles.text}>
            {route.params?.userId ? "Remove this user" : "Delete your account"}
          </Text>

          <Input
            secureTextEntry
            leftIcon={
              <Ionicons name="key-outline" size={24} color={colors.text} />
            }
            placeholder="Enter your password..."
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={password}
            onChangeText={setPassword}
          />

          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text={route.params?.userId ? "Remove user" : "Delete account"}
            onPress={async () => {
              if (isLoading === true) {
                return;
              }
              setError("");
              setIsLoading(true);

              const { userId } = await UserStorage.retrieveUserIdAndToken();

              UserService.deleteAccount(
                route.params?.userId ? route.params?.userId : userId,
                password
              )
                .then(async () => {
                  if (route.params?.userId) {
                    await UserStorage.clearStorage();
                  }

                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: route.params?.userId
                            ? "Admin"
                            : "Authentication",
                          state: {
                            routes: [
                              {
                                name: route.params?.userId ? "Users" : "Login",
                              },
                            ],
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
