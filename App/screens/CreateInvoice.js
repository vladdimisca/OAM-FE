import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  LogBox,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import MonthSelectorCalendar from "react-native-month-selector";
import { FontAwesome } from "react-native-vector-icons";
import moment from "moment/moment";
import * as DocumentPicker from "expo-document-picker";
import { CommonActions } from "@react-navigation/native";
import { Avatar, Input } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem } from "../components/ProfileItem";
import { InvoiceItem } from "../components/InvoiceItem";
import { CustomDropdown } from "../components/CustomDropdown";

// services
import { AssociationService } from "../services/AssociationService";
import { InvoiceService } from "../services/InvoiceService";

// ignored logs
LogBox.ignoreLogs(["Warning: componentWillMount has been renamed"]);

const screen = Dimensions.get("window");
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
  const methods = [
    { value: "PER_COUNTER", label: "Per counter" },
    { value: "PER_PERSON", label: "Per person" },
    { value: "PER_APARTMENT", label: "Per apartment" },
  ];
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

  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  const [associations, setAssociations] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [invoiceDetails, setInvoiceDetails] = useState({
    name: "",
    number: "",
    amount: 0.0,
    type: null,
    method: null,
    pricePerIndexUnit: null,
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
      AssociationService.getAssociations("ADMIN")
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

  const clearFile = () => {
    setInvoice(null);
  };

  const uploadFile = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });

    if (result.canceled) {
      setIsLoading(false);
      return;
    }
    setInvoice(result);
    setIsLoading(false);
  };

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
                errorMessage={getFieldError("name")}
                errorStyle={getFieldErrorStyle("name")}
                label="Name"
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                value={invoiceDetails.name}
                onChangeText={(name) =>
                  setInvoiceDetails((value) => {
                    return { ...value, name };
                  })
                }
              />

              <Input
                errorMessage={getFieldError("number")}
                errorStyle={getFieldErrorStyle("number")}
                label="Number"
                labelStyle={styles.labelStyle}
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                value={invoiceDetails.number}
                onChangeText={(number) =>
                  setInvoiceDetails((value) => {
                    return { ...value, number };
                  })
                }
              />

              <Input
                errorMessage={getFieldError("amount")}
                errorStyle={getFieldErrorStyle("amount")}
                label="Amount (€)"
                labelStyle={styles.labelStyle}
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainerStyle}
                leftIconContainerStyle={styles.leftIconContainerStyle}
                value={invoiceDetails.amount}
                onChangeText={(amount) =>
                  setInvoiceDetails((value) => {
                    return { ...value, amount };
                  })
                }
              />

              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    invoiceDetails.associationId
                      ? associations.filter(
                          (a) => a.value === invoiceDetails.associationId
                        )[0]?.label
                      : "Select the association..."
                  }
                  data={associations}
                  onSelect={(selectedItem) => {
                    setInvoiceDetails({
                      ...invoiceDetails,
                      associationId: selectedItem.value,
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem) =>
                    selectedItem.label
                  }
                  rowTextForSelection={(selectedItem) => selectedItem.label}
                />

                {getFieldError("associationId") !== null && (
                  <Text
                    style={{
                      ...getFieldErrorStyle("associationId"),
                      marginLeft: 5,
                    }}
                  >
                    {getFieldError("associationId")}
                  </Text>
                )}
              </View>

              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    invoiceDetails.type
                      ? types.filter((t) => t.value === invoiceDetails.type)[0]
                          ?.label
                      : "Select the type..."
                  }
                  data={types}
                  onSelect={(selectedItem) => {
                    setInvoiceDetails({
                      ...invoiceDetails,
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
                    }}
                  >
                    {getFieldError("type")}
                  </Text>
                )}
              </View>

              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    invoiceDetails.method
                      ? methods.filter(
                          (m) => m.value === invoiceDetails.method
                        )[0]?.label
                      : "Select the method..."
                  }
                  data={methods}
                  onSelect={(selectedItem) => {
                    if (selectedItem !== "PER_COUNTER") {
                      setInvoiceDetails({
                        ...invoiceDetails,
                        pricePerIndexUnit: null,
                      });
                    }
                    setInvoiceDetails({
                      ...invoiceDetails,
                      method: selectedItem.value,
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem) =>
                    selectedItem.label
                  }
                  rowTextForSelection={(selectedItem) => selectedItem.label}
                />

                {getFieldError("method") !== null && (
                  <Text
                    style={{
                      ...getFieldErrorStyle("method"),
                      marginLeft: 5,
                    }}
                  >
                    {getFieldError("method")}
                  </Text>
                )}
              </View>

              {invoiceDetails.method === "PER_COUNTER" && (
                <Input
                  errorMessage={getFieldError("pricePerIndexUnit")}
                  errorStyle={getFieldErrorStyle("pricePerIndexUnit")}
                  label="Price per index unit (€)"
                  labelStyle={styles.labelStyle}
                  keyboardType="numeric"
                  inputContainerStyle={styles.inputContainerStyle}
                  leftIconContainerStyle={styles.leftIconContainerStyle}
                  value={invoiceDetails.pricePerIndexUnit}
                  onChangeText={(pricePerIndexUnit) =>
                    setInvoiceDetails((value) => {
                      return { ...value, pricePerIndexUnit };
                    })
                  }
                />
              )}

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

              <InvoiceItem
                leftIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Avatar
                    activeOpacity={0.7}
                    size={screen.width * 0.08}
                    rounded
                    source={require("../assets/images/pdf.png")}
                  />
                }
                rightIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  invoice == null || invoice.name == null ? (
                    <TouchableOpacity onPress={uploadFile} activeOpacity={0.7}>
                      <Text style={{ color: colors.midBlue }}>Upload</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={clearFile} activeOpacity={0.7}>
                      <Text style={{ color: colors.red }}>Clear</Text>
                    </TouchableOpacity>
                  )
                }
                text={invoice?.name || "No document selected"}
                active={invoice !== null}
                onPress={async () => {
                  if (invoice !== null) {
                    if (
                      !(
                        await FileSystem.getInfoAsync(
                          `${FileSystem.cacheDirectory}uploads/`
                        )
                      ).exists
                    ) {
                      await FileSystem.makeDirectoryAsync(
                        `${FileSystem.cacheDirectory}uploads/`
                      );
                    }
                    const cacheFilePath = `${
                      FileSystem.cacheDirectory
                    }uploads/${new Date().getTime().toString()}`;
                    await FileSystem.copyAsync({
                      from: invoice?.uri,
                      to: cacheFilePath,
                    });

                    const cUri = await FileSystem.getContentUriAsync(
                      cacheFilePath
                    );

                    await IntentLauncher.startActivityAsync(
                      "android.intent.action.VIEW",
                      {
                        data: cUri,
                        flags: 1,
                        type: "application/pdf",
                      }
                    );
                  }
                }}
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

                  const invoicePayload = {
                    ...invoiceDetails,
                    month: getMonth(date, "numeric"),
                    year: getYear(date),
                  };

                  InvoiceService.createInvoice(invoice, invoicePayload)
                    .then(() => {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          key: null,
                          routes: [
                            {
                              name: "App",
                              state: {
                                routes: [{ name: "Invoices" }],
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
