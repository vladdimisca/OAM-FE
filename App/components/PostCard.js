/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar, Overlay } from "react-native-elements";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "react-native-vector-icons";
import moment from "moment";

// constants
import colors from "../constants/colors";

import { FocusAwareStatusBar } from "./FocusAwareStatusBar";

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
  titleText: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.lightText,
  },
  column: {
    marginLeft: 15,
    flexDirection: "column",
    flex: 1,
  },
  menuText: {
    color: colors.green,
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
  detailContainer: {
    maxWidth: "100%",
    flexDirection: "row",
    flex: 1,
    marginTop: 3,
  },
});

export const PostCard = ({ post, onPress, onProfilePicturePress }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  return (
    <View style={styles.card}>
      {isOverlayVisible && (
        <FocusAwareStatusBar backgroundColor={colors.border} />
      )}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          activeOpacity={0.7}
          onPress={onProfilePicturePress}
        >
          <Avatar
            activeOpacity={0.7}
            size={screen.width * 0.15}
            rounded
            source={
              post.user?.profilePictureURL
                ? {
                    uri: post.user?.profilePictureURL,
                  }
                : require("../assets/images/profile-placeholder.png")
            }
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            marginTop: 3,
            fontStyle: "italic",
            alignSelf: "center",
          }}
        >
          {`${post.user.firstName} ${post.user.lastName}`}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{ ...styles.column, flex: 1 }}
      >
        <Text style={styles.titleText}>
          {post.title?.length > 22
            ? `${post.title?.substring(0, 22)}...`
            : post.title}
        </Text>

        <Text style={{ fontSize: 12 }}>
          {`Posted at ${moment(getDateFromString(post.createdAt)).format(
            "lll"
          )}`}
        </Text>

        <View
          style={{
            ...styles.detailContainer,
            flexDirection: "column",
          }}
        >
          <Text style={{ fontSize: 12 }}>
            Str. {post.association?.street}, no. {post.association?.number}, bl.{" "}
            {post.association?.block}, {post.association?.locality},{" "}
            {post.association?.country}
          </Text>
        </View>
      </TouchableOpacity>

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
            <MenuOption onSelect={() => setIsOverlayVisible(true)}>
              <Text style={styles.menuText}>Show summary</Text>
            </MenuOption>
          </TouchableOpacity>
        </MenuOptions>
      </Menu>

      <Overlay
        overlayStyle={{
          width: screen.width * 0.9,
          minHeight: screen.height * 0.4,
          borderRadius: 10,
        }}
        backdropStyle={{
          backgroundColor: colors.lightText,
          opacity: 0.4,
        }}
        isVisible={isOverlayVisible}
        onBackdropPress={() => setIsOverlayVisible(false)}
      >
        <Text
          style={{
            textAlign: "justify",
            paddingHorizontal: 10,
            paddingTop: 10,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Auto-generated summary (English version):
        </Text>
        <Text style={{ textAlign: "justify", padding: 10, fontSize: 14 }}>
          {post.summary}
        </Text>
      </Overlay>
    </View>
  );
};
