/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import moment from "moment";

// constants
import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginTop: 17,
    backgroundColor: colors.offWhite,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "bold",
    color: colors.lightText,
    alignSelf: "center",
    marginTop: 6,
  },
  detailContainer: {
    maxWidth: "100%",
    flexDirection: "row",
    flex: 1,
    marginTop: 5,
  },
  detailText: {
    flex: 1,
    maxWidth: "100%",
    flexWrap: "wrap",
    fontSize: 15,
  },
  rightColumn: {
    marginHorizontal: 20,
    flexDirection: "column",
    flex: 1,
  },
  menuText: {
    color: "#e60000",
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
  innerText: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
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

export const PaymentCard = ({ payment, onSelect, onProfilePicturePress }) => {
  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={onProfilePicturePress}>
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.12}
            rounded
            source={
              payment.user?.profilePictureURL
                ? {
                    uri: payment.user?.profilePictureURL,
                  }
                : require("../assets/images/profile-placeholder.png")
            }
          />
          <Text
            style={{
              fontSize: 12,
              marginTop: 5,
              fontStyle: "italic",
              alignSelf: "center",
            }}
          >
            {payment.user.firstName}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Amount: </Text>
          <Text style={styles.detailText}>{payment.amount} €</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Status: </Text>
          <Text style={styles.detailText}>
            {statuses.filter((s) => s.value === payment.status)[0].label}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Payment date: </Text>
          <Text style={styles.detailText}>
            {moment(getDateFromString(payment.createdAt)).format("lll")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
