// src/pages/AdminEvents.tsx

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import {
  CalendarDays,
  FileImage,
  MapPin,
  Text,
  TextQuote,
  Sparkles,
} from "lucide-react";

export default function AdminEvents() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      setUserId(user.id);
      setRole(profile.role);
    };

    fetchUser();
  }, []);

  const handleCreateEvent = async () => {
    if (!userId || role !== "admin") return;

    setLoading(true);
    let coverUrl: string | null = null;

    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-covers")
        .upload(fileName, coverFile);

      if (uploadError) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-covers")
        .getPublicUrl(fileName);

      coverUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
        cover_image: coverUrl,
        created_by: userId,
      },
    ]);

    if (insertError) {
      alert("Event creation failed");
    } else {
      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCoverFile(null);
    }

    setLoading(false);
  };

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-medium">
        Access Denied — Admins only
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white/60 p-8 rounded-3xl backdrop-blur-xl border border-white/40">
        <h1 className="text-4xl font-extrabold font-serif text-center text-[#2d2d2d] mb-10 flex items-center justify-center gap-3">
          <Sparkles className="text-indigo-500" size={32} /> Create a Magical Event
        </h1>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <Text size={18} />
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autumn Book Gathering"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <TextQuote size={18} />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the event..."
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm transition"
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <CalendarDays size={18} />
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm transition"
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <MapPin size={18} />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Crystal Hall, Library"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm transition"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <FileImage size={18} />
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="block w-full px-5 py-3 rounded-xl border border-dashed border-gray-400 text-gray-700 bg-white hover:bg-indigo-50 transition"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleCreateEvent}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Creating Event..." : "✨ Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
