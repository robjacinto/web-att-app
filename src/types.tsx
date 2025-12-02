
export interface CalendarEntry {
  id: number;
  user_id: string;
  date: string; // ISO date string from API
  status: string; // e.g., "onsite", "remote"
  entry_type: string; // e.g., "Office Attendance"
  created_at: string;
  updated_at: string;
}
