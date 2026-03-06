import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Login Screen (Home) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Main Tab App */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Other Modals/Screens */}
      <Stack.Screen name="scan" options={{ title: "Scan Receipt", headerBackTitle: "Back" }} />
      <Stack.Screen name="category" options={{ title: "Category" }} />
    </Stack>
  );
}