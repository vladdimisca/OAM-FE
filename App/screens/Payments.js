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
import { PaymentService } from "../services/PaymentService";
import { UserService } from "../services/UserService";
import { ApartmentService } from "../services/ApartmentService";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { PaymentCard } from "../components/PaymentCard";
import { GeneralButton } from "../components/GeneralButton";
import { ProfileItem } from "../components/ProfileItem";
import { CustomDropdown } from "../components/CustomDropdown";

// ignored warnings
LogBox.ignoreLogs(["new NativeEventEmitter"]);

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
  dropdown: {
    marginHorizontal: 25,
    marginBottom: 20,
    marginTop: 15,
  },
});

export default ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState(null);

  const getPayments = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }
    const { userId } = await UserStorage.retrieveUserIdAndToken();
    await UserService.getUserById(userId).then((user) => setCurrentUser(user));

    await ApartmentService.getApartments().then((fetchedApartments) =>
      setApartments(
        fetchedApartments.map((a) => {
          return {
            label: `Ap. ${a.number} - Str. ${a.association?.street}, no. ${a.association?.number}, bl. ${a.association?.block}, ${a.association?.locality}, ${a.association?.country}`,
            value: a.id,
          };
        })
      )
    );

    await PaymentService.getPayments()
      .then(setPayments)
      .finally(() => setIsLoading(false));
  }, []);

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.push("CreatePayment");
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

    getPayments();
  }, [navigation, getPayments]);

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
                getPayments().finally(() => setIsRefreshing(false));
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
                    selectedApartment !== null
                      ? apartments.filter(
                          (a) => a.value === selectedApartment
                        )[0]?.label
                      : "Select the apartment..."
                  }
                  data={apartments}
                  onSelect={(selectedItem) => {
                    setSelectedApartment(selectedItem.value);
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
                    onPress={() => {
                      setIsDatePickerActive(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.midBlue }}>Change</Text>
                  </TouchableOpacity>
                }
                text={formatDate(date)}
              />

              {payments.map((payment) => {
                return (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    currentUser={currentUser}
                    onSelect={() => {
                      navigation.push("ViewPayment", { payment });
                    }}
                    onProfilePicturePress={() => {
                      navigation.push("Profile", {
                        userId: payment.user?.id,
                      });
                    }}
                  />
                );
              })}

              {payments.length === 0 && (
                <Text style={styles.emptyListText}>
                  There is no payment to display!
                </Text>
              )}
            </>
          )}
          <View style={{ paddingBottom: 15 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
