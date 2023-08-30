/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Input } from "react-native-elements";
import { Fontisto } from "react-native-vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { CommonActions } from "@react-navigation/native";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// constants
import colors from "../constants/colors";

// services
import { AssociationService } from "../services/AssociationService";

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
  const [email, setEmail] = useState("");

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
          <Text style={styles.text}>Add an admin member</Text>

          <Input
            autoCapitalize="none"
            leftIcon={
              <Fontisto name="email" size={24} color={colors.darkBorder} />
            }
            placeholder="Enter the email..."
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={email}
            onChangeText={setEmail}
          />

          {isLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text="Submit"
            onPress={async () => {
              if (isLoading === true) {
                return;
              }
              setError("");
              setIsLoading(true);

              AssociationService.addAdminMemberToAssociation(
                email,
                route.params.association.id
              )
                .then(async () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [
                              {
                                name: "Associations",
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
