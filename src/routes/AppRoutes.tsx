import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutUsPage from '../pages/AboutUsPage';
import ContactUsPage from '../pages/ContactUsPage';
import AdminHomepage from '../pages/AdminHomepage';
import CollegeListPage from '../pages/CollegeListPage';
import CollegeDetailsPage from '../pages/CollegeDetailsPage';
import ElectionsListPage from '../pages/ElectionsListPage';
import ElectionDetailsPage from '../pages/ElectionDetailsPage';
import WonLeadersPage from '../pages/WonLeadersPage';
import LandingPage from '../pages/LandingPage';
import LeadersDashboardPage from '../pages/LeadersDashboardPage';
import PositionsPage from '../pages/PositionsPage';
import PositionCompetitorsPage from '../pages/PositionCompetitorsPage';
import CollegeList from '../pages/CollegeList';
import AboutPage from '../pages/AboutPage';
import FeaturesPage from '../pages/Features';
import InstitutionDetails from '../pages/insititutionDetails';
import CandidateDetailsPage from '../pages/CandidateDetailsPage';
// import UserManagementPage from '../pages/UserManagementPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/admin" element={<AdminHomepage />} />
        {/* <Route path="/admin/users" element={<UserManagementPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/college-list" element={<CollegeListPage />} />
        <Route path='/college/:collegeId' element={< CollegeDetailsPage/>}/>
        <Route path='/about' element={< AboutPage/>}/>
        <Route path='/features' element={< FeaturesPage/>}/>

        <Route path="/election-list" element={<ElectionsListPage />} />
        <Route path="/college-list" element={<CollegeList />} />
        <Route path='/election/:electionId' element={< ElectionDetailsPage/>}/>
        
        <Route path='/leaders/:electionId' element={< WonLeadersPage/>}/>
        <Route path='/institution/:institutionId' element={< InstitutionDetails/>}/>


        <Route path="/leader-list" element={<LeadersDashboardPage />} />

        <Route path="/position-list" element={<PositionsPage />} />
        
        <Route path="/position/:positionId" element={<PositionCompetitorsPage />} />

        <Route path="/candidate/:candidateId" element={<CandidateDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;