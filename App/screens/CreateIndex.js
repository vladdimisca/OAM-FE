import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  LogBox,
  TouchableOpacity,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Input } from "react-native-elements";
import MonthSelectorCalendar from "react-native-month-selector";
import { FontAwesome } from "react-native-vector-icons";
import moment from "moment/moment";
import { CommonActions } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem } from "../components/ProfileItem";
import { CustomDropdown } from "../components/CustomDropdown";

// services
import { ApartmentService } from "../services/ApartmentService";
import { IndexService } from "../services/IndexService";

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
    marginTop: -10,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  fieldErrorText: {
    marginHorizontal: 20,
    color: colors.red,
    fontSize: 15,
    marginBottom: 17,
  },
});

export default ({ navigation }) => {
  const types = [
    {
      value: "NATURAL_GASES",
      label: "Natural gases",
    },
    {
      value: "ELECTRICITY",
      label: "Electricity",
    },
    {
      value: "COLD_WATER",
      label: "Cold water",
    },
    {
      value: "HOT_WATER",
      label: "Hot water",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  const [apartments, setApartments] = useState([]);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [indexDetails, setIndexDetails] = useState({
    oldIndex: "",
    newIndex: "",
    month: null,
    year: null,
    type: null,
    apartmentId: null,
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
      ApartmentService.getApartments()
        .then((fetchedApartments) =>
          setApartments(
            fetchedApartments.map((a) => {
              return {
                label: `Ap. ${a.number} - Str. ${a.association?.street}, no. ${a.association?.number}, bl. ${a.association?.block}, ${a.association?.locality}, ${a.association?.country}`,
                value: a.id,
              };
            })
          )
        )
        .finally(() => setIsLoading(false));
    })();
  });

  const getYear = (dateToFormat) => {
    return new Intl.DateTimeFormat("en", { year: "numeric" }).format(
      dateToFormat
    );
  };

  const getMonth = (dateToFormat, format = "long") => {
    return new Intl.DateTimeFormat("en", { month: format }).format(
      dateToFormat
    );
  };

  const formatDate = (dateToFormat) => {
    const year = getYear(dateToFormat);
    const month = getMonth(dateToFormat);
    return `${month} ${year}`;
  };

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
          {isDatePickerActive && (
            <>
              <MonthSelectorCalendar
                selectedDate={date ? moment(date) : moment()}
                onMonthTapped={(newDate) => {
                  setDate(newDate);
                }}
                currentMonthTextStyle={{ color: colors.darkBlue }}
              />

              <GeneralButton
                onPress={() => {
                  setIsDatePickerActive(false);
                }}
                text="Done"
              />
            </>
          )}

          {!isDatePickerActive && (
            <>
              <Input
                errorMessage={getFieldError("oldIndex")}
                errorStyle={getFieldErrorStyle("oldIndex")}
                label="Old index"
                keyboardType="numeric"
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                value={indexDetails.oldIndex}
                onChangeText={(oldIndex) =>
                  setIndexDetails((value) => {
                    return { ...value, oldIndex };
                  })
                }
              />

              <Input
                errorMessage={getFieldError("newIndex")}
                errorStyle={getFieldErrorStyle("newIndex")}
                label="New index"
                labelStyle={styles.labelStyle}
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                value={indexDetails.newIndex}
                onChangeText={(newIndex) =>
                  setIndexDetails((value) => {
                    return { ...value, newIndex };
                  })
                }
              />

              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    indexDetails.apartmentId
                      ? apartments.filter(
                          (a) => a.value === indexDetails.apartmentId
                        )[0]?.label
                      : "Select the apartment..."
                  }
                  data={apartments}
                  onSelect={(selectedItem) => {
                    setIndexDetails({
                      ...indexDetails,
                      apartmentId: selectedItem.value,
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem) =>
                    selectedItem.label
                  }
                  rowTextForSelection={(selectedItem) => selectedItem.label}
                />

                {getFieldError("apartmentId") !== null && (
                  <Text
                    style={{
                      ...getFieldErrorStyle("apartmentId"),
                      marginLeft: 5,
                    }}
                  >
                    {getFieldError("apartmentId")}
                  </Text>
                )}
              </View>

              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    indexDetails.type
                      ? types.filter((t) => t.value === indexDetails.type)[0]
                          ?.label
                      : "Select the type..."
                  }
                  data={types}
                  onSelect={(selectedItem) => {
                    setIndexDetails({
                      ...indexDetails,
                      type: selectedItem.value,
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem) =>
                    selectedItem.label
                  }
                  rowTextForSelection={(selectedItem) => selectedItem.label}
                />

                {getFieldError("type") !== null && (
                  <Text
                    style={{
                      ...getFieldErrorStyle("type"),
                      marginLeft: 5,
                      marginBottom: -10,
                    }}
                  >
                    {getFieldError("type")}
                  </Text>
                )}
              </View>

              <ProfileItem
                leftIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <FontAwesome
                    style={{ marginRight: 15 }}
                    name="calendar"
                    size={22}
                    color={colors.lightText}
                  />
                }
                rightIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <TouchableOpacity
                    onPress={() => setIsDatePickerActive(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.midBlue }}>Change</Text>
                  </TouchableOpacity>
                }
                text={formatDate(date)}
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

                  const indexPayload = {
                    ...indexDetails,
                    month: getMonth(date, "numeric"),
                    year: getYear(date),
                  };

                  IndexService.createIndex(indexPayload)
                    .then(() => {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          key: null,
                          routes: [
                            {
                              name: "App",
                              state: {
                                routes: [{ name: "Indexes" }],
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
                            JSON.parse(err.response.request._response)
                              .errorMessages
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
