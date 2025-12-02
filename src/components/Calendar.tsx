import React, { useEffect, useState } from "react";
import { CalendarEntry } from "../types";
import AddEntryModal from "./AddEntryModal";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const dates: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let i = 1; i <= daysInMonth; i++) dates.push(i);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    fetch("http://localhost:3000/api/calendar", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: CalendarEntry[]) => setEntries(data))
      .catch((err) => console.error(err));
  };

  const hasEntry = (day: number | null): boolean => {
    if (!day) return false;
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return entries.some((entry) => entry.date.startsWith(dateStr));
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;

    const clickedDate = new Date(year, month, day);
    const dayOfWeek = clickedDate.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return; // Disable click for weekends
    }

    setSelectedDate(clickedDate);
  };

  const handleSaveEntry = (status: string) => {
    if (!selectedDate) return;

    if (existingEntry?.id) {
      fetch("http://localhost:3000/api/calendar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingEntry?.id,
          user_id: "550e8400-e29b-41d4-a716-446655440000",
          date: selectedDate.toLocaleDateString(),
          status,
          entry_type: "Office Attendance",
        }),
      })
        .then(() => {
          fetchEntries();
          setSelectedDate(null);
        })
        .catch((err) => console.error(err));
    } else {
      fetch("http://localhost:3000/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "550e8400-e29b-41d4-a716-446655440000",
          date: selectedDate.toLocaleDateString(),
          status,
          entry_type: "Office Attendance",
        }),
      })
        .then(() => {
          fetchEntries();
          setSelectedDate(null);
        })
        .catch((err) => console.error(err));
    }
  };

  const existingEntry = selectedDate
    ? entries.find((e) =>
        e.date.startsWith(selectedDate.toISOString().split("T")[0])
      )
    : null;

  const handleDeleteEntry = async () => {
    if (!existingEntry) return;

    await fetch("http://localhost:3000/api/calendar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: existingEntry.id }),
    });

    fetchEntries(); // refresh after delete
    setSelectedDate(null);
  };

  const getEntryColor = (day: number | null): string => {
    if (!day) return "bg-white";

    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    const entry = entries.find((e) => e.date.startsWith(dateStr));

    if (!entry) return "bg-white";

    // Color based on status or entry_type
    switch (entry.status) {
      case "onsite":
        return "bg-blue-400 text-white"; // Onsite = Green
      case "remote":
        return "bg-green-400 text-white"; // Remote = Yellow
      default:
        return "bg-gray-300"; // Default color
    }
  };

  return (
    <div className="p-6 w-1/2 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded">
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {dates.map((date, idx) => (
          <div
            key={idx}
            onClick={() => handleDayClick(date)}
            className={`h-16 flex items-center justify-center border rounded cursor-pointer
    ${date ? "hover:bg-blue-100" : ""}
    ${getEntryColor(date)}
    ${
      date &&
      (new Date(year, month, date).getDay() === 0 ||
        new Date(year, month, date).getDay() === 6)
        ? "bg-gray-400 cursor-not-allowed"
        : ""
    }
  `}
          >
            {date || ""}
          </div>
        ))}
      </div>

      {selectedDate && (
        <AddEntryModal
          selectedDate={selectedDate}
          existingEntry={existingEntry}
          onClose={() => setSelectedDate(null)}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />
      )}

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span>Onsite</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Remote</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Weekend (Disabled)</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
