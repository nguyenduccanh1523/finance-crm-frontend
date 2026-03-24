/**
 * RRULE Utility Functions
 * Support creating and analyzing RRULE for recurring transactions
 */

export interface RRuleTemplate {
  id: string;
  label: string;
  category: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  rrule: string;
  description: string;
}

export const RRULE_TEMPLATES: RRuleTemplate[] = [
  // DAILY
  {
    id: "daily_every",
    label: "Every day",
    category: "daily",
    rrule: "FREQ=DAILY",
    description: "Daily allowance",
  },
  {
    id: "daily_biday",
    label: "Every 2 days",
    category: "daily",
    rrule: "FREQ=DAILY;INTERVAL=2",
    description: "Check-in bonus every 2 days",
  },
  {
    id: "daily_weekdays",
    label: "Weekdays (Mon-Fri)",
    category: "daily",
    rrule: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
    description: "Weekday allowance",
  },
  {
    id: "daily_weekends",
    label: "Weekends (Sat-Sun)",
    category: "daily",
    rrule: "FREQ=DAILY;BYDAY=SA,SU",
    description: "Weekend bonus",
  },
  {
    id: "daily_30days",
    label: "Daily (30 times)",
    category: "daily",
    rrule: "FREQ=DAILY;COUNT=30",
    description: "30-day promotion",
  },

  // WEEKLY
  {
    id: "weekly_every",
    label: "Every week",
    category: "weekly",
    rrule: "FREQ=WEEKLY",
    description: "Weekly salary",
  },
  {
    id: "weekly_biweekly",
    label: "Every 2 weeks",
    category: "weekly",
    rrule: "FREQ=WEEKLY;INTERVAL=2",
    description: "Bi-weekly payment",
  },
  {
    id: "weekly_mwf",
    label: "Mon, Wed, Fri",
    category: "weekly",
    rrule: "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    description: "3 times per week",
  },
  {
    id: "weekly_monday",
    label: "Every Monday",
    category: "weekly",
    rrule: "FREQ=WEEKLY;BYDAY=MO",
    description: "Weekly meeting allocation",
  },
  {
    id: "weekly_saturday",
    label: "Every Saturday",
    category: "weekly",
    rrule: "FREQ=WEEKLY;BYDAY=SA",
    description: "Weekend bonus",
  },
  {
    id: "weekly_biweekly_mf",
    label: "Every 2 weeks (Mon & Fri)",
    category: "weekly",
    rrule: "FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,FR",
    description: "Bi-weekly (2 days/week)",
  },

  // MONTHLY
  {
    id: "monthly_every",
    label: "Same day each month",
    category: "monthly",
    rrule: "FREQ=MONTHLY",
    description: "Monthly salary",
  },
  {
    id: "monthly_1st",
    label: "1st of month",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=1",
    description: "Rent payment",
  },
  {
    id: "monthly_15th",
    label: "15th of month",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=15",
    description: "Mid-month bonus",
  },
  {
    id: "monthly_last",
    label: "Last day of month",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=-1",
    description: "Utilities payment",
  },
  {
    id: "monthly_1st_15th",
    label: "1st & 15th",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=1,15",
    description: "Bi-monthly",
  },
  {
    id: "monthly_1_10_20",
    label: "1st, 10th, 20th",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=1,10,20",
    description: "3 times per month",
  },
  {
    id: "monthly_5_before_end",
    label: "5 days before month end",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYMONTHDAY=-5",
    description: "Pre-month payment",
  },
  {
    id: "monthly_first_monday",
    label: "First Monday",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYDAY=1MO",
    description: "First Monday bonus",
  },
  {
    id: "monthly_last_friday",
    label: "Last Friday",
    category: "monthly",
    rrule: "FREQ=MONTHLY;BYDAY=-1FR",
    description: "Last Friday payout",
  },
  {
    id: "monthly_bimonthly",
    label: "Every 2 months",
    category: "monthly",
    rrule: "FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=1",
    description: "Bi-monthly (Feb, Apr, Jun...)",
  },

  // QUARTERLY
  {
    id: "quarterly_3month",
    label: "Every 3 months",
    category: "quarterly",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1",
    description: "Quarterly bonus",
  },
  {
    id: "quarterly_3month_15",
    label: "Every 3 months (15th)",
    category: "quarterly",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=15",
    description: "Quarterly mid-month",
  },
  {
    id: "quarterly_3month_end",
    label: "Every 3 months (end)",
    category: "quarterly",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=-1",
    description: "Quarterly end payout",
  },

  // YEARLY
  {
    id: "yearly_every",
    label: "Same day annually",
    category: "yearly",
    rrule: "FREQ=YEARLY",
    description: "Anniversary bonus",
  },
  {
    id: "yearly_christmas",
    label: "December 25th",
    category: "yearly",
    rrule: "FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25",
    description: "Christmas gift",
  },
  {
    id: "yearly_midyear",
    label: "July 1st",
    category: "yearly",
    rrule: "FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=1",
    description: "Mid-year bonus",
  },
  {
    id: "yearly_semiannual",
    label: "Jan 1st & Jul 1st",
    category: "yearly",
    rrule: "FREQ=YEARLY;BYMONTH=1,7;BYMONTHDAY=1",
    description: "Semi-annual",
  },
  {
    id: "yearly_first_monday",
    label: "First Monday annually",
    category: "yearly",
    rrule: "FREQ=YEARLY;BYDAY=1MO",
    description: "Yearly Monday bonus",
  },
];

