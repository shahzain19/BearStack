import { BookOpen, Users, Smile } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="min-h-screen bg-[#FFFDF5] text-bearBrown py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">📚 About BearStacks</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Cozy Library is a peaceful place on the internet where readers can discover,
            organize, and enjoy books — together. Built with warmth, one page at a time.
          </p>
        </header>

        {/* Sections */}
        <div className="grid gap-12 sm:grid-cols-2">
          {/* Mission */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <BookOpen size={22} /> Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              I created BearStacks to bring the joy of reading into a digital space that
              feels welcoming. No clutter. No pressure. Just you, your favorite books, and a
              warm cup of tea — metaphorically, or literally.
            </p>
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Users size={22} /> Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed">
             I am a indie developer who believe that
              reading should be accessible and beautiful. Cozy Library was built as a passion
            </p>
          </div>

          {/* Vision */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Smile size={22} /> Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We dream of a world where people can read, write, and share stories without
              distractions. BearStacks isn’t just for readers — it’s a place for authors,
              thinkers, and dreamers to express themselves.
            </p>
          </div>

          {/* Open Source */}
        </div>

      </div>
    </section>
  );
}
