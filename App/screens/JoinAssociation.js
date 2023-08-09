import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { CommonActions } from "@react-navigation/routers";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay";
import { DotIndicator } from "react-native-indicators";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { AssociationService } from "../services/AssociationService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 22,
    marginHorizontal: 30,
    marginBottom: 20,
    color: colors.text,
    alignSelf: "center",
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 30,
  },
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: colors.midBlue,
    borderBottomWidth: 2,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  actionText: {
    alignSelf: "center",
    fontSize: 18,
    color: colors.lightBlue,
    marginVertical: 10,
  },
});

const CELL_COUNT = 6;

export default ({ navigation }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // input
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const joinAssociation = async () => {
    if (isLoading === true) {
      return;
    }
    setIsLoading(true);

    await AssociationService.joinAssociation(value)
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
        <Text style={styles.text}>Enter the association code</Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        {isLoading === false && error !== "" && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <GeneralButton
          isActive={value.length !== CELL_COUNT}
          onPress={joinAssociation}
          text="Join"
        />
      </SafeAreaView>
    </View>
  );
};
