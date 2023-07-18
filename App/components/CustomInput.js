import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

// constants
import colors from "../constants/colors";

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3 * StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: colors.border,
  },
  iconContainer: {
    padding: 12,
    borderRightColor: colors.border,
    borderRightWidth: 3 * StyleSheet.hairlineWidth,
    backgroundColor: colors.iconBackground,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  input: {
    flex: 1,
    padding: 12,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    fontSize: 18,
    backgroundColor: colors.lightWhite,
  },
});

export const CustomInput = ({
  icon,
  placeholder,
  value,
  onTextChange,
  keyboardType = "default",
  autoCapitalize = "words",
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconContainer}>{icon}</View>

      <TextInput
        value={value}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={onTextChange}
        style={styles.input}
        placeholder={placeholder}
      />
    </View>
  );
};
