import React, { useState } from "react";
import { StyleSheet, Alert, View, Dimensions, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Input } from "react-native-elements";
import moment from "moment";
import { AntDesign, Ionicons, MaterialIcons } from "react-native-vector-icons";

import colors from "../constants/colors";

// services
import { CommentService } from "../services/CommentService";

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
  textAreaContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.darkBorder,
    borderRadius: 20,
    backgroundColor: colors.lightWhite,
    marginTop: 15,
    marginBottom: -25,
    marginLeft: -12,
  },
});

export const CommentCard = ({
  comment,
  onProfilePicturePress,
  currentUser,
  onDelete,
  isReqLoading,
  setIsReqLoading,
  setComments,
}) => {
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [newText, setNewText] = useState("");

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

      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{ color: colors.text, fontWeight: "bold", fontSize: 16 }}
            >
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
          </View>

          {comment?.user?.id === currentUser?.id &&
            (!isCommentEditing ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setNewText(comment?.text);
                    setIsCommentEditing(true);
                  }}
                >
                  <AntDesign name="edit" size={20} color={colors.green} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={onDelete}>
                  <AntDesign
                    name="delete"
                    size={20}
                    color={colors.red}
                    style={{ marginHorizontal: 8 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={async () => {
                    if (isReqLoading === true) {
                      return;
                    }
                    setIsReqLoading(true);

                    CommentService.updateCommentById(comment.id, {
                      text: newText,
                    })
                      .then((comm) => {
                        setComments((comms) => {
                          return comms.map((c) =>
                            c.id === comment.id ? comm : c
                          );
                        });
                        setIsCommentEditing(false);
                      })
                      .catch((err) => {
                        let alertMessage = "Oops, something went wrong!";
                        if (err?.response?.request?._response) {
                          alertMessage = `${
                            JSON.parse(err.response.request._response)
                              .errorMessages[0].errorMessage
                          }`;
                        }
                        Alert.alert(
                          "Could not update this comment!",
                          alertMessage,
                          [
                            {
                              text: "Ok",
                              style: "cancel",
                            },
                          ]
                        );
                      })
                      .finally(() => {
                        setIsReqLoading(false);
                      });
                  }}
                >
                  <Ionicons
                    name="checkmark-done"
                    size={22}
                    color={colors.midBlue}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsCommentEditing(false)}
                >
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color={colors.red}
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {!isCommentEditing ? (
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
        ) : (
          <Input
            inputContainerStyle={styles.textAreaContainer}
            maxLength={200}
            multiline
            value={newText}
            onChangeText={setNewText}
          />
        )}
      </View>
    </View>
  );
};

export const Separator = () => {
  return <View style={styles.separator} />;
};
