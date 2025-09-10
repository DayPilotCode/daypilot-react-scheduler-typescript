import React, { useEffect, useRef, useState } from "react";
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";

const Scheduler: React.FC = () => {
    const schedulerRef = useRef<DayPilotScheduler>(null);

    const [resources, setResources] = useState<DayPilot.ResourceData[]>([]);
    const [events, setEvents] = useState<DayPilot.EventData[]>([]);
    const [startDate, setStartDate] = useState<DayPilot.Date>(new DayPilot.Date("2026-01-01"));

    const onEventMoved = (args: DayPilot.SchedulerEventMovedArgs) => {
        console.log("Event moved: ", args);
    };

    const onEventResized = (args: DayPilot.SchedulerEventResizedArgs) => {
        console.log("Event resized: ", args);
    };

    const onTimeRangeSelected = async (args: DayPilot.SchedulerTimeRangeSelectedArgs) => {
        const dp = schedulerRef.current!.control;
        const modal = await DayPilot.Modal.prompt("New reservation:", "Reservation");
        dp.clearSelection();
        if (modal.canceled) {
            return;
        }
        schedulerRef.current?.control.events.add({ id: DayPilot.guid(), text: modal.result!, start: args.start, end: args.end, resource: args.resource });
    };

    const onEventClicked = async (args: DayPilot.SchedulerEventClickedArgs) => {
        const dp = schedulerRef.current!.control;
        const modal = await DayPilot.Modal.prompt("Edit reservation:", args.e.data.text);
        dp.clearSelection();
        if (modal.canceled) {
            return;
        }
        args.e.data.text = modal.result;
        schedulerRef.current!.control.events.update(args.e);
    };

    // Load resources/events + initial scroll
    useEffect(() => {
        setResources([
            { name: "Location A", id: "A" },
            { name: "Location B", id: "B" },
            { name: "Location C", id: "C" },
            { name: "Location D", id: "D" },
            { name: "Location E", id: "E" },
            { name: "Location F", id: "F" },
        ]);

        setEvents([
            {
                id: 1,
                text: "Reservation 1",
                start: "2026-11-03T00:00:00",
                end: "2026-11-09T00:00:00",
                resource: "A",
                barColor: "#3d85c6",
            },
            {
                id: 2,
                text: "Reservation 2",
                start: "2026-11-04T00:00:00",
                end: "2026-11-08T00:00:00",
                resource: "C",
                barColor: "#38761d",
            },
            {
                id: 3,
                text: "Reservation 3",
                start: "2026-11-02T00:00:00",
                end: "2026-11-05T00:00:00",
                resource: "D",
                barColor: "#f1c232",
            },
            {
                id: 4,
                text: "Reservation 4",
                start: "2026-11-03T00:00:00",
                end: "2026-11-06T00:00:00",
                resource: "E",
                barColor: "#cc0000",
            },
        ]);

        schedulerRef.current?.control.scrollTo("2026-11-01");
    }, []);

    return (
        <div>
            <DayPilotScheduler
                ref={schedulerRef}
                startDate={startDate}
                days={startDate.daysInYear()}
                scale={"Day"}
                eventHeight={50}
                timeHeaders={[
                    { groupBy: "Month" },
                    { groupBy: "Day", format: "d" },
                ]}
                cellWidth={50}
                resources={resources}
                events={events}
                onEventMoved={onEventMoved}
                onEventResized={onEventResized}
                onTimeRangeSelected={onTimeRangeSelected}
                onEventClicked={onEventClicked}
            />
        </div>
    );
};

export default Scheduler;
