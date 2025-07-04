import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Library from "./pages/Library";
import BookDetails from "./pages/BookDetails";
import ReaderPage from "./pages/ReaderPage";
import BookEditor from "./pages/BookEditor";
import AuthorProfileForm from "./pages/AuthorProfileForm";
import AuthorDashboard from "./pages/AuthorDashboard";
import AuthorPublicPage from "./pages/AuthorPublicPage";
import BookmarksPage from "./pages/BookmarksPage";
import AdminApprovalPage from "./pages/AdminApproval";
import ProtectedRoute from "./components/ProtectedRoute";
import { inject, track } from "@vercel/analytics";
import { useEffect } from "react";
import Blog from "./pages/Blog";
import NewBlog from "./pages/NewBlog";
import BlogReader from "./pages/BlogReader";
import NooksPage from "./pages/NooksPage";
import CreateNookPage from "./pages/CreateNookPage";
import NookDetailPage from "./pages/NookDetailPage";
import Profile from "./pages/Profile";
import ShelfPage from "./pages/ShelfPage";
import BookReviews from "./pages/BookReviews";
import BookComments from "./pages/BookComments";
import Events from "./pages/Events";
import AdminEvents from "./pages/AdminEvents";
import EventDetails from "./pages/EventDetails";

inject();

// Component to track page views on route change
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    track("pageview");
  }, [location]);

  return null;
}

export default function App() {
  useEffect(() => {
    const unlockAudio = () => {
      const sfx = new Audio("/FantasyWhoosh.mp3");
      sfx.play().then(() => sfx.pause());
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
  }, []);

  return (
    <div className="min-h-screen">
      <Router>
        <AnalyticsTracker />
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/new" element={<NewBlog />} />
          <Route path="/blog/:slug" element={<BlogReader />} />
          <Route path="/shelf/:id" element={<ShelfPage />} />
          <Route path="/book/:id/reviews" element={<BookReviews />} />
          <Route path="/book/:id/comments" element={<BookComments />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Protected Routes */}
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nooks" element={<NooksPage />} />
          <Route path="/nook/create" element={<CreateNookPage />} />
          <Route path="/nook/:id" element={<NookDetailPage />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/read/:id"
            element={
              <ProtectedRoute>
                <ReaderPage />
              </ProtectedRoute>
            }
          />
          <Route path="/author/:id" element={<AuthorPublicPage />} />
          <Route
            path="/admin-approval"
            element={
              <ProtectedRoute>
                <AdminApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <AuthorProfileForm />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/new" element={<BookEditor mode="new" />} />
          <Route
            path="/dashboard/edit/:id"
            element={
              <ProtectedRoute>
                <BookEditor mode="edit" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
