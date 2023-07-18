/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { CommonActions } from "@react-navigation/routers";
import { Avatar } from "react-native-elements";

// constants
import colors from "../constants/colors";

// config
import config from "../../config";

// services
import { AssociationService } from "../services/AssociationService";
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/UserStorage";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ProfileItem, ItemSeparator } from "../components/ProfileItem";
import { GeneralButton } from "../components/GeneralButton";

const screen = Dimensions.get("window");
const styles = StyleSheet.create({
  addressText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  dropdown: {
    marginTop: -12,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  labelStyle: {
    color: colors.text,
    marginHorizontal: 15,
  },
  inputContainerStyle: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
  },
  line: {
    height: 2 * StyleSheet.hairlineWidth,
    backgroundColor: colors.darkBorder,
  },
  choose: {
    marginLeft: 10,
    marginBottom: 12,
    fontSize: 16,
    color: colors.lightText,
  },
  dateContainer: {
    marginHorizontal: 25,
    marginVertical: 22,
  },
  dateTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  waypointsTitle: {
    marginTop: 12,
    fontSize: 22,
    fontStyle: "italic",
    alignSelf: "center",
  },
  emptyListText: {
    fontSize: 15,
    alignSelf: "center",
    marginTop: 7,
  },
});

export default ({ route, navigation }) => {
  const [currentAssociation, setCurrentAssociation] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setCurrentAssociation(route.params.association);
      setIsLoading(false);
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
      <SafeAreaView style={{ paddingBottom: 15 }}>
        <ScrollView>
          <ProfileItem
            leftIcon={
              <Avatar
                activeOpacity={0.7}
                size={screen.width * 0.09}
                rounded
                source={require("../assets/images/pin.png")}
              />
            }
            text="See on maps"
            active
            customTextColor={colors.midBlue}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Country:</Text>}
            text={currentAssociation.country}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Locality:</Text>}
            text={currentAssociation.locality}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Adm. area:</Text>}
            text={currentAssociation.administrativeArea}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Zip code:</Text>}
            text={currentAssociation.zipCode}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Street:</Text>}
            text={currentAssociation.street}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Number:</Text>}
            text={currentAssociation.number}
          />

          <ItemSeparator />

          <ProfileItem
            leftIcon={<Text style={styles.addressText}>Staircase:</Text>}
            text={currentAssociation.staircase}
          />

          <ItemSeparator />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 5,
              backgroundColor: colors.white,
              zIndex: 2,
            }}
          >
            <View style={{ flex: 1, marginRight: -12 }}>
              <GeneralButton text="Update details" />
            </View>

            <View style={{ flex: 1, marginLeft: -12 }}>
              <GeneralButton
                text="View apartments"
                backgroundColor="#32a883"
                onPress={() => {
                  navigation.push("Apartments");
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
