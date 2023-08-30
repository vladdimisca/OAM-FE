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
import { ApartmentService } from "../services/ApartmentService";

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
  line: {
    height: 2 * StyleSheet.hairlineWidth,
    backgroundColor: colors.darkBorder,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  fieldErrorText: {
    marginHorizontal: 20,
    color: colors.red,
    fontSize: 15,
    marginBottom: 17,
  },
});

export default ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);
  const [apartmentDetails, setApartmentDetails] = useState({
    association: null,
    number: "",
    numberOfPersons: "",
    surface: "",
  });

  const getFieldError = (fieldName) => {
    if (fieldErrors === null) {
      return null;
    }
    const errors = fieldErrors?.filter((fe) => fe.fieldName === fieldName);
    return errors.length !== 0 ? errors[0].errorMessage : null;
  };

  const getFieldErrorStyle = (fieldName) => {
    return getFieldError(fieldName) !== null ? styles.fieldErrorText : null;
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setApartmentDetails((state) => {
        return { ...state, association: route.params.association };
      });
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
            errorMessage={getFieldError("number")}
            errorStyle={getFieldErrorStyle("number")}
            label="Number"
            containerStyle={{ marginTop: 20 }}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={apartmentDetails.number}
            onChangeText={(number) =>
              setApartmentDetails((value) => {
                return { ...value, number };
              })
            }
          />

          <Input
            errorMessage={getFieldError("numberOfPersons")}
            errorStyle={getFieldErrorStyle("numberOfPersons")}
            label="Number of persons"
            keyboardType="numeric"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={apartmentDetails.numberOfPersons}
            onChangeText={(numberOfPersons) =>
              setApartmentDetails((value) => {
                return { ...value, numberOfPersons };
              })
            }
          />

          <Input
            errorMessage={getFieldError("surface")}
            errorStyle={getFieldErrorStyle("surface")}
            label="Surface (㎡)"
            keyboardType="numeric"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={apartmentDetails.surface}
            onChangeText={(surface) =>
              setApartmentDetails((value) => {
                return { ...value, surface };
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
              setFieldErrors(null);
              setIsReqLoading(true);
              const apartmentPayload = {
                ...apartmentDetails,
                associationId: apartmentDetails.association.id,
              };
              ApartmentService.createApartment(apartmentPayload)
                .then((apartment) => {
                  navigation.dispatch((state) => {
                    const newRoutes = [...state.routes];
                    if (
                      newRoutes[newRoutes.length - 1].name === "CreateApartment"
                    ) {
                      newRoutes.splice(newRoutes.length - 1, 1);
                    }
                    if (newRoutes[newRoutes.length - 1].name === "Apartments") {
                      newRoutes.splice(newRoutes.length - 1, 1);
                    }
                    newRoutes.push({
                      name: "Apartments",
                      params: {
                        association: apartment.association,
                      },
                    });

                    return CommonActions.reset({
                      ...state,
                      routes: newRoutes,
                      index: newRoutes.length - 1,
                    });
                  });
                })
                .catch((err) => {
                  if (err?.response?.request?._response) {
                    const errorMessages = JSON.parse(
                      err.response.request._response
                    ).errorMessages;
                    if (errorMessages[0].fieldName !== null) {
                      setFieldErrors(
                        JSON.parse(err.response.request._response).errorMessages
                      );
                    } else {
                      setError(
                        `${
                          JSON.parse(err.response.request._response)
                            .errorMessages[0].errorMessage
                        }`
                      );
                    }
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
