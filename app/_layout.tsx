// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "@/template";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade", // 👈 امن و طبیعی
              gestureEnabled: true,
              fullScreenGestureEnabled: true, // 👈 swipe back مثل iOS
            }}
          />
        </AuthProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
