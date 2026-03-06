import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Departments from "./pages/departments/Departments";
import DepartmentDetail from "./pages/departments/DepartmentDetail";
import Subjects from "./pages/subjects/Subjects";
import SubjectDetail from "./pages/subjects/SubjectDetail";
import Faculty from "./pages/faculty/Faculty";
import Classes from "./pages/classes/Classes";
import ClassDetail from "./pages/classes/ClassDetail";
import AssignmentCreate from "./pages/classes/AssignmentCreate";
import AssignmentDetail from "./pages/classes/AssignmentDetail";
import Enrollments from "./pages/enrollments/Enrollments";
import Profile from "./pages/profile/Profile";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function ProtectedLayout({ children, title, subtitle }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} subtitle={subtitle} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedLayout title="Dashboard" subtitle="A quick snapshot of the latest activity and key metrics.">
              <Dashboard />
            </ProtectedLayout>
          } />
          <Route path="/departments" element={
            <ProtectedLayout title="Departments" subtitle="Quick access to essential metrics and management tools.">
              <Departments />
            </ProtectedLayout>
          } />
          <Route path="/departments/:id" element={
            <ProtectedLayout title="Department Details" subtitle="View department subjects and classes.">
              <DepartmentDetail />
            </ProtectedLayout>
          } />
          <Route path="/subjects" element={
            <ProtectedLayout title="Subjects" subtitle="Quick access to essential metrics and management tools.">
              <Subjects />
            </ProtectedLayout>
          } />
          <Route path="/subjects/:id" element={
            <ProtectedLayout title="Subject Details" subtitle="View assigned teacher and classrooms.">
              <SubjectDetail />
            </ProtectedLayout>
          } />
          <Route path="/faculty" element={
            <ProtectedLayout title="Faculty" subtitle="Manage teaching staff and assignments.">
              <Faculty />
            </ProtectedLayout>
          } />
          <Route path="/classes" element={
            <ProtectedLayout title="Classes" subtitle="Manage class schedules and assignments.">
              <Classes />
            </ProtectedLayout>
          } />
          <Route path="/class/:id" element={
            <ProtectedLayout title="Class" subtitle="">
              <ClassDetail />
            </ProtectedLayout>
          } />
          <Route path="/class/:id/create-assignment" element={
            <ProtectedLayout title="Create Assignment" subtitle="Add a new assignment to this class.">
              <AssignmentCreate />
            </ProtectedLayout>
          } />
          <Route path="/assignment/:id" element={
            <ProtectedLayout title="Assignment" subtitle="">
              <AssignmentDetail />
            </ProtectedLayout>
          } />
          <Route path="/enrollments" element={
            <ProtectedLayout title="Enrollments" subtitle="Manage student enrollments.">
              <Enrollments />
            </ProtectedLayout>
          } />
          <Route path="/profile" element={
            <ProtectedLayout title="Profile" subtitle="Manage your account settings.">
              <Profile />
            </ProtectedLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}