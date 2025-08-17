import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  console.log("Events are:", allEvents);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className="events-container">
            {/* Render all events */}
            {allEvents && allEvents.length > 0 ? (
              allEvents.map((event) => (
                <EventCard key={event._id} active={true} data={event} />
              ))
            ) : (
              <p>No events found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;