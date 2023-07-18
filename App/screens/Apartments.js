import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Feather } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { ApartmentService } from "../services/ApartmentService";
import { UserService } from "../services/UserService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { ApartmentCard } from "../components/ApartmentCard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  emptyListText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 25,
  },
  menuOption: {
    alignSelf: "center",
    fontSize: 14,
    padding: 5,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apartments, setApartments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const getApartments = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then((user) => setCurrentUser(user));

    await ApartmentService.getApartments()
      .then(setApartments)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.push("CreateApartment");
          }}
        >
          <Feather
            name="plus-circle"
            size={24}
            color={colors.midBlue}
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });

    getApartments();
  }, [navigation, getApartments]);

  return (
    <View style={styles.container}>
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

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getApartments().finally(() => setIsRefreshing(false));
              }}
            />
          }
          style={{ marginTop: 75 }}
        >
          {apartments.map((apartment) => {
            return (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                currentUser={currentUser}
                onSelect={() => {
                  navigation.push("ViewApartment", { apartment });
                }}
              />
            );
          })}

          {apartments.length === 0 && (
            <Text style={styles.emptyListText}>
              There is no apartment created yet!
            </Text>
          )}

          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
