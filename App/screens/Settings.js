import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  RefreshControl,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Fontisto, Feather } from "react-native-vector-icons";
import CountryPicker, {
  getAllCountries,
} from "react-native-country-picker-modal";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import { CommonActions } from "@react-navigation/routers";

// constants
import colors from "../constants/colors";

// components
import { GeneralButton } from "../components/GeneralButton";
import { ItemSeparator } from "../components/ProfileItem";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// services
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/UserStorage";

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
  avatarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 5,
  },
  inputContainerStyle: {
    marginHorizontal: 5,
  },
  textAreaContainer: {
    marginHorizontal: 5,
    paddingVertical: 8,
    marginBottom: -8,
    borderWidth: 2 * StyleSheet.hairlineWidth,
    borderColor: colors.darkBorder,
    borderRadius: 10,
  },
  leftIconContainerStyle: {
    marginLeft: 5,
    marginRight: 12,
  },
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  actionText: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.lightBlue,
    marginVertical: 15,
  },
  fieldErrorText: {
    marginHorizontal: 20,
    color: colors.red,
    fontSize: 15,
    marginBottom: 17,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [countryCode, setCountryCode] = useState("RO");
  const [profileUpdateError, setProfileUpdateError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

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

  const fetchData = useCallback(async () => {
    const { userId } = await UserStorage.retrieveUserIdAndToken();

    const currentUser = await UserService.getUserById(userId).catch(() => null);

    if (currentUser !== null) {
      setUser(currentUser);

      await getAllCountries()
        .then(
          (countries) =>
            countries.find((c) =>
              c.callingCode.includes(currentUser.callingCode)
            ).cca2
        )
        .then((cca2) => setCountryCode(cca2));
      setIsScreenLoading(false);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          key: null,
          routes: [
            {
              name: "Authentication",
              state: {
                routes: [{ name: "Login" }],
              },
            },
          ],
        })
      );
    }
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, [navigation, fetchData]);

  const redirectToProfile = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        key: null,
        routes: [
          {
            name: "App",
            state: {
              routes: [{ name: "My Profile" }],
            },
          },
        ],
      })
    );
  };

  const updateProfilePicture = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setFieldErrors(null);
    setProfileUpdateError("");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) {
      setIsLoading(false);
      return;
    }

    const { userId } = await UserStorage.retrieveUserIdAndToken();

    await UserService.updateProfilePictureById(userId, result.assets[0])
      .then(redirectToProfile)
      .catch((err) => {
        if (err?.response?.request?._response) {
          const errorMessages = JSON.parse(
            err.response.request._response
          ).errorMessages;
          if (errorMessages[0].fieldName !== null) {
            setFieldErrors(
              JSON.parse(err.response.request._response).errorMessages
            );
          } else {
            setProfileUpdateError(
              `${
                JSON.parse(err.response.request._response).errorMessages[0]
                  .errorMessage
              }`
            );
          }
        } else {
          setProfileUpdateError("Oops, something went wrong!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const updateUser = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setFieldErrors(null);
    setProfileUpdateError("");

    const { userId } = await UserStorage.retrieveUserIdAndToken();

    UserService.updateUserById(userId, user)
      .then((updatedUser) => {
        setUser(updatedUser);
        redirectToProfile();
      })
      .catch((err) => {
        if (err?.response?.request?._response) {
          const errorMessages = JSON.parse(
            err.response.request._response
          ).errorMessages;
          if (errorMessages[0].fieldName !== null) {
            setFieldErrors(
              JSON.parse(err.response.request._response).errorMessages
            );
          } else {
            setProfileUpdateError(
              `${
                JSON.parse(err.response.request._response).errorMessages[0]
                  .errorMessage
              }`
            );
          }
        } else {
          setProfileUpdateError("Oops, something went wrong!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const signOut = async () => {
    UserStorage.clearStorage().then(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          key: null,
          routes: [
            {
              name: "Authentication",
              state: {
                routes: [{ name: "Login" }],
              },
            },
          ],
        })
      );
    });
  };

  const changePassword = () => {
    navigation.push("ChangePassword");
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner
        customIndicator={
          <DotIndicator color={colors.midBlue} count={3} size={12} />
        }
        visible={isLoading}
      />

      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />

      {isScreenLoading ? (
        <View style={styles.dotIndicatorContainer}>
          <DotIndicator color={colors.midBlue} count={3} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView
            refreshControl={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  setProfileUpdateError("");
                  fetchData().finally(() => setIsRefreshing(false));
                }}
              />
            }
          >
            <View style={styles.avatarContainer}>
              <Avatar
                size={screen.width * 0.35}
                rounded
                source={
                  user.profilePictureURL
                    ? {
                        uri: user.profilePictureURL,
                      }
                    : require("../assets/images/profile-placeholder.png")
                }
              >
                <Avatar.Accessory
                  size={34}
                  style={{ backgroundColor: colors.border }}
                  onPress={updateProfilePicture}
                  activeOpacity={0.7}
                />
              </Avatar>
            </View>

            <Input
              errorMessage={getFieldError("firstName")}
              errorStyle={getFieldErrorStyle("firstName")}
              leftIcon={
                <Icon name="user" size={24} color={colors.darkBorder} />
              }
              label="First Name"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.firstName}
              onChangeText={(fName) =>
                setUser((value) => {
                  return { ...value, firstName: fName };
                })
              }
            />

            <Input
              errorMessage={getFieldError("lastName")}
              errorStyle={getFieldErrorStyle("lastName")}
              leftIcon={
                <Icon name="user" size={24} color={colors.darkBorder} />
              }
              label="Last Name"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.lastName}
              onChangeText={(lName) =>
                setUser((value) => {
                  return { ...value, lastName: lName };
                })
              }
            />

            <Input
              errorMessage={getFieldError("description")}
              errorStyle={getFieldErrorStyle("description")}
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Feather
                  name="message-circle"
                  size={24}
                  color={colors.darkBorder}
                />
              }
              multiline
              maxLength={120}
              label="Description"
              labelStyle={{ ...styles.labelStyle, marginBottom: 8 }}
              inputContainerStyle={styles.textAreaContainer}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.description}
              onChangeText={(desc) =>
                setUser((value) => {
                  return { ...value, description: desc };
                })
              }
            />

            <Input
              errorMessage={getFieldError("email")}
              errorStyle={getFieldErrorStyle("email")}
              autoCapitalize="none"
              leftIcon={
                <Fontisto name="email" size={24} color={colors.darkBorder} />
              }
              label="Email"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.email}
              onChangeText={(em) =>
                setUser((value) => {
                  return { ...value, email: em };
                })
              }
            />

            <Input
              errorMessage={getFieldError("phoneNumber")}
              errorStyle={getFieldErrorStyle("phoneNumber")}
              autoCapitalize="none"
              leftIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withFlagButton
                  withCallingCode
                  withCallingCodeButton
                  withAlphaFilter
                  onSelect={(newCountry) => {
                    setCountryCode(newCountry.cca2);
                    setUser((value) => {
                      return {
                        ...value,
                        callingCode: newCountry.callingCode.indexOf(0),
                      };
                    });
                  }}
                />
              }
              label="Phone Number"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainerStyle}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              value={user.phoneNumber}
              onChangeText={(phone) =>
                setUser((value) => {
                  return { ...value, phoneNumber: phone };
                })
              }
            />

            {isLoading === false && profileUpdateError !== "" && (
              <Text style={styles.errorText}>{profileUpdateError}</Text>
            )}

            <GeneralButton
              text="Save profile information"
              onPress={updateUser}
            />

            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <ItemSeparator />

              <TouchableOpacity onPress={signOut} activeOpacity={0.6}>
                <Text style={{ ...styles.actionText, color: colors.green }}>
                  Sign out
                </Text>
              </TouchableOpacity>

              <ItemSeparator />

              <TouchableOpacity onPress={changePassword} activeOpacity={0.6}>
                <Text style={styles.actionText}>Change password</Text>
              </TouchableOpacity>

              <ItemSeparator />

              <TouchableOpacity
                onPress={() => navigation.push("DeleteAccount")}
                activeOpacity={0.6}
              >
                <Text style={{ ...styles.actionText, color: colors.red }}>
                  Delete account
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};
