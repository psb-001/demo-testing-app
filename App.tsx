import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView as RNSSafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import {
  UserRole,
  UserProfile,
  DemoSession,
  Booking,
  Invoice,
  Review,
  Dispute,
  AppNotification,
  Worker,
  BookingStatus,
} from './src/types';
import { mockWorkers as initialWorkersData } from './src/data/workersData';
import {
  loadStoredAppState,
  saveStoredAppState,
  resetStoredAppState,
  defaultCustomer,
  defaultCooperative,
  demoProfiles,
  loadActiveSession,
  saveActiveSession,
  clearActiveSession,
  initialInvoices,
} from './src/data/mockAppData';
import {
  AppLanguage,
  loadStoredLanguage,
  saveStoredLanguage,
} from './src/data/mobileTranslations';
import { hydrateStorage } from './src/utilities/storage';

// Services
import { BookingService } from './src/services/BookingService';
import { ReviewService } from './src/services/ReviewService';
import { DisputeService } from './src/services/DisputeService';
import { NotificationService } from './src/services/NotificationService';

// Auth Portal
import { LoginPortal } from './src/components/auth/LoginPortal';

// Common Components
import { MobileHeader } from './src/components/common/MobileHeader';
import { BottomTabBar } from './src/components/common/BottomTabBar';
import { RoleSelectModal } from './src/components/common/RoleSelectModal';
import { NotificationDrawer } from './src/components/common/NotificationDrawer';

// Customer Components
import { CustomerHome } from './src/components/customer/CustomerHome';
import { CustomerBook } from './src/components/customer/CustomerBook';
import { CustomerBookings } from './src/components/customer/CustomerBookings';
import { CustomerInvoices } from './src/components/customer/CustomerInvoices';
import { CustomerSupport } from './src/components/customer/CustomerSupport';

// Worker Components
import { WorkerJobs } from './src/components/worker/WorkerJobs';
import { WorkerRequests } from './src/components/worker/WorkerRequests';
import { WorkerReviews } from './src/components/worker/WorkerReviews';
import { WorkerDisputes } from './src/components/worker/WorkerDisputes';
import { WorkerProfile } from './src/components/worker/WorkerProfile';

// Cooperative Components
import { CooperativeOverview } from './src/components/cooperative/CooperativeOverview';
import { CooperativeMembers } from './src/components/cooperative/CooperativeMembers';
import { CooperativeBookings } from './src/components/cooperative/CooperativeBookings';
import { CooperativeDisputes } from './src/components/cooperative/CooperativeDisputes';
import { CooperativeReviews } from './src/components/cooperative/CooperativeReviews';

// Safe global object (works on web + native without DOM lib)
const g = globalThis as any;
const getWindow = (): any => (typeof g.window !== 'undefined' ? g.window : null);

function defaultTabForRole(role: UserRole): string {
  if (role === 'customer') return 'home';
  if (role === 'worker') return 'jobs';
  return 'overview';
}