export function getTemplatesByCategory(category: string): RRuleTemplate[] {
  return RRULE_TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string): RRuleTemplate | undefined {
  return RRULE_TEMPLATES.find((t) => t.id === id);
}

export function parseRRule(rrule: string): Record<string, string> {
  const parts: Record<string, string> = {};
  const pairs = rrule.split(";");

  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      parts[key] = value;
    }
  });

  return parts;
}

export function formatNextRunAtDisplay(nextRunAt: string): string {
  const date = new Date(nextRunAt);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getFrequencyLabel(rrule: string): string {
  const parts = parseRRule(rrule);
  const freq = parts.FREQ;

  if (freq === "DAILY") return "Daily";
  if (freq === "WEEKLY") return "Weekly";
  if (freq === "MONTHLY") return "Monthly";
  if (freq === "QUARTERLY") return "Quarterly";
  if (freq === "YEARLY") return "Yearly";

  return "Unknown";
}

/**
 * Get detailed description of RRULE in English
 */
export function getDetailedRRuleDescription(rrule: string): string {
  const parts = parseRRule(rrule);
  const template = RRULE_TEMPLATES.find((t) => t.rrule === rrule);

  if (template) {
    return template.description;
  }

  // Fallback: build description from parts
  let description = "";

  if (parts.FREQ === "DAILY") {
    if (parts.INTERVAL) {
      description = `Every ${parts.INTERVAL} days`;
    } else {
      description = "Every day";
    }
  } else if (parts.FREQ === "WEEKLY") {
    if (parts.INTERVAL) {
      description = `Every ${parts.INTERVAL} weeks`;
    } else {
      description = "Every week";
    }
  } else if (parts.FREQ === "MONTHLY") {
    if (parts.BYMONTHDAY) {
      description = `Day ${parts.BYMONTHDAY} of each month`;
    } else {
      description = "Every month";
    }
  } else if (parts.FREQ === "YEARLY") {
    description = "Every year";
  }

  if (parts.COUNT) {
    description += ` (${parts.COUNT} times)`;
  }
  if (parts.UNTIL) {
    description += ` (until ${parts.UNTIL})`;
  }

  return description;
}

export function buildCustomRRule(
  frequency: string,
  dayOfMonth?: number,
  daysOfWeek?: string[],
  interval?: number,
  count?: number,
  until?: string,
): string {
  let rrule = `FREQ=${frequency}`;

  if (interval && interval > 1) {
    rrule += `;INTERVAL=${interval}`;
  }

  if (dayOfMonth !== undefined && dayOfMonth !== 0) {
    rrule += `;BYMONTHDAY=${dayOfMonth}`;
  }

  if (daysOfWeek && daysOfWeek.length > 0) {
    rrule += `;BYDAY=${daysOfWeek.join(",")}`;
  }

  if (count && count > 0) {
    rrule += `;COUNT=${count}`;
  }

  if (until) {
    rrule += `;UNTIL=${until}`;
  }

  return rrule;
}
