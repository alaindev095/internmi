
import { Navigate, Route, Routes } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import StudentDashboard from '../pages/student/StudentDashboard'
import Companies from '../pages/student/Companies'
import Internships from '../pages/student/Internships'
import InternshipDetails from '../pages/student/InternshipDetails'
import MyApplications from '../pages/student/MyApplications'
import StudentProfile from '../pages/student/StudentProfile'
import CompanyLayout from "../layouts/CompanyLayout";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyInternships from '../pages/company/CompanyInternships'
import CompanyApplications from '../pages/company/CompanyApplications'
import ApplicationDetails from '../pages/company/ApplicationDetails'
import CompanyAnalytics from '../pages/company/CompanyAnalytics'
import CompanyProfile from '../pages/company/CompanyProfile'
import CompanySettings from '../pages/company/CompanySettings'
import EmployerProfile from '../pages/company/EmployerProfile'
import InternshipForm from '../pages/company/InternshipForm'


import SchoolLayout from '../layouts/SchoolLayout'
import SchoolDashboard from '../pages/school/SchoolDashboard'
import SchoolStudents from '../pages/school/SchoolStudents'
import SchoolInternships from '../pages/school/SchoolInternships'
import SchoolReports from '../pages/school/SchoolReports'
import SchoolStaff from '../pages/school/SchoolStaff'
import SchoolSettings from '../pages/school/SchoolSettings'
import SchoolClasses from '../pages/school/SchoolClasses'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="internships" element={<Internships />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="internships/:id" element={<InternshipDetails />} />
      </Route>

      <Route path="/company" element={<CompanyLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="internships" element={<CompanyInternships />} />
        <Route path="applications" element={<CompanyApplications />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />
        <Route path="analytics" element={<CompanyAnalytics />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="settings" element={<CompanySettings />} />
        <Route path="user-profile" element={<EmployerProfile />} />
        <Route path="internships/new" element={<InternshipForm />} />
        <Route path="internships/:id/edit" element={<InternshipForm />} />

      </Route>

      <Route path="/school" element={<SchoolLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SchoolDashboard />} />
        <Route path="students" element={<SchoolStudents />} />
        <Route path="internships" element={<SchoolInternships />} />
        <Route path="reports" element={<SchoolReports />} />
        <Route path="staff" element={<SchoolStaff />} />
        <Route path="settings" element={<SchoolSettings />} />
        <Route path="user-profile" element={<EmployerProfile />} />
        <Route path="classes" element={<SchoolClasses />} />
        <Route path="classes/:id" element={<SchoolClasses />} />
      </Route>

      <Route
        path="*"
        element={<h1>404 — Page not found</h1>}
      />
    </Routes>
  )
}

export default AppRoutes
