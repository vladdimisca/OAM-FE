/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar, Input } from "react-native-elements";
import moment from "moment";
import { Feather } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";
import { CommentCard, Separator } from "../components/CommentCard";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  dotIndicatorContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.offWhite,
    flexDirection: "column",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    elevation: 5,
    backgroundColor: colors.offWhite,
    marginRight: 28,
  },
  headerTextContainer: {
    maxWidth: screen.width * 0.65,
    flexDirection: "column",
  },
  headerText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: "bold",
  },
  textItem: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: colors.darkBorder,
  },
  actionText: {
    alignSelf: "center",
    fontSize: 18,
    color: colors.lightBlue,
    marginVertical: 15,
  },
  textAreaContainer: {
    marginHorizontal: 5,
    padding: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.darkBorder,
    borderRadius: 20,
    backgroundColor: colors.lightWhite,
    marginTop: 15,
    position: "absolute",
    alignSelf: "center",
  },
  rightIconContainerStyle: {
    marginLeft: 5,
    marginRight: 12,
  },
});

export default ({ route, navigation }) => {
  const [currentPost, setCurrentPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then(setCurrentUser);
      await PostService.getPostById(route.params.post.id).then(setCurrentPost);
      await CommentService.getComments()
        .then(setComments)
        .finally(() => setIsLoading(false));
    })();
  }, [route]);

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <SafeAreaView style={{ paddingBottom: 135 }}>
        <ScrollView>
          <View style={styles.header}>
            <View style={{ flexDirection: "row" }}>
              <Avatar
                size={screen.width * 0.16}
                rounded
                source={
                  currentPost.user?.profilePictureURL
                    ? {
                        uri: currentPost.user?.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
                containerStyle={styles.avatarContainer}
              />

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                  {`${currentPost.user?.firstName} ${currentPost.user?.lastName}`}
                </Text>

                <Text
                  style={{
                    color: colors.lightText,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {moment(getDateFromString(currentPost?.createdAt)).format(
                    "lll"
                  )}
                </Text>

                <Text
                  style={{ color: colors.text, fontSize: 12, marginTop: 3 }}
                >
                  Str. {currentPost.association?.street}, no.{" "}
                  {currentPost.association?.number}, bl.{" "}
                  {currentPost.association?.block},{" "}
                  {currentPost.association?.locality},{" "}
                  {currentPost.association?.country}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                marginTop: 15,
                paddingHorizontal: 15,
              }}
            >
              <Text style={styles.headerText}>{currentPost?.title}</Text>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 15,
                  textAlign: "justify",
                  marginTop: 8,
                }}
              >
                {currentPost?.text}
              </Text>
            </View>
          </View>

          {comments.map((comment) => {
            return (
              <View key={comment.id} style={{ backgroundColor: colors.white }}>
                <CommentCard comment={comment} />
                <Separator />
              </View>
            );
          })}
        </ScrollView>

        <Input
          rightIcon={
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="send" size={25} color={colors.midBlue} />
            </TouchableOpacity>
          }
          multiline
          maxLength={120}
          placeholder="Leave a comment..."
          inputContainerStyle={styles.textAreaContainer}
          rightIconContainerStyle={styles.rightIconContainerStyle}
          value={newComment}
          onChangeText={setNewComment}
        />
      </SafeAreaView>
    </View>
  );
};
