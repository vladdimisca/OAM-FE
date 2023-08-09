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

export const IndexCard = ({ index, onSelect }) => {
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", { month: "short" });
  };

  return (
    <View style={styles.card}>
      <View>
        <Text style={{ fontSize: 12, marginTop: 5, fontStyle: "italic" }}>
          {getMonthName(index.month)} {index.year}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Old index: </Text>
          <Text style={styles.detailText}>{index.oldIndex}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.innerText}>New index: </Text>
            {index.newIndex}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Type: </Text>
          <Text style={styles.detailText}>
            {types.filter((t) => t.value === index.type)[0].label}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.innerText}>Apartment number: </Text>
            {index.apartment?.number}
          </Text>
        </View>

        <View
          style={{
            ...styles.detailContainer,
            flexDirection: "column",
          }}
        >
          <Text style={styles.detailText}>
            Str. {index.apartment?.association?.street}, no.{" "}
            {index.apartment?.association?.number}, bl.{" "}
            {index.apartment?.association?.block},{" "}
            {index.apartment?.association?.locality},{" "}
            {index.apartment?.association?.country}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
