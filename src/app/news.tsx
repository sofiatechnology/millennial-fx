import { useShellSearch } from '@/components/app-shell';
import { outlinedSurfaceStyle, shape, useAppTheme } from '@/constants/theme';
import { useForexNews } from '@/hooks/use-forex-news';
import type { ForexEvent, NewsStory } from '@/utils/forex-news';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Text } from 'react-native-paper';

const IMPACTS = ['All', 'High', 'Medium', 'Low', 'Holiday'] as const;
type ImpactFilter = (typeof IMPACTS)[number];

const IMPACT_COLOR: Record<string, string> = {
  High: '#D32F2F',
  Medium: '#EF6C00',
  Low: '#F9A825',
  Holiday: '#757575',
};

const CURRENCY_FLAG: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  NZD: '🇳🇿',
  CNY: '🇨🇳',
};

export default function NewsScreen() {
  const { colors } = useAppTheme();
  const { query } = useShellSearch();
  const {
    events,
    stories,
    storiesError,
    storiesLoading,
    loadedAt,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useForexNews();
  const [impact, setImpact] = useState<ImpactFilter>('All');

  const visible = useMemo(
    () => events.filter((event) => matchesFilters(event, impact, query)),
    [events, impact, query],
  );
  const visibleStories = useMemo(
    () => (stories ?? []).filter((story) => matchesStory(story, query)),
    [query, stories],
  );
  const groups = useMemo(() => groupByDay(visible), [visible]);

  return (
    <>
      <Stack.Screen options={{ title: 'News' }} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
      >
        <View style={{ gap: 4 }}>
          <Text variant="bodyLarge" selectable style={{ color: colors.onSurfaceVariant }}>
            Latest stories and this week’s economic calendar from Forex Factory.
            High-impact events are the ones most likely to move a pair.
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => Linking.openURL('https://www.forexfactory.com/calendar')}
            textColor={colors.primary}
            style={{ alignSelf: 'flex-start' }}
          >
            Open on Forex Factory
          </Button>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {IMPACTS.map((option) => {
            const selected = option === impact;
            return (
              <Chip
                key={option}
                compact
                mode={selected ? 'flat' : 'outlined'}
                selected={selected}
                showSelectedOverlay
                onPress={() => setImpact(option)}
                style={{
                  borderRadius: shape.full,
                  backgroundColor: selected
                    ? colors.secondaryContainer
                    : colors.surfaceContainerLowest,
                }}
                textStyle={{
                  color: selected ? colors.onSecondaryContainer : colors.onSurfaceVariant,
                }}
              >
                {option}
              </Chip>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <ActivityIndicator />
          </View>
        ) : null}

        {error ? (
          <View style={{ gap: 12, ...outlinedSurfaceStyle(colors), padding: 16 }}>
            <Text variant="bodyMedium" selectable style={{ color: colors.error }}>
              {error}
            </Text>
            <Button mode="contained-tonal" onPress={refresh} style={{ alignSelf: 'flex-start' }}>
              Try again
            </Button>
          </View>
        ) : null}

        {!isLoading && !error && groups.length === 0 ? (
          <Text variant="bodyMedium" selectable style={{ color: colors.onSurfaceVariant }}>
            {query.trim()
              ? `No events match “${query.trim()}”.`
              : 'No events for this filter.'}
          </Text>
        ) : null}

        <View style={{ gap: 8 }}>
          <Text variant="titleSmall" selectable style={{ color: colors.onSurfaceVariant }}>
            Latest stories
          </Text>
          {storiesLoading ? <ActivityIndicator color={colors.primary} /> : null}
          {storiesError ? (
            <Text variant="bodyMedium" selectable style={{ color: colors.error }}>
              {storiesError}
            </Text>
          ) : null}
          {visibleStories.map((story) => (
            <StoryRow key={story.id} story={story} />
          ))}
        </View>

        {groups.map((group) => (
          <View key={group.label} style={{ gap: 8 }}>
            <Text variant="titleSmall" selectable style={{ color: colors.onSurfaceVariant }}>
              {group.label}
            </Text>
            <View style={{ ...outlinedSurfaceStyle(colors), overflow: 'hidden' }}>
              {group.events.map((event, index) => (
                <EventRow
                  key={`${event.date}-${event.title}-${event.country}`}
                  event={event}
                  loadedAt={loadedAt}
                  showDivider={index > 0}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

function EventRow({
  event,
  loadedAt,
  showDivider,
}: {
  event: ForexEvent;
  loadedAt: number | null;
  showDivider: boolean;
}) {
  const { colors } = useAppTheme();
  const when = new Date(event.date);
  const isPast = loadedAt !== null && when.getTime() < loadedAt;
  const titleColor = isPast ? colors.onSurfaceVariant : colors.onSurface;
  const impactColor = IMPACT_COLOR[event.impact] ?? colors.outline;
  const details = [
    event.forecast ? `Forecast ${event.forecast}` : '',
    event.previous ? `Previous ${event.previous}` : '',
  ].filter(Boolean);

  return (
    <View
      style={{
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: showDivider ? 1 : 0,
        borderTopColor: colors.outlineVariant,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text
          variant="labelLarge"
          selectable
          style={{
            width: 72,
            color: titleColor,
            fontVariant: ['tabular-nums'],
          }}
        >
          {when.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </Text>
        <Text variant="titleSmall" selectable style={{ color: titleColor }}>
          {`${CURRENCY_FLAG[event.country] ?? ''} ${event.country}`.trim()}
        </Text>
        <View style={{ flex: 1 }} />
        <View
          style={{
            borderRadius: shape.full,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: impactColor,
          }}
        >
          <Text variant="labelMedium" selectable style={{ color: '#FFFFFF' }}>
            {event.impact}
          </Text>
        </View>
      </View>
      <Text variant="bodyLarge" selectable style={{ color: titleColor }}>
        {event.title}
      </Text>
      {details.length > 0 ? (
        <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
          {details.join('  ·  ')}
        </Text>
      ) : null}
    </View>
  );
}

function StoryRow({ story }: { story: NewsStory }) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 6, padding: 16, ...outlinedSurfaceStyle(colors) }}>
      <Text
        variant="titleSmall"
        selectable
        style={{ color: colors.primary }}
        onPress={() => {
          void Linking.openURL(story.url);
        }}
      >
        {story.title}
      </Text>
      <Text variant="bodySmall" selectable style={{ color: colors.onSurfaceVariant }}>
        {[story.source, story.impact, `${story.comments} comments`].filter(Boolean).join('  ·  ')}
      </Text>
    </View>
  );
}

function matchesStory(story: NewsStory, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${story.title} ${story.source} ${story.preview}`.toLowerCase().includes(needle);
}

function matchesFilters(event: ForexEvent, impact: ImpactFilter, query: string): boolean {
  if (impact !== 'All' && event.impact !== impact) return false;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = `${event.title} ${event.country} ${event.impact}`.toLowerCase();
  if (haystack.includes(needle)) return true;

  const codes = needle.split(/[^a-z]+/).filter((part) => part.length >= 2);
  return codes.some((code) => haystack.includes(code));
}

function groupByDay(events: ForexEvent[]): { label: string; events: ForexEvent[] }[] {
  const groups: { label: string; events: ForexEvent[] }[] = [];

  for (const event of events) {
    const label = new Date(event.date).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const current = groups[groups.length - 1];
    if (current?.label === label) {
      current.events.push(event);
    } else {
      groups.push({ label, events: [event] });
    }
  }

  return groups;
}
