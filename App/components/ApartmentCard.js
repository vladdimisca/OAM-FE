/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "react-native-vector-icons";

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
    marginTop: 5,
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
    marginRight: 20,
    flexDirection: "column",
    flex: 1,
  },
  leftColumn: {
    marginLeft: 20,
    flexDirection: "column",
    flex: 2,
  },
  menuText: {
    color: "#e60000",
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
});

export const ApartmentCard = ({
  apartment,
  onDetails,
  onMembers,
  onLeave,
  currentUser,
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Number: </Text>
          <Text style={styles.detailText}>{apartment.number}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Number of persons: </Text>
          <Text style={styles.detailText}>{apartment.numberOfPersons}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Surface: </Text>
          <Text style={{ ...styles.detailText, marginTop: -2 }}>
            {apartment.surface} ㎡
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.innerText}>Code: </Text>
          <View style={{ ...styles.detailText, flexDirection: "row" }}>
            <Text style={{ marginTop: showCode ? 0 : 2 }}>
              {showCode ? apartment.code : apartment.code.replace(/./g, "*")}
            </Text>
            {(apartment.admins
              ?.map((user) => user.id)
              .includes(currentUser.id) ||
              apartment.members
                ?.map((user) => user.id)
                .includes(currentUser.id)) && (
              <TouchableOpacity
                style={{ marginLeft: 4 }}
                onPress={() => setShowCode(!showCode)}
                activeOpacity={0.7}
              >
                <Ionicons
                  style={{ marginTop: 1 }}
                  name={showCode ? "eye-outline" : "eye-off-outline"}
                  size={19}
                  color={colors.lightText}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.rightColumn}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={onDetails}
          activeOpacity={0.7}
        >
          <MaterialIcons name="apartment" size={22} color={colors.lightText} />
          <Text style={{ fontSize: 15, marginLeft: 2, color: colors.midBlue }}>
            Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", marginTop: 10 }}
          onPress={onMembers}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="users" size={20} color={colors.lightText} />
          <Text style={{ fontSize: 15, marginLeft: 3, color: colors.green }}>
            Members
          </Text>
        </TouchableOpacity>

        {apartment.members?.map((user) => user.id).includes(currentUser.id) && (
          <TouchableOpacity
            style={{ flexDirection: "row", marginTop: 10 }}
            onPress={onLeave}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="exit-run"
              size={20}
              color={colors.lightText}
            />
            <Text style={{ fontSize: 15, marginLeft: 3, color: colors.red }}>
              Leave
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
