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
    marginHorizontal: 22,
    marginTop: 17,
    backgroundColor: colors.offWhite,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.lightText,
  },
  column: {
    marginLeft: 15,
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  menuText: {
    color: "#e60000",
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
  labelStyle: {
    color: colors.text,
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: -10,
  },
});

export const UserCard = ({
  user,
  onPress,
  onDelete,
  role,
  apartments = [],
}) => {
  return (
    <View style={styles.card}>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.18}
            rounded
            source={
              user?.profilePictureURL
                ? {
                    uri: user?.profilePictureURL,
                  }
                : require("../assets/images/profile-placeholder.png")
            }
          />
        </TouchableOpacity>

        <Text style={styles.description}>{role}</Text>
      </View>

      <View style={{ ...styles.column, flex: 1 }}>
        <Text style={styles.nameText}>
          {`${user?.firstName} ${user?.lastName}`}
        </Text>

        <Text style={styles.description}>
          {user?.description?.length > 22
            ? `${user?.description.substring(0, 22)}...`
            : user?.description}
        </Text>

        <Text style={styles.description}>
          {`Apartments: ${
            apartments.length === 0 ? "-" : apartments.map((a) => a.number)
          }`}
        </Text>
      </View>

      <Menu>
        <MenuTrigger>
          <Entypo
            size={34}
            name="menu"
            color={colors.border}
            style={{ marginRight: 8 }}
          />
        </MenuTrigger>

        <MenuOptions>
          <TouchableOpacity activeOpacity={0.7}>
            <MenuOption onSelect={onDelete}>
              <Text style={styles.menuText}>Delete</Text>
            </MenuOption>
          </TouchableOpacity>
        </MenuOptions>
      </Menu>
    </View>
  );
};
