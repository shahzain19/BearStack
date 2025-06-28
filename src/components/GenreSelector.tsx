import { useState, useMemo } from "react";

const GENRE_LIST = [
  "Fantasy",
  "Mystery",
  "Science Fiction",
  "Romance",
  "Horror",
  "Thriller",
  "Historical Fiction",
  "Adventure",
  "Drama",
  "Cozy Mystery",
  "Slice of Life",
  "Young Adult",
  "Non-fiction",
  "Biography",
  "Self-help",
  "Memoir",
  "Poetry",
  "Spirituality",
  "Philosophy",
  "Crime",
  "Suspense",
  "Dystopian",
  "Apocalyptic",
  "Cyberpunk",
  "Steampunk",
  "Fairy Tale",
  "Mythology",
  "Folklore",
  "Magical Realism",
  "LitRPG",
  "Paranormal",
  "Supernatural",
  "Contemporary",
  "Satire",
  "Humor",
  "Coming of Age",
  "Political",
  "Military",
  "Western",
  "Historical Romance",
  "Urban Fantasy",
  "Psychological Thriller",
  "True Crime",
  "Educational",
  "How-to",
  "Health & Wellness",
  "Parenting",
  "Technology",
  "Business",
  "Productivity",
  "Faith-Based",
  "Islamic Fiction",
];

const genreColors: Record<string, string> = {
  Fantasy: "hover:bg-purple-100 hover:text-purple-700",
  Mystery: "hover:bg-gray-100 hover:text-gray-700",
  "Science Fiction": "hover:bg-blue-100 hover:text-blue-700",
  Romance: "hover:bg-pink-100 hover:text-pink-700",
  Horror: "hover:bg-red-100 hover:text-red-700",
  Thriller: "hover:bg-yellow-100 hover:text-yellow-700",
  "Historical Fiction": "hover:bg-orange-100 hover:text-orange-700",
  Adventure: "hover:bg-green-100 hover:text-green-700",
  Drama: "hover:bg-rose-100 hover:text-rose-700",
  "Cozy Mystery": "hover:bg-amber-100 hover:text-amber-700",
  "Slice of Life": "hover:bg-lime-100 hover:text-lime-700",
  "Young Adult": "hover:bg-fuchsia-100 hover:text-fuchsia-700",
  "Non-fiction": "hover:bg-cyan-100 hover:text-cyan-700",
  Biography: "hover:bg-indigo-100 hover:text-indigo-700",
  "Self-help": "hover:bg-teal-100 hover:text-teal-700",
  Memoir: "hover:bg-violet-100 hover:text-violet-700",
  Poetry: "hover:bg-pink-50 hover:text-pink-600",
  Spirituality: "hover:bg-emerald-100 hover:text-emerald-700",
  Philosophy: "hover:bg-zinc-100 hover:text-zinc-700",
  Crime: "hover:bg-red-50 hover:text-red-600",
  Suspense: "hover:bg-yellow-50 hover:text-yellow-600",
  Dystopian: "hover:bg-gray-200 hover:text-gray-800",
  Apocalyptic: "hover:bg-red-200 hover:text-red-800",
  Cyberpunk: "hover:bg-cyan-200 hover:text-cyan-800",
  Steampunk: "hover:bg-amber-200 hover:text-amber-800",
  "Fairy Tale": "hover:bg-pink-200 hover:text-pink-800",
  Mythology: "hover:bg-purple-200 hover:text-purple-800",
  Folklore: "hover:bg-lime-200 hover:text-lime-800",
  "Magical Realism": "hover:bg-indigo-200 hover:text-indigo-800",
  LitRPG: "hover:bg-blue-200 hover:text-blue-800",
  Paranormal: "hover:bg-violet-200 hover:text-violet-800",
  Supernatural: "hover:bg-fuchsia-200 hover:text-fuchsia-800",
  Contemporary: "hover:bg-slate-100 hover:text-slate-700",
  Satire: "hover:bg-orange-50 hover:text-orange-600",
  Humor: "hover:bg-amber-50 hover:text-amber-600",
  "Coming of Age": "hover:bg-pink-100 hover:text-pink-700",
  Political: "hover:bg-red-100 hover:text-red-700",
  Military: "hover:bg-gray-300 hover:text-gray-800",
  Western: "hover:bg-yellow-200 hover:text-yellow-800",
  "Historical Romance": "hover:bg-rose-200 hover:text-rose-800",
  "Urban Fantasy": "hover:bg-purple-300 hover:text-purple-900",
  "Psychological Thriller": "hover:bg-slate-200 hover:text-slate-800",
  "True Crime": "hover:bg-rose-100 hover:text-rose-700",
  Educational: "hover:bg-sky-100 hover:text-sky-700",
  "How-to": "hover:bg-teal-100 hover:text-teal-700",
  "Health & Wellness": "hover:bg-green-100 hover:text-green-700",
  Parenting: "hover:bg-pink-300 hover:text-pink-900",
  Technology: "hover:bg-blue-300 hover:text-blue-900",
  Business: "hover:bg-amber-300 hover:text-amber-900",
  Productivity: "hover:bg-lime-300 hover:text-lime-900",
  "Faith-Based": "hover:bg-emerald-200 hover:text-emerald-800",
  "Islamic Fiction": "hover:bg-green-200 hover:text-green-800",
};


export default function GenreSelector({
  genre,
  setGenre,
}: {
  genre: string;
  setGenre: (val: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredGenres = useMemo(() => {
    if (!query) return GENRE_LIST;
    return GENRE_LIST.filter((g) =>
      g.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="relative">
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Genre</span>
        <input
          type="text"
          value={query || genre}
          onChange={(e) => {
            setQuery(e.target.value);
            setGenre(e.target.value);
          }}
          placeholder="Select or type a genre"
          className="rounded-xl border p-3 border-gray-300 shadow-md"
          onBlur={() => setQuery("")}
        />
      </label>

      {query && filteredGenres.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg">
          {filteredGenres.map((item) => (
            <li
              key={item}
              onMouseDown={() => {
                setGenre(item);
                setQuery("");
              }}
              className={`cursor-pointer px-4 py-2 transition-colors text-gray-700 ${
                genreColors[item] || "hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
