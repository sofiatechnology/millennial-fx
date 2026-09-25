import { parseWeeklyCalendarXml } from '@/utils/calendar-xml';

const FOREX_NEWS_FEED_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.json';

const FOREX_NEWS_XML_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';

const CACHE_MS = 60_000;

let cached: { savedAt: number; body: string } | null = null;

/**
 * Same-origin proxy for the public weekly calendar JSON.
 * The file does not send Access-Control-Allow-Origin, so the web app
 * cannot read it directly.
 */
export async function GET(): Promise<Response> {
  if (cached && Date.now() - cached.savedAt < CACHE_MS) {
    return json(cached.body);
  }

  try {
    const response = await fetch(FOREX_NEWS_FEED_URL, {
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const body = await response.text();
      if (!body.trimStart().startsWith('<')) {
        cached = { savedAt: Date.now(), body };
        return json(body);
      }
    }

    const xmlResponse = await fetch(FOREX_NEWS_XML_URL, {
      headers: { Accept: 'application/xml, text/xml' },
    });
    if (!xmlResponse.ok) {
      if (cached) return json(cached.body);
      return Response.json(
        { error: 'Forex Factory news is temporarily unavailable.' },
        { status: 502 },
      );
    }

    const events = parseWeeklyCalendarXml(await xmlResponse.text());
    if (events.length === 0) {
      if (cached) return json(cached.body);
      return Response.json(
        { error: 'Forex Factory news is temporarily unavailable.' },
        { status: 502 },
      );
    }

    const body = JSON.stringify(events);
    cached = { savedAt: Date.now(), body };
    return json(body);
  } catch {
    if (cached) return json(cached.body);
    return Response.json(
      { error: 'Forex Factory news is temporarily unavailable.' },
      { status: 502 },
    );
  }
}

function json(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
