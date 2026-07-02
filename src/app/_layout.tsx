import { ThemeProvider } from '@/constants/theme';
import MoreVert from "@expo/material-symbols/more_vert.xml";
import { Host, Icon, IconButton } from "@expo/ui/jetpack-compose";
import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Lot Size Calculator",
            headerRight: () => (
              <Host matchContents>
                <IconButton onClick={() => router.push("/about")}>
                  <Icon
                    source={MoreVert}
                    size={24}
                    contentDescription="More options to about screen"
                  />
                </IconButton>
              </Host>
            ),
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About Millennial FX",
            presentation: "modal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
