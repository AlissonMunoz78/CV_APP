import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePickerField = ({
  label,
  value,
  onChange,
  error,
  placeholder = "Seleccionar fecha",
  disabled = false,
}: DatePickerFieldProps) => {
  const [show, setShow] = useState(false);

  const dateValue = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShow(false);

    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selected) {
      const formatted = selected.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      onChange(formatted);
      if (Platform.OS === "ios") setShow(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.button,
          error && styles.buttonError,
          disabled && styles.buttonDisabled,
        ]}
        onPress={() => !disabled && setShow(true)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {disabled ? "Actual" : value || placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={new Date()}
          locale="es-EC"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonError: {
    borderColor: "#e74c3c",
  },
  buttonDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  icon: {
    fontSize: 18,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 4,
  },
});