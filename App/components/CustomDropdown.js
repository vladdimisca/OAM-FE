import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import colors from "../constants/colors";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  dropdownBtnStyle: {
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    width: screen.width * 0.86,
    backgroundColor: colors.offWhite,
    height: 50,
    justifyContent: "center",
  },
  dropdownBtnTxtStyle: {
    color: colors.text,
    textAlign: "left",
    fontSize: 15,
  },
  dropdownDropdownStyle: { backgroundColor: colors.border, borderRadius: 3 },
  dropdownRowStyle: {
    backgroundColor: colors.lightWhite,
    borderBottomColor: colors.border,
  },
  dropdownRowTxtStyle: {
    color: colors.lightText,
    textAlign: "left",
    fontSize: 15,
  },
  dropdownSelectedRowStyle: {
    backgroundColor: colors.iconBackground,
  },
  dropdownSelectedRowTxtStyle: {
    color: colors.text,
    fontSize: 16,
  },
});

export const CustomDropdown = ({
  data,
  onSelect,
  defaultButtonText,
  buttonTextAfterSelection,
  rowTextForSelection,
}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      defaultButtonText={defaultButtonText}
      buttonTextAfterSelection={buttonTextAfterSelection}
      rowTextForSelection={rowTextForSelection}
      buttonStyle={styles.dropdownBtnStyle}
      buttonTextStyle={styles.dropdownBtnTxtStyle}
      renderDropdownIcon={(isOpened) => {
        return (
          <FontAwesome
            name={isOpened ? "chevron-up" : "chevron-down"}
            color={colors.lightText}
            size={18}
          />
        );
      }}
      dropdownIconPosition="right"
      dropdownStyle={styles.dropdownDropdownStyle}
      rowStyle={styles.dropdownRowStyle}
      rowTextStyle={styles.dropdownRowTxtStyle}
      selectedRowStyle={styles.dropdownSelectedRowStyle}
      selectedRowTextStyle={styles.dropdownSelectedRowTxtStyle}
    />
  );
};
