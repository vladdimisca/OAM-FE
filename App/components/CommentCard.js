import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
import moment from "moment";

import colors from "../constants/colors";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
});

export const CommentCard = ({ comment, rightIcon, onProfilePicturePress }) => {
  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={onProfilePicturePress}>
        <Avatar
          activeOpacity={0.7}
          size={screen.width * 0.12}
          rounded
          source={
            comment.user?.profilePictureURL
              ? {
                  uri: comment.user?.profilePictureURL,
                }
              : require("../assets/images/profile-placeholder.png")
          }
        />
      </TouchableOpacity>

      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}>
          {`${comment.user?.firstName} ${comment.user?.lastName}`}
        </Text>

        <Text
          style={{
            color: colors.lightText,
            fontSize: 11,
          }}
        >
          {moment(getDateFromString(comment?.createdAt)).format("lll")}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 15,
            textAlign: "justify",
            maxWidth: screen.width * 0.7,
            marginTop: 5,
          }}
        >
          {comment.text}
        </Text>
      </View>

      {rightIcon}
    </View>
  );
};

export const Separator = () => {
  return <View style={styles.separator} />;
};
