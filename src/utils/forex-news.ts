import { Platform } from 'react-native';

import { parseWeeklyCalendarXml } from '@/utils/calendar-xml';

/**
 * Public Forex Factory calendar for the current week.
 * https://nfs.faireconomy.media/ff_calendar_thisweek.json
 *
 * The headline list on /news is loaded from
 * GET https://www.forexfactory.com/news/block/1
 * (category, display_format, display_items, sort_by, sort_period).
 * That route only answers browsers that already passed their Cloudflare
 * check, and its CORS header allows forexfactory.com. This JSON file is
 * the feed they publish for other apps.
 */
export const FOREX_NEWS_FEED_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.json';

const FOREX_NEWS_XML_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';

export interface ForexEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
}

export class ForexNewsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForexNewsError';
  }
}

export async function fetchForexNews(signal?: AbortSignal): Promise<ForexEvent[]> {
  if (Platform.OS === 'web') return readJsonEvents('/api/news', signal);

  try {
    return await readJsonEvents(FOREX_NEWS_FEED_URL, signal);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    return readXmlEvents(FOREX_NEWS_XML_URL, signal);
  }
}

async function readJsonEvents(url: string, signal?: AbortSignal): Promise<ForexEvent[]> {
  const body = await readBody(url, signal, 'application/json');
  let payload: unknown;
  try {
    payload = JSON.parse(body) as unknown;
  } catch {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }
  return normalizeEvents(payload);
}

async function readXmlEvents(url: string, signal?: AbortSignal): Promise<ForexEvent[]> {
  const body = await readBody(url, signal, 'application/xml, text/xml');
  const events = parseWeeklyCalendarXml(body);
  if (events.length === 0) {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }
  return events;
}

async function readBody(url: string, signal: AbortSignal | undefined, accept: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: accept } });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ForexNewsError('Network error. Check your connection and try again.');
  }

  const body = await response.text();
  const sample = body.trimStart().slice(0, 200).toLowerCase();
  if (!response.ok || sample.startsWith('<!doctype html') || sample.startsWith('<html')) {
    throw new ForexNewsError('Forex Factory news is temporarily unavailable.');
  }
  return body;
}

function normalizeEvents(payload: unknown): ForexEvent[] {
  if (!Array.isArray(payload)) {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }

  const events: ForexEvent[] = [];
  for (const value of payload) {
    if (!value || typeof value !== 'object') continue;
    const event = value as Record<string, unknown>;
    if (
      typeof event.title !== 'string' ||
      typeof event.country !== 'string' ||
      typeof event.date !== 'string' ||
      typeof event.impact !== 'string'
    ) {
      continue;
    }
    events.push({
      title: event.title,
      country: event.country,
      date: event.date,
      impact: event.impact,
      forecast: typeof event.forecast === 'string' ? event.forecast : '',
      previous: typeof event.previous === 'string' ? event.previous : '',
    });
  }

  if (events.length === 0) {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }
  return events;
}

export interface NewsStory {
  id: number;
  title: string;
  source: string;
  impact: string;
  comments: number;
  dateline: number;
  url: string;
  preview: string;
}

const NEWS_BLOCK_URL = 'https://www.forexfactory.com/news/block/1';
const STORY_QUERY =
  'category=0&display_format=stories&display_items=15&sort_by=latest&sort_period=24h';

/** Same JSON request the Forex Factory News page makes for its story list. */
export async function fetchNewsStories(signal?: AbortSignal): Promise<NewsStory[]> {
  const url =
    Platform.OS === 'web'
      ? `/api/news?feed=stories&${STORY_QUERY}`
      : `${NEWS_BLOCK_URL}?${STORY_QUERY}`;
  const body = await readBody(url, signal, 'application/json');
  return parseStories(body);
}

function parseStories(body: string): NewsStory[] {
  let payload: unknown;
  try {
    payload = JSON.parse(body) as unknown;
  } catch {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }

  if (!payload || typeof payload !== 'object' || !('items' in payload)) {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }

  const items = (payload as { items: unknown }).items;
  if (!Array.isArray(items)) {
    throw new ForexNewsError('Forex Factory returned an unexpected news format.');
  }

  const stories: NewsStory[] = [];
  for (const value of items) {
    if (!value || typeof value !== 'object') continue;
    const item = value as Record<string, unknown>;
    if (
      typeof item.id !== 'number' ||
      typeof item.title !== 'string' ||
      typeof item.url !== 'string'
    ) {
      continue;
    }

    stories.push({
      id: item.id,
      title: item.title,
      source: typeof item.source === 'string' ? item.source : '',
      impact: typeof item.impact === 'string' ? item.impact : '',
      comments: typeof item.comments === 'number' ? item.comments : 0,
      dateline: typeof item.dateline === 'number' ? item.dateline : 0,
      url: item.url.startsWith('http') ? item.url : `https://www.forexfactory.com${item.url}`,
      preview: typeof item.preview === 'string' ? stripHtml(item.preview) : '',
    });
  }

  return stories;
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#x91;|&#x92;/gi, "'")
    .replace(/&#x93;|&#x94;/gi, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}
