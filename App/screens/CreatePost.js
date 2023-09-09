import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  LogBox,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/native";
import { Input } from "react-native-elements";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { CustomDropdown } from "../components/CustomDropdown";

// services
import { AssociationService } from "../services/AssociationService";
import { PostService } from "../services/PostService";

// ignored logs
LogBox.ignoreLogs(["Warning: componentWillMount has been renamed"]);

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
  dropdown: {
    marginTop: 10,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  textAreaContainer: {
    marginHorizontal: 10,
    padding: 12,
    borderWidth: 2 * StyleSheet.hairlineWidth,
    borderColor: colors.darkBorder,
    borderRadius: 10,
  },
  fieldErrorText: {
    marginHorizontal: 20,
    color: colors.red,
    fontSize: 15,
    marginBottom: 17,
  },
});

export default ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  const [associations, setAssociations] = useState([]);
  const [postDetails, setPostDetails] = useState({
    title: "",
    text: "",
    associationId: null,
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
    (() => {
      AssociationService.getAssociations()
        .then((fetchedAssociations) =>
          setAssociations(
            fetchedAssociations.map((a) => {
              return {
                label: `Str. ${a.street}, no. ${a.number}, bl. ${a.block}, ${a.locality}, ${a.country}`,
                value: a.id,
              };
            })
          )
        )
        .finally(() => setIsLoading(false));
    })();
  });

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
          <View style={styles.dropdown}>
            <CustomDropdown
              defaultButtonText={
                postDetails.associationId
                  ? associations.filter(
                      (a) => a.value === postDetails.associationId
                    )[0]?.label
                  : "Select the association..."
              }
              data={associations}
              onSelect={(selectedItem) => {
                setPostDetails({
                  ...postDetails,
                  associationId: selectedItem.value,
                });
              }}
              buttonTextAfterSelection={(selectedItem) => selectedItem.label}
              rowTextForSelection={(selectedItem) => selectedItem.label}
            />

            {getFieldError("associationId") !== null && (
              <Text
                style={{
                  ...getFieldErrorStyle("associationId"),
                  marginLeft: 5,
                  marginBottom: -10,
                }}
              >
                {getFieldError("associationId")}
              </Text>
            )}
          </View>

          <Input
            errorMessage={getFieldError("title")}
            errorStyle={getFieldErrorStyle("title")}
            label="Title"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.leftIconContainerStyle}
            value={postDetails.title}
            onChangeText={(title) =>
              setPostDetails((value) => {
                return { ...value, title };
              })
            }
          />

          <Input
            errorMessage={getFieldError("text")}
            errorStyle={getFieldErrorStyle("text")}
            multiline
            maxLength={600}
            label="Content"
            labelStyle={{ ...styles.labelStyle, marginBottom: 8 }}
            inputContainerStyle={styles.textAreaContainer}
            value={postDetails.text}
            onChangeText={(text) =>
              setPostDetails((value) => {
                return { ...value, text };
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
              setFieldErrors(null);
              setError("");
              setIsReqLoading(true);

              PostService.createPost(postDetails)
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      key: null,
                      routes: [
                        {
                          name: "App",
                          state: {
                            routes: [{ name: "Posts" }],
                          },
                        },
                      ],
                    })
                  );
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
