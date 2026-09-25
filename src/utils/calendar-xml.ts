export interface CalendarEventJson {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
}

/** Turns the weekly XML export into the same objects as ff_calendar_thisweek.json. */
export function parseWeeklyCalendarXml(xml: string): CalendarEventJson[] {
  const events: CalendarEventJson[] = [];

  for (const block of xml.split(/<event\b[^>]*>/i).slice(1)) {
    const title = xmlValue(block, 'title');
    const country = xmlValue(block, 'country');
    const date = xmlValue(block, 'date');
    const time = xmlValue(block, 'time');
    if (!title || !country || !date) continue;

    const iso = utcClockToIso(date, time ?? '');
    if (!iso) continue;

    events.push({
      title,
      country,
      date: iso,
      impact: xmlValue(block, 'impact') || 'Low',
      forecast: xmlValue(block, 'forecast') ?? '',
      previous: xmlValue(block, 'previous') ?? '',
    });
  }

  return events;
}

function xmlValue(block: string, tag: string): string | null {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i'),
  );
  if (cdata) return decodeXml(cdata[1].trim());

  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (plain) return decodeXml(plain[1].trim());
  return '';
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * The weekly XML clock is UTC. 11:01pm in the file is the same instant as
 * 19:01-04:00 in the JSON export.
 */
function utcClockToIso(date: string, time: string): string | null {
  const dateMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(date.trim());
  if (!dateMatch) return null;

  const month = Number(dateMatch[1]);
  const day = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const clock = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(time.trim());
  let hour = 12;
  let minute = 0;
  if (clock) {
    hour = Number(clock[1]) % 12;
    if (clock[3].toLowerCase() === 'pm') hour += 12;
    minute = Number(clock[2]);
  }

  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString();
}
