// AdminApprovalPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import BookCard from "../components/BookCard";
import type { Book } from "../models/Book";

import {
  BarChart2,
  BookOpenCheck,
  Clock10,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminApprovalPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentActivity, setRecentActivity] = useState<
    { title: string; action: string; date: string }[]
  >([]);
  const [genreData, setGenreData] = useState<{ name: string; count: number }[]>(
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return navigate("/login");
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error || !profile || profile.role !== "admin") return navigate("/");
      setIsAdmin(true);
      setCheckingRole(false);
    };
    checkAdminRole();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      setLoading(true);
      const [pendingBooks, allBooks] = await Promise.all([
        supabase
          .from("books")
          .select("*")
          .eq("is_accepted", "pending")
          .order("created_at", { ascending: false }),
        supabase.from("books").select("title, is_accepted, created_at, genre"),
      ]);

      if (pendingBooks.error) setError(pendingBooks.error.message);
      else setBooks(pendingBooks.data || []);

      const all = allBooks.data || [];
      const approved = all.filter((b) => b.is_accepted === "yes");
      const rejected = all.filter((b) => b.is_accepted === "no");
      const pending = all.filter((b) => b.is_accepted === "pending");

      setStats({
        total: all.length,
        approved: approved.length,
        rejected: rejected.length,
        pending: pending.length,
      });

      const genreMap: Record<string, number> = {};
      all.forEach((b) => {
        const g = b.genre || "Unknown";
        genreMap[g] = (genreMap[g] || 0) + 1;
      });

      setGenreData(
        Object.entries(genreMap).map(([name, count]) => ({ name, count }))
      );

      const recent = [...approved, ...rejected]
        .sort(
          (a, b) =>
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime()
        )
        .slice(0, 5)
        .map((b) => ({
          title: b.title,
          action: b.is_accepted === "yes" ? "Approved" : "Rejected",
          date: new Date(b.created_at!).toLocaleString(),
        }));

      setRecentActivity(recent);
      setLoading(false);
    };
    fetchAll();
  }, [isAdmin]);

  const handleApproval = async (id: string, decision: "yes" | "no") => {
    const confirm = window.confirm(
      decision === "yes" ? "Approve this book?" : "Reject and delete this book?"
    );
    if (!confirm) return;

    try {
      setActionLoading(id);
      if (decision === "no") {
        const { data: book } = await supabase
          .from("books")
          .select("cover_url")
          .eq("id", id)
          .single();
        if (book?.cover_url) {
          const path = book.cover_url.split("/book-covers/")[1];
          await supabase.storage.from("book-covers").remove([path]);
        }
        await supabase.from("books").delete().eq("id", id);
      } else {
        await supabase
          .from("books")
          .update({ is_accepted: "yes" })
          .eq("id", id);
      }
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (e) {
      console.error(e);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  if (checkingRole) {
    return (
      <p className="text-center text-bearBrown mt-10 font-medium">
        🧸 Checking admin permissions…
      </p>
    );
  }

  return (
    <div className="px-6 py-14 max-w-7xl mx-auto font-poppins space-y-14 bg-polarWhite">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-bearBrown flex items-center justify-center gap-2">
          <BarChart2 className="w-8 h-8" /> Beary Cozy Admin Dashboard 🐾
        </h2>
        <p className="text-honey italic text-sm sm:text-base">
          Gently manage books and keep the library warm & fuzzy.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={<BookOpenCheck />}
          label="Total Books"
          count={stats.total}
        />
        <InsightCard
          icon={<Clock10 className="text-yellow-600" />}
          label="Pending"
          count={stats.pending}
        />
        <InsightCard
          icon={<CheckCircle2 className="text-green-600" />}
          label="Approved"
          count={stats.approved}
        />
        <InsightCard
          icon={<XCircle className="text-red-600" />}
          label="Rejected"
          count={stats.rejected}
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Genre Chart */}
        <div className="bg-honey/40 p-6 rounded-3xl shadow-inner border border-honey/30">
          <h3 className="text-lg font-semibold text-bearBrown mb-4">
            📚 Genre Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {genreData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#d1bfa7", "#f7d9b0", "#b8e0d2", "#eec3c3", "#c9c6ec"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Actions */}
        <div className="bg-honey/40 p-6 rounded-3xl shadow-inner border border-honey/30">
          <h3 className="text-lg font-semibold text-bearBrown mb-4">
            🕓 Recent Admin Actions
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 italic">No recent actions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-700 flex justify-between"
                >
                  <span className="font-medium">📖 {item.title}</span>
                  <span className="text-gray-500 italic">
                    {item.action} on {item.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-honey">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-bearBrown flex items-center gap-2">
            🛡️ Pending Book Approvals
          </h1>
          <p className="text-sm text-honey">
            Only visible to{" "}
            <span className="font-medium text-bearBrown">admins</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-red-800 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-bearBrown text-center text-lg">
            ⏳ Loading books...
          </p>
        ) : books.length === 0 ? (
          <div className="text-center">
            <img
              src="https://illustrations.popsy.co/gray/reading-time.svg"
              alt="No books"
              className="w-60 mx-auto mb-4 opacity-90"
            />
            <p className="text-bearBrown text-lg">
              No books awaiting approval 🎉
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-5 border border-honey rounded-3xl bg-polarWhite shadow-inner hover:shadow-lg transition"
              >
                <BookCard book={book} className="w-full" />
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => handleApproval(book.id, "yes")}
                    disabled={actionLoading === book.id}
                    className="rounded-full bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm shadow disabled:opacity-50"
                  >
                    {actionLoading === book.id ? (
                      <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                    ) : (
                      "✅ Approve"
                    )}
                  </button>
                  <button
                    onClick={() => handleApproval(book.id, "no")}
                    disabled={actionLoading === book.id}
                    className="rounded-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm shadow disabled:opacity-50"
                  >
                    {actionLoading === book.id ? (
                      <Loader2 className="animate-spin h-4 w-4 mx-auto" />
                    ) : (
                      "❌ Reject"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  count,
}: {
  icon: React.JSX.Element;
  label: string;
  count: number;
}) {
  return (
    <div className="bg-honey/30 rounded-2xl shadow p-5 flex items-center gap-4 border border-yellow-100 hover:shadow-md transition">
      <div className="text-bearBrown text-3xl">{icon}</div>
      <div>
        <p className="text-xl font-bold text-bearBrown">{count}</p>
        <p className="text-honey text-sm">{label}</p>
      </div>
    </div>
  );
}
