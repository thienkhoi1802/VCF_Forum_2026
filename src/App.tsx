/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProgressiveProfileModal } from './components/common/ProgressiveProfileModal';
import { EventRegistrationSuccessModal } from './components/common/EventRegistrationSuccessModal';

// All 13 Spec Pages
import { HomePage } from './components/pages/HomePage';
import { ActivitiesPage } from './components/pages/ActivitiesPage';
import { ActivityDetailPage } from './components/pages/ActivityDetailPage';
import { MemberRegistrationPage } from './components/pages/MemberRegistrationPage';
import { EventsCalendarPage } from './components/pages/EventsCalendarPage';
import { EventDetailPage } from './components/pages/EventDetailPage';
import { KnowledgeHomePage } from './components/pages/KnowledgeHomePage';
import { KnowledgeCategoryPage } from './components/pages/KnowledgeCategoryPage';
import { ArticleDetailPage } from './components/pages/ArticleDetailPage';
import { ProgramsPage } from './components/pages/ProgramsPage';
import { ProgramDetailPage } from './components/pages/ProgramDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { AuthPage } from './components/pages/AuthPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SearchResultsPage } from './components/pages/SearchResultsPage';

const AppContent: React.FC = () => {
  const { currentRoute, notificationMessage } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentRoute]);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'activities':
        return <ActivitiesPage />;
      case 'activity-detail':
        return <ActivityDetailPage />;
      case 'register-member':
        return <MemberRegistrationPage />;
      case 'events':
        return <EventsCalendarPage />;
      case 'event-detail':
        return <EventDetailPage />;
      case 'knowledge':
        return <KnowledgeHomePage />;
      case 'knowledge-category':
        return <KnowledgeCategoryPage />;
      case 'article-detail':
        return <ArticleDetailPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'program-detail':
        return <ProgramDetailPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <AuthPage />;
      case 'profile':
        return <ProfilePage />;
      case 'search':
        return <SearchResultsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-[#eb1000] selection:text-white">
      {/* Main Global Navigation Header (Logo, Nav links, Member CTA) */}
      <Header />

      {/* Dynamic Page View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer (VLGM & PTIT information) */}
      <Footer />

      {/* Progressive Profile Modal (04-progressive-profile.md) */}
      <ProgressiveProfileModal />

      {/* Popup thông báo trạng thái hồ sơ sau khi đăng ký sự kiện thành công */}
      <EventRegistrationSuccessModal />

      {/* Global Notification Toast */}
      {notificationMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white text-xs font-sans px-5 py-3 rounded-full border border-neutral-800 shadow-xl flex items-center gap-2.5 animate-fadeIn">
          <span className="w-2 h-2 bg-[#eb1000] rounded-full animate-ping"></span>
          <span className="font-bold">{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
