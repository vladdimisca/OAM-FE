/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// constants
import colors from "../constants/colors";

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
  },
  detailText: {
    flex: 1,
    maxWidth: "100%",
    flexWrap: "wrap",
    fontSize: 15,
  },
  innerText: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
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
});

export const ApartmentCard = ({ apartment, onSelect, currentUser }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Number: </Text>
          <Text style={styles.detailText}>{apartment.number}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Number of persons: </Text>
          <Text style={styles.detailText}>{apartment.numberOfPersons}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Code: </Text>
          <Text style={styles.detailText}>{apartment.code}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
