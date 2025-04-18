import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutUsPage from '../pages/AboutUsPage';
import ContactUsPage from '../pages/ContactUsPage';
import AdminHomepage from '../pages/AdminHomepage';
import CollegeListPage from '../pages/CollegeListPage';
import CollegeDetailsPage from '../pages/CollegeDetailsPage';
// import UserManagementPage from '../pages/UserManagementPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/admin" element={<AdminHomepage />} />
        {/* <Route path="/admin/users" element={<UserManagementPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/college-list" element={<CollegeListPage />} />
        <Route path='/college/:collegeId' element={< CollegeDetailsPage/>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;