/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar, Input } from "react-native-elements";
import moment from "moment";
import {
  Feather,
  AntDesign,
  Ionicons,
  MaterialIcons,
} from "react-native-vector-icons";
import { CommonActions } from "@react-navigation/native";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { CommentCard, Separator } from "../components/CommentCard";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { CommentService } from "../services/CommentService";

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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.darkBorder,
    borderRadius: 20,
    backgroundColor: colors.lightWhite,
    marginTop: 15,
  },
  rightIconContainerStyle: {
    marginLeft: 5,
    marginRight: 12,
  },
  emptyListText: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 20,
  },
  fieldErrorText: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: -5,
    color: colors.red,
    fontSize: 15,
    marginBottom: 10,
  },
});

export default ({ navigation, route }) => {
  const [currentPost, setCurrentPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReqLoading, setIsReqLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  // refs
  const scrollRef = useRef();

  const getDateFromString = (strDate) => {
    const date = new Date(strDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const getFieldError = (fieldName) => {
    if (fieldErrors === null) {
      return null;
    }
    const errors = fieldErrors?.filter((fe) => fe.fieldName === fieldName);
    return errors.length !== 0 ? errors[0].errorMessage : null;
  };

  const getFieldErrorStyle = (fieldName) => {
    return getFieldError(fieldName) !== null ? styles.fieldErrorText : null;
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then(setCurrentUser);
    await PostService.getPostById(route.params.post.id).then(setCurrentPost);
    await CommentService.getComments(route.params.post.id)
      .then(setComments)
      .finally(() => setIsLoading(false));
  }, [route]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View>
      <Spinner
        overlayColor={colors.white}
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isReqLoading}
      />
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.offWhite}
      />
      <SafeAreaView style={{ paddingBottom: 195 }}>
        <ScrollView
          ref={scrollRef}
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadData().finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
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

            {!isPostEditing && (
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 15,
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      ...styles.headerText,
                      maxWidth: screen.width * 0.67,
                    }}
                  >
                    {currentPost?.title}
                  </Text>

                  {currentUser?.id === currentPost?.user?.id && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          setNewText(currentPost?.text);
                          setNewTitle(currentPost?.title);
                          setIsPostEditing(true);
                        }}
                      >
                        <Feather name="edit" size={21} color={colors.green} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={async () => {
                          Alert.alert(
                            "Do you really want to remove this post?",
                            "This action is not reversible!",
                            [
                              {
                                text: "Delete",
                                onPress: async () => {
                                  setIsLoading(true);
                                  PostService.deletePostById(currentPost.id)
                                    .then(() => {
                                      navigation.dispatch(
                                        CommonActions.reset({
                                          index: 0,
                                          key: null,
                                          routes: [
                                            {
                                              name: "App",
                                              state: {
                                                routes: [
                                                  {
                                                    name: "Posts",
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        })
                                      );
                                    })
                                    .catch((err) => {
                                      let alertMessage =
                                        "Oops, something went wrong!";
                                      if (err?.response?.request?._response) {
                                        alertMessage = `${
                                          JSON.parse(
                                            err.response.request._response
                                          ).errorMessages[0].errorMessage
                                        }`;
                                      }
                                      Alert.alert(
                                        "Could not delete this post!",
                                        alertMessage,
                                        [
                                          {
                                            text: "Ok",
                                            style: "cancel",
                                          },
                                        ]
                                      );
                                    })
                                    .finally(() => setIsLoading(false));
                                },
                              },
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                            ]
                          );
                        }}
                      >
                        <AntDesign
                          name="delete"
                          size={21}
                          color={colors.red}
                          style={{ marginLeft: 8 }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

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
            )}

            {isPostEditing && (
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 15,
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={async () => {
                      if (isReqLoading === true) {
                        return;
                      }
                      setIsReqLoading(true);
                      setFieldErrors(null);

                      PostService.updatePostById(currentPost?.id, {
                        title: newTitle,
                        text: newText,
                      })
                        .then((post) => {
                          setCurrentPost(post);
                          setIsPostEditing(false);
                        })
                        .catch((err) => {
                          let alertMessage = "Oops, something went wrong!";
                          if (err?.response?.request?._response) {
                            const errorMessages = JSON.parse(
                              err.response.request._response
                            ).errorMessages;
                            if (errorMessages[0].fieldName !== null) {
                              setFieldErrors(
                                JSON.parse(err.response.request._response)
                                  .errorMessages
                              );
                              return;
                            }
                            alertMessage = `${errorMessages[0].errorMessage}`;
                          }
                          Alert.alert(
                            "Could not update this post!",
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
                      size={25}
                      color={colors.midBlue}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setFieldErrors(null);
                      setIsPostEditing(false);
                    }}
                  >
                    <MaterialIcons
                      name="cancel"
                      size={22}
                      color={colors.red}
                      style={{ marginLeft: 6 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Input
                    errorMessage={getFieldError("title")}
                    errorStyle={getFieldErrorStyle("title")}
                    inputContainerStyle={{
                      marginBottom: -15,
                      marginHorizontal: -10,
                    }}
                    value={newTitle}
                    onChangeText={setNewTitle}
                  />
                </View>

                <Input
                  errorMessage={getFieldError("text")}
                  errorStyle={getFieldErrorStyle("text")}
                  multiline
                  maxLength={600}
                  inputContainerStyle={{
                    ...styles.textAreaContainer,
                    marginHorizontal: -15,
                    marginVertical: -20,
                  }}
                  value={newText}
                  onChangeText={setNewText}
                />
              </View>
            )}
          </View>

          {comments.map((comment) => {
            return (
              <View key={comment.id} style={{ backgroundColor: colors.white }}>
                <CommentCard
                  currentUser={currentUser}
                  isReqLoading={isReqLoading}
                  setIsReqLoading={setIsReqLoading}
                  setComments={setComments}
                  comment={comment}
                  onProfilePicturePress={() => {
                    navigation.push("Profile", { userId: comment.user?.id });
                  }}
                  onDelete={async () => {
                    Alert.alert(
                      "Do you really want to remove this comment?",
                      "This action is not reversible!",
                      [
                        {
                          text: "Delete",
                          onPress: async () => {
                            setIsLoading(true);
                            CommentService.deleteCommentById(comment.id)
                              .then(() => {
                                setComments(
                                  comments.filter(
                                    (comm) => comm.id !== comment.id
                                  )
                                );
                              })
                              .catch((err) => {
                                let alertMessage =
                                  "Oops, something went wrong!";
                                if (err?.response?.request?._response) {
                                  alertMessage = `${
                                    JSON.parse(err.response.request._response)
                                      .errorMessages[0].errorMessage
                                  }`;
                                }
                                Alert.alert(
                                  "Could not delete this comment!",
                                  alertMessage,
                                  [
                                    {
                                      text: "Ok",
                                      style: "cancel",
                                    },
                                  ]
                                );
                              })
                              .finally(() => setIsLoading(false));
                          },
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                />
                <Separator />
              </View>
            );
          })}

          {comments.length === 0 && (
            <Text style={styles.emptyListText}>
              There is no comment to display yet!
            </Text>
          )}
        </ScrollView>

        <Input
          rightIcon={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                if (isReqLoading === true) {
                  return;
                }
                setIsReqLoading(true);

                CommentService.createComment({
                  postId: currentPost?.id,
                  text: newComment,
                })
                  .then((comm) => {
                    setNewComment("");
                    setComments([...comments, comm]);
                    scrollRef.current?.scrollToEnd({ animated: true });
                  })
                  .catch((err) => {
                    let alertMessage = "Oops, something went wrong!";
                    if (err?.response?.request?._response) {
                      alertMessage = `${
                        JSON.parse(err.response.request._response)
                          .errorMessages[0].errorMessage
                      }`;
                    }
                    Alert.alert("Could not add this comment!", alertMessage, [
                      {
                        text: "Ok",
                        style: "cancel",
                      },
                    ]);
                  })
                  .finally(() => setIsReqLoading(false));
              }}
            >
              <Feather name="send" size={25} color={colors.midBlue} />
            </TouchableOpacity>
          }
          multiline
          maxLength={200}
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
