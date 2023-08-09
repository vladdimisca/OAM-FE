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
import * as Linking from "expo-linking";
import Checkbox from "expo-checkbox";

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
  checkbox: {
    alignSelf: "center",
    marginTop: 15,
  },
});

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

export const InvoiceDistributionCard = ({
  invoiceDistribution,
  onSelect,
  isSelected,
  setSelection,
  displayCheckbox = true,
}) => {
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "short" });
  };

  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Linking.openURL(invoiceDistribution.invoice.documentUrl).catch(
              (err) => {
                console.log(err);
              }
            );
          }}
        >
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.12}
            rounded
            source={require("../assets/images/pdf.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 12, marginTop: 5, fontStyle: "italic" }}>
          {getMonthName(invoiceDistribution.invoice.month)}{" "}
          {invoiceDistribution.invoice.year}
        </Text>

        {displayCheckbox && (
          <Checkbox
            color={colors.green}
            style={styles.checkbox}
            value={isSelected}
            onValueChange={setSelection}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Name: </Text>
          <Text style={styles.detailText}>
            {invoiceDistribution.invoice.name}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.innerText}>Number: </Text>
            {invoiceDistribution.invoice.number}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Amount: </Text>
          <Text style={styles.detailText}>{invoiceDistribution.amount} €</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Type: </Text>
          <Text style={styles.detailText}>
            {
              types.filter(
                (t) => t.value === invoiceDistribution.invoice.type
              )[0].label
            }
          </Text>
        </View>
        <View
          style={{
            ...styles.detailContainer,
            flexDirection: "column",
          }}
        >
          <Text style={styles.detailText}>
            Ap. {invoiceDistribution.apartment.number} - Str.{" "}
            {invoiceDistribution.invoice.association?.street}, no.{" "}
            {invoiceDistribution.invoice.association?.number}, bl.{" "}
            {invoiceDistribution.invoice.association?.block},{" "}
            {invoiceDistribution.invoice.association?.locality},{" "}
            {invoiceDistribution.invoice.association?.country}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
