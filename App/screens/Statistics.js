import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { DotIndicator } from "react-native-indicators";
import Spinner from "react-native-loading-spinner-overlay";
import { PieChart, LineChart } from "react-native-chart-kit";

// constants
import colors from "../constants/colors";

// components
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

// service
import { UserService } from "../services/UserService";
import { PaymentService } from "../services/PaymentService";
import { InvoiceService } from "../services/InvoiceService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 15,
    color: colors.text,
    marginVertical: 10,
    fontWeight: "bold",
  },
  text1: {
    fontSize: 16,
    marginHorizontal: 15,
    color: colors.text,
    marginTop: 6,
    marginBottom: 15,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 16,
    marginHorizontal: 15,
    color: colors.text,
    marginVertical: 10,
    fontWeight: "bold",
  },
});

export default () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [invoiceStats, setInvoiceStats] = useState(null);

  const fetchStatistics = useCallback(async (overlay = true) => {
    if (overlay) {
      setIsLoading(true);
    }

    await UserService.getAllUsers().then(setUsers);
    await InvoiceService.getStatistics().then(setInvoiceStats);
    await PaymentService.getPayments()
      .then(setPayments)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <View style={{ flex: 1 }}>
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
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchStatistics(false).finally(() => setIsRefreshing(false));
              }}
            />
          }
        >
          <Text style={styles.title}>
            {`Total number of registered users: ${users?.length}`}
          </Text>

          <Text style={{ ...styles.title, marginTop: 0 }}>
            {`Total number of banned users: ${
              users?.filter((u) => u.isBanned).length
            }`}
          </Text>

          <Text style={styles.text2}>
            Number of payments by transaction status
          </Text>

          <PieChart
            data={[
              {
                name: "Succeeded",
                count: payments.filter((p) => p.status === "SUCCEEDED").length,
                color: colors.midBlue,
                legendFontColor: colors.lightText,
                legendFontSize: 15,
              },
              {
                name: "Failed",
                count: payments.filter((p) => p.status === "FAILED").length,
                color: colors.red,
                legendFontColor: colors.lightText,
                legendFontSize: 15,
              },
              {
                name: "Pending",
                count: payments.filter((p) => p.status === "PENDING").length,
                color: colors.green,
                legendFontColor: colors.lightText,
                legendFontSize: 15,
              },
            ]}
            chartConfig={{
              color: () => colors.lightText,
              barPercentage: 0.5,
              useShadowColorFromDataset: false, // optional
            }}
            width={Dimensions.get("window").width}
            height={230}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />

          <Text style={styles.text1}>
            Invoices uploaded in the current year
          </Text>

          <LineChart
            style={{
              marginRight: 10,
            }}
            data={{
              labels: invoiceStats ? invoiceStats.labels : ["Jan"],
              datasets: [
                {
                  data: invoiceStats ? invoiceStats.data : [0],
                  color: () => colors.midBlue,
                  strokeWidth: 2,
                },
              ],
            }}
            fromZero
            width={Dimensions.get("window").width}
            height={250}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              color: () => colors.text,
              barPercentage: 1,
              useShadowColorFromDataset: false,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
