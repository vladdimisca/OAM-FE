import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Input } from "react-native-elements";
import { CommonActions } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { AssociationService } from "../services/AssociationService";

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");

  const [associationDetails, setAssociationDetails] = useState({
    id: "",
    country: "",
    locality: "",
    administrativeArea: "",
    zipCode: "",
    street: "",
    number: "",
    block: "",
    staircase: "",
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setAssociationDetails({ ...route.params.associationDetails });
      setIsLoading(false);
    })();
  }, [route]);

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isReqLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={{ paddingBottom: 15 }}>
        <ScrollView>
          <Input
            label="Country"
            containerStyle={{ marginTop: 20 }}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.country}
            onChangeText={(country) =>
              setAssociationDetails((value) => {
                return { ...value, country };
              })
            }
          />

          <Input
            label="Locality"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.locality}
            onChangeText={(locality) =>
              setAssociationDetails((value) => {
                return { ...value, locality };
              })
            }
          />

          <Input
            label="Administrative area"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.administrativeArea}
            onChangeText={(administrativeArea) =>
              setAssociationDetails((value) => {
                return { ...value, administrativeArea };
              })
            }
          />

          <Input
            label="Zip code"
            keyboardType="numeric"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.zipCode}
            onChangeText={(zipCode) =>
              setAssociationDetails((value) => {
                return { ...value, zipCode };
              })
            }
          />

          <Input
            label="Street"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.street}
            onChangeText={(street) =>
              setAssociationDetails((value) => {
                return { ...value, street };
              })
            }
          />

          <Input
            label="Number"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.number}
            onChangeText={(number) =>
              setAssociationDetails((value) => {
                return { ...value, number };
              })
            }
          />

          <Input
            label="Block"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.block}
            onChangeText={(block) =>
              setAssociationDetails((value) => {
                return { ...value, block };
              })
            }
          />

          <Input
            label="Staircase"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.staircase}
            onChangeText={(staircase) =>
              setAssociationDetails((value) => {
                return { ...value, staircase };
              })
            }
          />

          <Input
            label="Iban"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={associationDetails.iban}
            onChangeText={(iban) =>
              setAssociationDetails((value) => {
                return { ...value, iban };
              })
            }
          />

          {isReqLoading === false && error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GeneralButton
            text="Submit"
            onPress={async () => {
              if (isReqLoading === true) {
                return;
              }
              setError("");
              setIsReqLoading(true);

              AssociationService.updateAssociationById(
                associationDetails.id,
                associationDetails
              )
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [{ name: "Associations" }],
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
                .finally(() => setIsReqLoading(false));
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
