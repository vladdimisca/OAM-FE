/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  LogBox,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  StripeProvider,
  presentPaymentSheet,
  initPaymentSheet,
} from "@stripe/stripe-react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import MonthSelectorCalendar from "react-native-month-selector";
import moment from "moment/moment";
import { CommonActions } from "@react-navigation/native";
import { FontAwesome } from "react-native-vector-icons";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import { GeneralButton } from "../components/GeneralButton";
import { CustomDropdown } from "../components/CustomDropdown";
import { ProfileItem } from "../components/ProfileItem";
import { InvoiceDistributionCard } from "../components/InvoiceDistributionCard";

// services
import { PaymentService } from "../services/PaymentService";
import { ApartmentService } from "../services/ApartmentService";
import { InvoiceDistributionService } from "../services/InvoiceDistributionService";
import { UserService } from "../services/UserService";

// storage
import { UserStorage } from "../util/UserStorage";

// config
import config from "../../config";

// ignored logs
LogBox.ignoreLogs(["Warning: componentWillMount has been renamed"]);

const styles = StyleSheet.create({
  errorText: {
    marginHorizontal: 25,
    color: "red",
    fontSize: 14,
    alignSelf: "center",
  },
  dropdown: {
    marginHorizontal: 25,
    marginBottom: 20,
    marginTop: 15,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReqLoading, setIsReqLoading] = useState(false);

  const [apartments, setApartments] = useState([]);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [invoiceDistributions, setInvoiceDistributions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0.0);
  const [selections, setSelections] = useState();

  const resetAmountAndSelections = () => {
    setAmountToPay(0.0);
    setSelections(
      selections.map((s) => {
        return { ...s, isSelected: false };
      })
    );
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setAmountToPay(0.0);

      const { userId } = await UserStorage.retrieveUserIdAndToken();
      await UserService.getUserById(userId).then((user) =>
        setCurrentUser(user)
      );

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

      await InvoiceDistributionService.getInvoiceDistributions()
        .then((invDistributions) => {
          setSelections(
            invDistributions.map((id) => {
              return {
                id: id.id,
                isSelected: false,
                amount: parseFloat(id.amount, 10),
              };
            })
          );
          setInvoiceDistributions(invDistributions);
        })
        .finally(() => setIsLoading(false));
    })();
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
        backgroundColor={colors.white}
      />
      <SafeAreaView style={{ paddingBottom: 145 }}>
        <ScrollView>
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
                    resetAmountAndSelections();
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
                      resetAmountAndSelections();
                      setIsDatePickerActive(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: colors.midBlue }}>Change</Text>
                  </TouchableOpacity>
                }
                text={formatDate(date)}
              />

              <ProfileItem
                leftIcon={<Text style={styles.amountText}>Amount to pay:</Text>}
                text={`${amountToPay} €`}
              />

              {invoiceDistributions
                .filter((id) => selectedApartment === id.apartment?.id)
                .filter((id) => {
                  return (
                    getYear(date) === JSON.stringify(id.invoice.year) &&
                    getMonth(date, "numeric") ===
                      JSON.stringify(id.invoice.month)
                  );
                })
                .filter(
                  (id) => id.payment == null || id.payment.status === "FAILED"
                )
                .map((id) => {
                  return (
                    <InvoiceDistributionCard
                      key={id.id}
                      invoiceDistribution={id}
                      isSelected={
                        selections?.filter((s) => s.id === id.id)[0]?.isSelected
                      }
                      setSelection={() => {
                        setSelections(
                          selections.map((s) => {
                            if (s.id === id.id) {
                              setAmountToPay(
                                s.isSelected
                                  ? amountToPay - s.amount
                                  : amountToPay + s.amount
                              );
                              return { ...s, isSelected: !s.isSelected };
                            }
                            return s;
                          })
                        );
                      }}
                      currentUser={currentUser}
                      onSelect={() =>
                        navigation.push("ViewInvoiceDistribution", {
                          invoiceDistribution: id,
                        })
                      }
                    />
                  );
                })}
            </>
          )}
        </ScrollView>

        {!isDatePickerActive && (
          <StripeProvider
            style={{ position: "absolute" }}
            publishableKey={config.STRIPE_PUBLISHABLE_KEY}
          >
            <GeneralButton
              isActive={selections?.filter((s) => s.isSelected).length === 0}
              text="Pay"
              onPress={async () => {
                setIsReqLoading(true);
                const invoiceDistributionIds = selections
                  ?.filter((s) => s.isSelected)
                  .map((s) => s.id);
                const { paymentIntent } = await PaymentService.create(
                  invoiceDistributionIds
                ).catch((err) => {
                  setIsReqLoading(false);
                  if (err?.response?.request?._response) {
                    alert(
                      `${
                        JSON.parse(err.response.request._response)
                          .errorMessages[0].errorMessage
                      }`
                    );
                  } else {
                    alert("Oops, something went wrong!");
                  }
                  return { paymentIntent: null };
                });

                if (paymentIntent === null) {
                  return;
                }

                await initPaymentSheet({
                  merchantDisplayName: "OAM",
                  paymentIntentClientSecret: paymentIntent,
                  allowsDelayedPaymentMethods: true,
                  style: "alwaysDark",
                });

                await presentPaymentSheet()
                  .then((response) => {
                    if (response?.error?.code === "Canceled") {
                      alert(response?.error?.localizedMessage);
                      return;
                    }

                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        key: null,
                        routes: [
                          {
                            name: "App",
                            state: {
                              routes: [{ name: "Payments" }],
                            },
                          },
                        ],
                      })
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    alert(`The payment was not successful!`);
                  })
                  .finally(() => setIsReqLoading(false));
              }}
            />
          </StripeProvider>
        )}
      </SafeAreaView>
    </View>
  );
};
