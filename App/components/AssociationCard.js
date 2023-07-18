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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "react-native-vector-icons";

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
});

export const AssociationCard = ({
  association,
  onImagePress,
  onAssociationPress,
  onSelect,
  currentUser,
}) => {
  const showMenu = true;

  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={onImagePress}>
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.14}
            rounded
            source={require("../assets/images/pin.png")}
          />
        </TouchableOpacity>

        {showMenu && (
          <Menu>
            <MenuTrigger>
              <Entypo
                size={32}
                name="menu"
                color={colors.border}
                style={{ alignSelf: "center", marginTop: 10 }}
              />
            </MenuTrigger>
            <MenuOptions>
              <TouchableOpacity activeOpacity={0.7}>
                <MenuOption onSelect={onSelect}>
                  {
                    <Text
                      style={{
                        ...styles.menuText,
                        color: colors.lightBlue,
                      }}
                    >
                      Send request
                    </Text>
                  }
                  {<Text style={styles.menuText}>Delete</Text>}
                </MenuOption>
              </TouchableOpacity>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <TouchableOpacity
        style={styles.rightColumn}
        activeOpacity={0.7}
        onPress={onAssociationPress}
      >
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            {association.locality}, {association.country}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            {association.street}, {association.number}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            Staircase {association.staircase}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
