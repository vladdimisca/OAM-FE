import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { Feather, FontAwesome } from "react-native-vector-icons";
import MonthSelectorCalendar from "react-native-month-selector";
import moment from "moment/moment";

// constants
import colors from "../constants/colors";

// storage
import { UserStorage } from "../util/UserStorage";

// services
import { IndexService } from "../services/IndexService";
import { UserService } from "../services/UserService";
import { AssociationService } from "../services/AssociationService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { CustomDropdown } from "../components/CustomDropdown";
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem } from "../components/ProfileItem";
import { IndexCard } from "../components/IndexCard";

// ignored logs
LogBox.ignoreLogs(["Warning: componentWillMount has been renamed"]);

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
  dropdown: {
    marginTop: 5,
    marginHorizontal: 25,
    marginBottom: 20,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [indexes, setIndexes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [associations, setAssociations] = useState([]);
  const [selectedAssociation, setSelectedAssociation] = useState(null);

  const getYear = (dateToFormat) => {
    return new Intl.DateTimeFormat("en", { year: "numeric" }).format(
      dateToFormat
    );
  };

  const getMonth = (dateToFormat, format = "long") => {
    return new Intl.DateTimeFormat("en", { month: format }).format(
      dateToFormat
    );
  };

  const formatDate = (dateToFormat) => {
    const year = getYear(dateToFormat);
    const month = getMonth(dateToFormat);
    return `${month} ${year}`;
  };

  const getIndexes = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then((user) => setCurrentUser(user));
    await AssociationService.getAssociations(null).then((fetchedAssociations) =>
      setAssociations(
        fetchedAssociations.map((a) => {
          return {
            label: `Str. ${a.street}, no. ${a.number}, bl. ${a.block}, ${a.locality}, ${a.country}`,
            value: a.id,
          };
        })
      )
    );

    await IndexService.getIndexes()
      .then(setIndexes)
      .finally(() => setIsLoading(false));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.push("CreateIndex");
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

    getIndexes();
  }, [navigation, getIndexes]);

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
                getIndexes().finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          {isDatePickerActive && (
            <>
              <MonthSelectorCalendar
                selectedDate={date ? moment(date) : moment()}
                onMonthTapped={(newDate) => {
                  setDate(newDate);
                }}
                currentMonthTextStyle={{ color: colors.darkBlue }}
              />

              <GeneralButton
                onPress={() => {
                  setIsDatePickerActive(false);
                }}
                text="Done"
              />
            </>
          )}

          {!isDatePickerActive && (
            <>
              <View style={styles.dropdown}>
                <CustomDropdown
                  defaultButtonText={
                    selectedAssociation !== null
                      ? associations.filter(
                          (a) => a.value === selectedAssociation
                        )[0].label
                      : "Select the association..."
                  }
                  data={associations}
                  onSelect={(selectedItem) => {
                    setSelectedAssociation(selectedItem.value);
                  }}
                  buttonTextAfterSelection={(selectedItem) =>
                    selectedItem.label
                  }
                  rowTextForSelection={(selectedItem) => selectedItem.label}
                />
              </View>

              <ProfileItem
                leftIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <FontAwesome
                    style={{ marginRight: 15 }}
                    name="calendar"
                    size={22}
                    color={colors.lightText}
                  />
                }
                rightIcon={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <TouchableOpacity
                    onPress={() => setIsDatePickerActive(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.midBlue }}>Change</Text>
                  </TouchableOpacity>
                }
                text={formatDate(date)}
              />

              {indexes
                .filter(
                  (i) =>
                    selectedAssociation === null ||
                    selectedAssociation === i.apartment?.association?.id
                )
                .filter((i) => {
                  return (
                    getYear(date) === JSON.stringify(i.year) &&
                    getMonth(date, "numeric") === JSON.stringify(i.month)
                  );
                })
                .map((index) => {
                  return (
                    <IndexCard
                      key={index.id}
                      index={index}
                      currentUser={currentUser}
                      onSelect={() => navigation.push("ViewIndex", { index })}
                      onProfilePicturePress={() =>
                        navigation.push("Profile", {
                          userId: index.user?.id,
                        })
                      }
                    />
                  );
                })}

              {indexes
                .filter(
                  (i) =>
                    selectedAssociation === null ||
                    selectedAssociation === i.apartment?.association?.id
                )
                .filter((i) => {
                  return (
                    getYear(date) === JSON.stringify(i.year) &&
                    getMonth(date, "numeric") === JSON.stringify(i.month)
                  );
                }).length === 0 ? (
                // eslint-disable-next-line react/jsx-indent
                <Text style={styles.emptyListText}>
                  There is no index to display!
                </Text>
              ) : (
                <View style={{ marginBottom: 15 }} />
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