export function App() {
  // 1. Authentication, Session & Language State
  const [activeSession, setActiveSession] = useState<DemoSession | null>(
    () => loadActiveSession()
  );
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentLang, setCurrentLang] = useState<AppLanguage>(
    () => loadStoredLanguage()
  );
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] =
    useState<Worker | null>(null);

  // Domain Entities
  const [workers, setWorkers] = useState<Worker[]>(initialWorkersData);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // 2. Load persisted state on mount
  useEffect(() => {
    hydrateStorage().then(() => {
      setBookings(loadStoredAppState().bookings);
      setInvoices(loadStoredAppState().invoices || initialInvoices);
      setReviews(loadStoredAppState().reviews);
      setDisputes(loadStoredAppState().disputes);
      setNotifications(loadStoredAppState().notifications);
    });
  }, []);

  // 3. Persist state on updates
  useEffect(() => {
    if (bookings.length > 0 || reviews.length > 0) {
      saveStoredAppState({
        bookings,
        invoices,
        reviews,
        disputes,
        notifications,
        currentRole,
        customer: defaultCustomer,
        cooperative: defaultCooperative,
      });
    }
  }, [bookings, invoices, reviews, disputes, notifications, currentRole]);

  // 4. Global Escape key listener (web only)
  useEffect(() => {
    const w = getWindow();
    if (w && typeof w.addEventListener === 'function') {
      const onKeyDown = (e: any) => {
        if (e.key === 'Escape') {
          setIsRoleModalOpen(false);
          setIsNotificationOpen(false);
        }
      };
      w.addEventListener('keydown', onKeyDown);
      return () => w.removeEventListener('keydown', onKeyDown);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Session Handlers
  // ---------------------------------------------------------------------------

  const handleLogin = (profile: UserProfile) => {
    const session: DemoSession = { user: profile, loginTime: Date.now() };
    saveActiveSession(session);
    setActiveSession(session);
    setCurrentRole(profile.role);
    setActiveTab(defaultTabForRole(profile.role));
  };

  const handleLogout = () => {
    clearActiveSession();
    setActiveSession(null);
  };

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLang(lang);
    saveStoredLanguage(lang);
  };

  const handleSelectRole = (role: UserRole) => {
    handleLogin(demoProfiles[role]);
    setIsRoleModalOpen(false);
  };

  const handleResetData = () => {
    resetStoredAppState();
    const fresh = loadStoredAppState();
    setBookings(fresh.bookings);
    setInvoices(fresh.invoices);
    setReviews(fresh.reviews);
    setDisputes(fresh.disputes);
    setNotifications(fresh.notifications);
    setWorkers(initialWorkersData);
    const session = loadActiveSession();
    if (session) {
      setCurrentRole(session.user.role);
      setActiveTab(defaultTabForRole(session.user.role));
    }
  };

  // ---------------------------------------------------------------------------
  // Booking Handlers
  // ---------------------------------------------------------------------------

  const handleCustomerCreateBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setNotifications((prev) => [
      ...NotificationService.forNewBooking(
        newBooking,
        defaultCooperative.id,
        defaultCooperative.name
      ),
      ...prev,
    ]);
    setActiveTab('bookings');
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    nextStatus: BookingStatus,
    note?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return BookingService.applyStatusTransition(b, nextStatus, note);
      })
    );

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    if (nextStatus === 'completed') {
      const invoice = BookingService.generateInvoice(targetBooking);
      setInvoices((prev) => [invoice, ...prev]);
      setNotifications((prev) => [
        ...NotificationService.forJobCompleted(
          targetBooking,
          invoice.id,
          invoice.invoiceNumber
        ),
        ...prev,
      ]);
    } else {
      setNotifications((prev) => [
        NotificationService.forStatusChange(targetBooking, nextStatus, bookingId),
        ...prev,
      ]);
    }
  };

  const handleSimulateIncomingWorkerRequest = () => {
    handleCustomerCreateBooking(BookingService.buildSimulatedRequest());
  };

  // ---------------------------------------------------------------------------
  // Review Handler
  // ---------------------------------------------------------------------------

  const handleCustomerSubmitReview = (
    bookingId: string,
    rating: number,
    text: string
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newReview = ReviewService.buildReview(booking, rating, text);
    setReviews((prev) => [newReview, ...prev]);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, rating, reviewText: text } : b
      )
    );

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === booking.workerId || w.name === booking.workerName
          ? ReviewService.updateWorkerRating(w, rating)
          : w
      )
    );

    setNotifications((prev) => [
      NotificationService.forReview(booking, rating, text),
      ...prev,
    ]);
  };

  // ---------------------------------------------------------------------------
  // Dispute Handlers
  // ---------------------------------------------------------------------------

  const handleCustomerRaiseDispute = (bookingId: string, issue: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const dispute = DisputeService.buildDispute(booking, issue);
    setDisputes((prev) => [dispute, ...prev]);

    handleUpdateBookingStatus(
      bookingId,
      'disputed',
      `Customer opened dispute #${dispute.id}`
    );

    setNotifications((prev) => [
      ...NotificationService.forDisputeRaised(booking),
      ...prev,
    ]);
  };

  const handleWorkerRespondDispute = (disputeId: string, response: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? DisputeService.applyWorkerResponse(d, response) : d
      )
    );

    setNotifications((prev) => [
      NotificationService.forWorkerDisputeResponse(
        defaultCooperative.id,
        disputeId
      ),
      ...prev,
    ]);
  };

  const handleResolveDispute = (disputeId: string, resolutionNotes: string) => {
    const target = disputes.find((d) => d.id === disputeId);

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? DisputeService.applyResolution(d, resolutionNotes) : d
      )
    );

    setNotifications((prev) => [
      ...NotificationService.forDisputeResolved(
        target?.customerId ?? defaultCustomer.id,
        target?.workerId ?? 'w1',
        resolutionNotes
      ),
      ...prev,
    ]);
  };

  // ---------------------------------------------------------------------------
  // Cooperative Member Enrollment
  // ---------------------------------------------------------------------------

  const handleAddMember = (newMemberData: Omit<Worker, 'id'>) => {
    const newWorker: Worker = { ...newMemberData, id: `w-${Date.now()}` };
    setWorkers((prev) => [newWorker, ...prev]);
    setNotifications((prev) => [
      NotificationService.forMemberEnrolled(
        defaultCooperative.id,
        newWorker.name
      ),
      ...prev,
    ]);
  };

  // ---------------------------------------------------------------------------
  // Notification Handlers
  // ---------------------------------------------------------------------------

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);

    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    } else if (notif.type === 'booking_request') {
      setActiveTab(currentRole === 'worker' ? 'requests' : 'bookings');
    } else if (
      notif.type === 'invoice_issued' ||
      notif.type === 'payment_received'
    ) {
      setActiveTab(currentRole === 'customer' ? 'invoices' : 'overview');
    } else if (
      notif.type === 'dispute_opened' ||
      notif.type === 'dispute_resolved'
    ) {
      setActiveTab(currentRole === 'customer' ? 'support' : 'disputes');
    } else if (notif.type === 'review_received') {
      setActiveTab('reviews');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.role === currentRole ? { ...n, isRead: true } : n))
    );
  };

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const roleNotifications = notifications.filter((n) => n.role === currentRole);
  const unreadCount = roleNotifications.filter((n) => !n.isRead).length;

  const pendingRequestsCount = bookings.filter(
    (b) =>
      (b.workerId === 'w1' ||
        b.workerId === 'w-ramesh-jadhav' ||
        b.workerName.toLowerCase().includes('ramesh')) &&
      b.status === 'requested'
  ).length;

  const activeBookingsCount = bookings.filter((b) =>
    ['accepted', 'active', 'in_progress'].includes(b.status)
  ).length;

  const openDisputesCount = disputes.filter(
    (d) => d.status !== 'resolved'
  ).length;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {!activeSession ? (
        <RNSSafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
          <LoginPortal
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            onLogin={handleLogin}
          />
        </RNSSafeAreaView>
      ) : (
        <RNSSafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
          {/* Mobile App Viewport */}
          <View style={styles.viewport}>
            <MobileHeader
              currentRole={currentRole}
              activeProfile={activeSession.user}
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
              onOpenRoleSelect={() => setIsRoleModalOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              unreadNotificationsCount={unreadCount}
              onResetData={handleResetData}
              onLogout={handleLogout}
            />

            <ScrollView
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              style={styles.scroll}
            >
              {/* CUSTOMER PORTAL */}
              {currentRole === 'customer' && (
                <View>
                  {activeTab === 'home' && (
                    <CustomerHome
                      customer={defaultCustomer}
                      bookings={bookings}
                      onNavigateTab={setActiveTab}
                      onSelectWorkerForBooking={(worker) => {
                        setSelectedWorkerForBooking(worker);
                        setActiveTab('book');
                      }}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'book' && (
                    <CustomerBook
                      customer={defaultCustomer}
                      initialSelectedWorker={selectedWorkerForBooking}
                      onClearInitialWorker={() => setSelectedWorkerForBooking(null)}
                      onCreateBooking={handleCustomerCreateBooking}
                      onNavigateTab={setActiveTab}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'bookings' && (
                    <CustomerBookings
                      bookings={bookings}
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                      onSubmitReview={handleCustomerSubmitReview}
                      onNavigateTab={setActiveTab}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'invoices' && (
                    <CustomerInvoices
                      invoices={invoices}
                      onNavigateTab={setActiveTab}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'support' && (
                    <CustomerSupport
                      bookings={bookings}
                      disputes={disputes}
                      onRaiseDispute={handleCustomerRaiseDispute}
                      currentLang={currentLang}
                    />
                  )}
                </View>
              )}

              {/* WORKER PORTAL */}
              {currentRole === 'worker' && (
                <View>
                  {activeTab === 'jobs' && (
                    <WorkerJobs
                      bookings={bookings}
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                      onNavigateTab={setActiveTab}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'requests' && (
                    <WorkerRequests
                      bookings={bookings}
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                      onSimulateNewRequest={handleSimulateIncomingWorkerRequest}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'reviews' && (
                    <WorkerReviews reviews={reviews} currentLang={currentLang} />
                  )}
                  {activeTab === 'disputes' && (
                    <WorkerDisputes
                      disputes={disputes}
                      onWorkerRespond={handleWorkerRespondDispute}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'profile' && (
                    <WorkerProfile
                      onResetData={handleResetData}
                      currentLang={currentLang}
                    />
                  )}
                </View>
              )}

              {/* COOPERATIVE PORTAL */}
              {currentRole === 'cooperative' && (
                <View>
                  {activeTab === 'overview' && (
                    <CooperativeOverview
                      bookings={bookings}
                      disputes={disputes}
                      reviews={reviews}
                      onNavigateTab={setActiveTab}
                      onOpenAddMember={() => setActiveTab('members')}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'members' && (
                    <CooperativeMembers
                      members={workers}
                      onAddMember={handleAddMember}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'bookings' && (
                    <CooperativeBookings
                      bookings={bookings}
                      onUpdateBookingStatus={handleUpdateBookingStatus}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'disputes' && (
                    <CooperativeDisputes
                      disputes={disputes}
                      onResolveDispute={handleResolveDispute}
                      currentLang={currentLang}
                    />
                  )}
                  {activeTab === 'reviews' && (
                    <CooperativeReviews
                      reviews={reviews}
                      currentLang={currentLang}
                    />
                  )}
                </View>
              )}
            </ScrollView>

            <BottomTabBar
              currentRole={currentRole}
              currentLang={currentLang}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              badgeCounts={{
                customerBookings: activeBookingsCount,
                workerJobs: activeBookingsCount,
                workerRequests: pendingRequestsCount,
                coopDisputes: openDisputesCount,
              }}
            />

            <RoleSelectModal
              isOpen={isRoleModalOpen}
              onClose={() => setIsRoleModalOpen(false)}
              currentRole={currentRole}
              onSelectRole={handleSelectRole}
              currentLang={currentLang}
            />

            <NotificationDrawer
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              currentRole={currentRole}
              notifications={roleNotifications}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onNotificationClick={handleNotificationClick}
              currentLang={currentLang}
            />
          </View>
        </RNSSafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate900,
  },
  viewport: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: colors.background,
    ...({
      shadowColor: colors.slate900,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    } as object),
  },
  scroll: {
    flex: 1,
  },
  mainContent: {
    padding: 16,
    paddingBottom: 96,
  },
});

export default App;