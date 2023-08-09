/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import * as Linking from "expo-linking";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { GeneralButton } from "../components/GeneralButton";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { InvoiceService } from "../services/InvoiceService";
import { UserService } from "../services/UserService";

const screen = Dimensions.get("window");
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

const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ({ route, navigation }) => {
  const [currentInvoice, setCurrentInvoice] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "short" });
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);
      InvoiceService.getInvoiceById(route.params.invoice.id)
        .then(setCurrentInvoice)
        .finally(() => setIsLoading(false));
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
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView>
        <ScrollView>
          <ProfileItem
            leftIcon={
              <Avatar
                activeOpacity={0.7}
                size={screen.width * 0.09}
                rounded
                source={require("../assets/images/pdf.png")}
              />
            }
            text="Open invoice"
            onPress={() =>
              Linking.openURL(currentInvoice.documentUrl).catch(() => {
                Alert.alert("Could not open this invoice!", "", [
                  {
                    text: "Ok",
                    style: "cancel",
                  },
                ]);
              })
            }
            active
            customTextColor={colors.midBlue}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Number:</Text>}
            text={currentInvoice.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Amount:
              </Text>
            }
            text={`${currentInvoice.amount} €`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>Type:</Text>
            }
            text={`${
              types.filter((t) => t.value === currentInvoice?.type)[0]?.label
            }`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Method:
              </Text>
            }
            text={`${
              methods.filter((t) => t.value === currentInvoice?.method)[0]
                ?.label
            }`}
          />

          <ItemSeparator />

          {currentInvoice.pricePerIndexUnit && (
            <ProfileItem
              leftIcon={
                <Text style={{ ...styles.addressText, marginTop: 3 }}>
                  Price per index unit:
                </Text>
              }
              text={`${currentInvoice.pricePerIndexUnit} €`}
            />
          )}

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Date:</Text>}
            text={`${getMonthName(currentInvoice.month)} ${
              currentInvoice.year
            }`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Association:
              </Text>
            }
            text={`Str. ${currentInvoice.association?.street}, no. ${currentInvoice.association?.number}, bl. ${currentInvoice.association?.block}, ${currentInvoice.association?.locality}, ${currentInvoice.association?.country}`}
          />

          {currentInvoice?.association?.admins
            ?.map((admin) => admin.id)
            .includes(currentUser?.id) && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 5,
                backgroundColor: colors.white,
                zIndex: 2,
              }}
            >
              <View style={{ flex: 1, marginHorizontal: 80 }}>
                <GeneralButton
                  text="Delete"
                  backgroundColor={colors.red}
                  onPress={() => {
                    Alert.alert(
                      "Do you really want to remove this invoice?",
                      "This action is not reversible!",
                      [
                        {
                          text: "Delete",
                          onPress: async () => {
                            setIsLoading(true);
                            InvoiceService.deleteInvoiceById(currentInvoice.id)
                              .then(() => {
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
                                              name: "Invoices",
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  })
                                );
                              })
                              .catch((err) => {
                                let alertMessage =
                                  "Oops, something went wrong!";
                                if (err?.response?.request?._response) {
                                  alertMessage = `${
                                    JSON.parse(err.response.request._response)
                                      .errorMessages[0].errorMessage
                                  }`;
                                }
                                Alert.alert(
                                  "Could not delete this invoice!",
                                  alertMessage,
                                  [
                                    {
                                      text: "Ok",
                                      style: "cancel",
                                    },
                                  ]
                                );
                              })
                              .finally(() => setIsLoading(false));
                          },
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
