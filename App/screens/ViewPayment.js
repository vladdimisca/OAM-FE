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
  Dimensions,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar } from "react-native-elements";
import moment from "moment";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { InvoiceDistributionCard } from "../components/InvoiceDistributionCard";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { UserService } from "../services/UserService";
import { PaymentService } from "../services/PaymentService";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  invoicesTitle: {
    marginTop: 12,
    fontSize: 22,
    fontStyle: "italic",
    alignSelf: "center",
  },
});

const statuses = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "SUCCEEDED",
    label: "Succeeded",
  },
  {
    value: "FAILED",
    label: "Failed",
  },
];

export default ({ route, navigation }) => {
  const [currentPayment, setCurrentPayment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);
      PaymentService.getPaymentById(route.params.payment.id)
        .then(setCurrentPayment)
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
      <SafeAreaView style={{ paddingBottom: 15 }}>
        <ScrollView>
          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Amount:</Text>}
            text={`${currentPayment.amount} €`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Status:</Text>}
            text={`${
              currentPayment.status
                ? statuses.filter((s) => s.value === currentPayment.status)[0]
                    .label
                : "-"
            }`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Payment date:</Text>}
            text={`${moment(getDateFromString(currentPayment.createdAt)).format(
              "lll"
            )}`}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Initiator:</Text>}
            text={
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  activeOpacity={0.7}
                  size={screen.width * 0.09}
                  rounded
                  source={
                    currentPayment.user?.profilePictureURL
                      ? {
                          uri: currentPayment.user?.profilePictureURL,
                        }
                      : require("../assets/images/profile-placeholder.png")
                  }
                />
                <Text
                  style={{ fontSize: 18, alignSelf: "center", marginLeft: 7 }}
                >
                  {currentPayment.user?.firstName}{" "}
                  {currentPayment.user?.lastName}
                </Text>
              </View>
            }
            onPress={() => {
              navigation.push("Profile", { userId: currentPayment.user?.id });
            }}
            active
          />

          <Text style={styles.invoicesTitle}>Invoices</Text>

          {currentPayment.invoiceDistributions?.map((id) => {
            return (
              <InvoiceDistributionCard
                key={id.id}
                displayCheckbox={false}
                invoiceDistribution={id}
                currentUser={currentUser}
                onSelect={() =>
                  navigation.push("ViewInvoiceDistribution", {
                    invoiceDistribution: id,
                  })
                }
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
