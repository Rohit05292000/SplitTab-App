// src/screens/profile/EditProfileScreen.tsx

import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../Redux/Store";
import { updateProfile, updateCurrency } from "../../Redux/authSlice";

import { Button } from "../../components/common/Button";
import { Currency, AvatarColor } from "../../types";
import { AVATAR_COLORS, CURRENCIES } from "../../utils/mockData";
import { EditProfileScreenProps } from "../../navigation/screenTypes";
import { SpinnerCard } from "../../components/common/SpinnerCard";


const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [currency, setCurrency] = useState<Currency>(
    user?.currency || "INR"
  );
  const [avatarColor, setAvatarColor] = useState<AvatarColor>(
    user?.avatarColor || "blue"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 if (!user) {
  return (
    <View style={styles.center}>
      <SpinnerCard text="Loading profile..." />
    </View>
  );
}

  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const validateForm = () => {
    if (!displayName.trim()) {
      setError("Display name cannot be empty");
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      dispatch(
        updateProfile({
          name: displayName.trim(),
          avatarColor,
        })
      );

      dispatch(updateCurrency(currency));

      navigation.goBack();
    } catch {
      setError("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>

        {/* ✅ FIXED: Touchable instead of Text */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* ✅ FIXED: keyboard dismiss */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholder="Your name"
              />
            </View>

            {/* Email */}
            <View style={styles.section}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.disabledText}>{user.email}</Text>
            </View>

            {/* Currency */}
            <View style={styles.section}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.row}>
                {CURRENCIES.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => setCurrency(curr)}
                    style={[
                      styles.option,
                      currency === curr && styles.selectedOption,
                    ]}
                  >
                    <Text>{curr}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Avatar */}
            <View style={styles.section}>
              <Text style={styles.label}>Avatar</Text>

              <View style={styles.avatarPreview}>
                <View
                  style={[styles.avatar, { backgroundColor: avatarColor }]}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              </View>

              <View style={styles.row}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setAvatarColor(color)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      avatarColor === color && styles.selectedColor,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Buttons */}
         {/* Buttons */}
<>
  {loading && (
    <View style={styles.overlay}>
      <SpinnerCard text="Saving..." />
    </View>
  )}

  <View style={styles.buttonContainer}>
    <Button onPress={handleSave} disabled={loading}>
      Save Changes
    </Button>

    <View style={{ height: 10 }} />

    <Button
      variant="secondary"
      onPress={() => navigation.goBack()}
    >
      Cancel
    </Button>
  </View>
</>


            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  closeButton: { fontSize: 20, color: "#999" },

  content: { flex: 1, padding: 16 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },

  label: { fontSize: 12, color: "#666", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },

  disabledText: {
    color: "#999",
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  selectedOption: {
    borderColor: "#2563EB",
    backgroundColor: "#DBEAFE",
  },

  avatarPreview: {
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
  },

  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: "#2563EB",
  },

  buttonContainer: {
    marginTop: 16,
  },

  errorText: {
    color: "red",
    marginBottom: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.2)",
  zIndex: 10,
},
});