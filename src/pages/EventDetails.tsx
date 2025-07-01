// src/pages/EventDetails.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  cover_image: string | null;
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setEvent(data as Event);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {event.cover_image && (
        <img
          src={event.cover_image}
          alt="Event Cover"
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        {new Date(event.date).toLocaleString()}
      </p>
      <p className="mb-4 text-gray-800">{event.description}</p>
      <p className="italic text-sm text-gray-600">📍 {event.location}</p>
    </div>
  );
}
