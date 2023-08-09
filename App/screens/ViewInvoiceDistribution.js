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
import { Avatar } from "react-native-elements";
import * as Linking from "expo-linking";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { UserService } from "../services/UserService";
import { InvoiceDistributionService } from "../services/InvoiceDistributionService";

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

export default ({ route }) => {
  const [currentInvoiceDistribution, setCurrentInvoiceDistribution] = useState(
    {}
  );
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
      InvoiceDistributionService.getInvoiceDistributionById(
        route.params.invoiceDistribution.id
      )
        .then(setCurrentInvoiceDistribution)
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
              Linking.openURL(
                currentInvoiceDistribution?.invoice?.documentUrl
              ).catch(() => {
                Alert.alert("Could not open the invoice!", "", [
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
            text={currentInvoiceDistribution.invoice?.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Amount:
              </Text>
            }
            text={`${currentInvoiceDistribution.amount} €`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>Type:</Text>
            }
            text={`${
              types.filter(
                (t) => t.value === currentInvoiceDistribution?.invoice?.type
              )[0]?.label
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
              methods.filter(
                (t) => t.value === currentInvoiceDistribution?.invoice?.method
              )[0]?.label
            }`}
          />

          <ItemSeparator />

          {currentInvoiceDistribution?.invoice?.pricePerIndexUnit && (
            <ProfileItem
              leftIcon={
                <Text style={{ ...styles.addressText, marginTop: 3 }}>
                  Price per index unit:
                </Text>
              }
              text={`${currentInvoiceDistribution?.invoice?.pricePerIndexUnit} €`}
            />
          )}

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Date:</Text>}
            text={`${getMonthName(
              currentInvoiceDistribution?.invoice?.month
            )} ${currentInvoiceDistribution?.invoice?.year}`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={
              <Text style={{ ...styles.addressText, marginTop: 3 }}>
                Apartment:
              </Text>
            }
            text={`Ap. ${currentInvoiceDistribution?.apartment?.number} - Str. ${currentInvoiceDistribution?.invoice?.association?.street}, no. ${currentInvoiceDistribution?.invoice?.association?.number}, bl. ${currentInvoiceDistribution?.invoice?.association?.block}, ${currentInvoiceDistribution?.invoice?.association?.locality}, ${currentInvoiceDistribution?.invoice?.association?.country}`}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
