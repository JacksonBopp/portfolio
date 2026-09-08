"use client";

import { useState } from "react";
import MonthView from "@/components/calendar/MonthView";
import TodoList from "./TodoList";
import SleepingCat from "./SleepingCat";
import AccessLog from "./AccessLog";

export default function PrivateArea() {
  const [calendarRefreshSignal, setCalendarRefreshSignal] = useState(0);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SleepingCat />
        <TodoList onEventCreated={() => setCalendarRefreshSignal((n) => n + 1)} />
      </div>

      <MonthView refreshSignal={calendarRefreshSignal} />

      <AccessLog />
    </>
  );
}
