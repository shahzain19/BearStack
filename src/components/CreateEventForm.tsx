import { useState } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Optional User type
interface UserWithRole {
  id: string;
  role: string;
}


export default function CreateEventForm({ user }: { user: UserWithRole }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    if (!user || user.role !== "Admin") return;
    setLoading(true);

    let coverUrl = null;

    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("event-covers")
        .upload(fileName, coverFile);

      if (error) {
        console.error("Upload error", error);
        setLoading(false);
        return;
      }

      const { publicUrl } = supabase.storage
        .from("event-covers")
        .getPublicUrl(fileName);

      coverUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        location,
        cover_image: coverUrl,
        created_by: user.id,
      },
    ]);

    if (insertError) console.error("Insert error", insertError);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>
      <input
        className="input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea mt-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input mt-2"
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        className="input mt-2"
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        className="mt-2"
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
      />
      <button
        className="btn-primary mt-4 w-full"
        onClick={handleCreateEvent}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}
