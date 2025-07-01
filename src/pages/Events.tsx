import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  cover_image: string | null;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (!error && data) {
        setEvents(data as Event[]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="font-[Inter] min-h-screen px-4 py-20 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beautifully designed moments waiting to be experienced.
          </p>
        </header>

        {/* Event Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              key={event.id}
            >
              <Link
                to={`/events/${event.id}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                aria-label={`View details for ${event.title}`}
              >
                {/* Cover Image */}
                {event.cover_image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={event.cover_image}
                      alt={`Cover of ${event.title}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <span className="absolute bottom-4 left-4 bg-white/90 text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full z-20 shadow-sm backdrop-blur-sm">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 mb-1">
                    {event.title}
                  </h2>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}
