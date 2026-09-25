import { MaterialSymbol } from '@/components/material-symbol';
import {
  destinationForPath,
  destinations,
  isDestinationActive,
} from '@/constants/navigation';
import {
  layout,
  motionStyle,
  navigationLayout,
  shape,
  useAppTheme,
} from '@/constants/theme';
import { usePathname, useRouter } from 'expo-router';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Appbar, Searchbar, Text, TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ShellSearchValue {
  query: string;
  setQuery: (query: string) => void;
}

const ShellSearchContext = createContext<ShellSearchValue | null>(null);

export function useShellSearch(): ShellSearchValue {
  const value = useContext(ShellSearchContext);
  if (!value) {
    throw new Error('useShellSearch must be used within <AppShell>');
  }
  return value;
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, scheme, setChoice } = useAppTheme();
  const [query, setQuery] = useState('');

  const navLayout = navigationLayout(width);
  const destination = destinationForPath(pathname);
  const showSideNav = navLayout !== 'bar';

  const openDestination = (href: (typeof destinations)[number]['href']) => {
    if (!isDestinationActive(pathname, href)) {
      router.push(href);
    }
  };

  const onChangeQuery = (value: string) => {
    setQuery(value);
    if (pathname !== '/' && pathname !== '/index') {
      router.push('/');
    }
  };

  return (
    <ShellSearchContext.Provider value={{ query, setQuery }}>
      <View style={{ flex: 1, backgroundColor: colors.surface, ...motionStyle('background-color') }}>
        <Appbar.Header
          mode={navLayout === 'bar' ? 'center-aligned' : 'small'}
          elevated={false}
          style={{ backgroundColor: colors.surface, ...motionStyle('background-color') }}
          statusBarHeight={insets.top}
        >
          <Appbar.Content title={destination.title} />
          <Appbar.Action
            icon={scheme === 'dark' ? 'white-balance-sunny' : 'weather-night'}
            accessibilityLabel={
              scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            onPress={() => setChoice(scheme === 'dark' ? 'light' : 'dark')}
          />
        </Appbar.Header>

        <View
          style={{
            paddingHorizontal: navLayout === 'bar' ? 16 : 24,
            paddingBottom: 12,
            backgroundColor: colors.surface,
          }}
        >
          <Searchbar
            placeholder="Search currency pairs"
            value={query}
            onChangeText={onChangeQuery}
            elevation={0}
            mode="bar"
            iconColor={colors.onSurfaceVariant}
            style={{
              borderRadius: shape.full,
              backgroundColor: colors.surfaceContainerHigh,
              boxShadow: 'none',
            }}
            inputStyle={{ color: colors.onSurface }}
          />
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          {showSideNav ? (
            <SideNav
              variant={navLayout}
              pathname={pathname}
              onNavigate={openDestination}
            />
          ) : null}
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surfaceContainerLow,
              borderTopLeftRadius: showSideNav ? shape.extraLarge : shape.none,
              borderTopRightRadius: showSideNav ? shape.extraLarge : shape.none,
              overflow: 'hidden',
              ...motionStyle('background-color'),
            }}
          >
            {children}
          </View>
        </View>

        {navLayout === 'bar' ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.outlineVariant,
              paddingBottom: insets.bottom,
            }}
          >
            <View style={{ height: layout.navBarHeight, flexDirection: 'row' }}>
              {destinations.map((item) => {
                const active = isDestinationActive(pathname, item.href);
                return (
                  <TouchableRipple
                    key={item.label}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={item.label}
                    onPress={() => openDestination(item.href)}
                    style={{ flex: 1 }}
                  >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <View
                        style={{
                          width: 64,
                          height: 32,
                          borderRadius: shape.full,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: active ? colors.secondaryContainer : 'transparent',
                        }}
                      >
                        <MaterialSymbol
                          name={item.symbol}
                          color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant}
                        />
                      </View>
                      <Text
                        variant="labelMedium"
                        numberOfLines={1}
                        style={{ color: active ? colors.onSurface : colors.onSurfaceVariant }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </TouchableRipple>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    </ShellSearchContext.Provider>
  );
}

function SideNav({
  variant,
  pathname,
  onNavigate,
}: {
  variant: 'rail' | 'drawer';
  pathname: string;
  onNavigate: (href: (typeof destinations)[number]['href']) => void;
}) {
  const { colors } = useAppTheme();
  const isDrawer = variant === 'drawer';

  return (
    <View
      accessibilityRole="tablist"
      style={{
        width: isDrawer ? layout.drawerWidth : layout.railWidth,
        backgroundColor: colors.surface,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 4,
        ...motionStyle('width, background-color'),
      }}
    >
      {isDrawer ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 28,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: shape.medium,
              backgroundColor: colors.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialSymbol name="currency_exchange" color={colors.onPrimaryContainer} />
          </View>
          <Text variant="titleMedium" style={{ color: colors.onSurface }}>
            Millennial FX
          </Text>
        </View>
      ) : (
        <View style={{ alignItems: 'center', paddingBottom: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: shape.medium,
              backgroundColor: colors.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialSymbol name="currency_exchange" color={colors.onPrimaryContainer} />
          </View>
        </View>
      )}

      {destinations.map((item) => {
        const active = isDestinationActive(pathname, item.href);
        const iconColor = active ? colors.onSecondaryContainer : colors.onSurfaceVariant;

        if (!isDrawer) {
          return (
            <TouchableRipple
              key={item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
              onPress={() => onNavigate(item.href)}
              style={{ alignItems: 'center', paddingVertical: 8 }}
            >
              <View style={{ alignItems: 'center', gap: 4 }}>
                <View
                  style={{
                    width: 56,
                    height: 32,
                    borderRadius: shape.full,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? colors.secondaryContainer : 'transparent',
                  }}
                >
                  <MaterialSymbol name={item.symbol} color={iconColor} />
                </View>
                <Text
                  variant="labelMedium"
                  numberOfLines={1}
                  style={{ color: active ? colors.onSurface : colors.onSurfaceVariant }}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableRipple>
          );
        }

        return (
          <TouchableRipple
            key={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            borderless
            onPress={() => onNavigate(item.href)}
            style={{
              marginHorizontal: 12,
              borderRadius: shape.full,
              backgroundColor: active ? colors.secondaryContainer : 'transparent',
            }}
          >
            <View
              style={{
                minHeight: 56,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
              }}
            >
              <MaterialSymbol name={item.symbol} color={iconColor} />
              <Text variant="labelLarge" style={{ color: iconColor }}>
                {item.label}
              </Text>
            </View>
          </TouchableRipple>
        );
      })}
    </View>
  );
}
