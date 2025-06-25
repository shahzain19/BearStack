import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
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

export default function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Protected Routes */}
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/read/:id" element={<ProtectedRoute><ReaderPage /></ProtectedRoute>} />
          <Route path="/author/:id" element={<ProtectedRoute><AuthorPublicPage /></ProtectedRoute>} />
          <Route path="/admin-approval" element={<ProtectedRoute><AdminApprovalPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AuthorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><AuthorProfileForm /></ProtectedRoute>} />
          <Route path="/dashboard/new" element={<ProtectedRoute><BookEditor mode="new" /></ProtectedRoute>} />
          <Route path="/dashboard/edit/:id" element={<ProtectedRoute><BookEditor mode="edit" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}
