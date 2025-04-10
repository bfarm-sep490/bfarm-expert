import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Card } from "antd";

const localizer = momentLocalizer(moment);
type FarmerScheduleComponentProps = {
  events: {
    id: number;
    title: string;
    start: Date;
    end: Date;
    type: "Chăm sóc" | "Thu hoạch" | "Đóng gói" | "Kiểm định";
    status: "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete";
  }[];
  isLoading: boolean;
  start_date: Date;
  end_date: Date;
  farmer?: any;
};
export const FarmerScheduleComponent = ({
  farmer,
  end_date,
  events,
  isLoading,
  start_date,
}: FarmerScheduleComponentProps) => {
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(start_date);

  return (
    <Card title={"📅 Lịch nông dân " + farmer?.name} loading={isLoading}>
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          view={view as View}
          date={currentDate}
          onView={(newView) => {
            setView(newView);
          }}
          onNavigate={(newDate) => {
            setCurrentDate(newDate);
          }}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          style={{ height: 800 }}
          eventPropGetter={(event, start, end, isSelected) => {
            return {
              style: {
                backgroundColor:
                  event.status === "Pending"
                    ? "orange"
                    : event?.status === "Complete"
                      ? "green"
                      : event?.status === "Ongoing"
                        ? "blue"
                        : event?.status === "Cancel"
                          ? "red"
                          : "gray",
                color: "white",
                fontWeight: "bold",
              },
            };
          }}
        />
      </div>
    </Card>
  );
};
