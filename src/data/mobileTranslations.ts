export type AppLanguage = 'en' | 'hi' | 'mr';

export const LANGUAGE_STORAGE_KEY = 'rojgar_app_language';

import { getItemSync, setItemSync } from '../utilities/storage';

export const loadStoredLanguage = (): AppLanguage => {
  try {
    const saved = getItemSync(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'hi' || saved === 'mr') {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load language from storage', e);
  }
  return 'en';
};

export const saveStoredLanguage = (lang: AppLanguage): void => {
  try {
    setItemSync(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    console.error('Failed to save language to storage', e);
  }
};

export interface Translations {
  tagline?: string;
  brand: {
    name: string;
    tagline: string;
  };
  roles: {
    customer: string;
    worker: string;
    cooperative: string;
  };
  auth: {
    loginTitle: string;
    signupTitle: string;
    loginTab: string;
    signupTab: string;
    chooseRole: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    locality: string;
    localityPlaceholder: string;
    primaryTrade: string;
    coopName: string;
    coopNamePlaceholder: string;
    useDemoBtn: string;
    loginBtn: string;
    signupBtn: string;
    switchAccount: string;
    logout: string;
    quickDemoNotice: string;
  };
  header: {
    title: string;
    roleActive: string;
    switchRole: string;
    notifications: string;
    logout: string;
    resetState: string;
    resetConfirm: string;
  };
  tabs: {
    home: string;
    book: string;
    bookings: string;
    invoices: string;
    support: string;
    jobs: string;
    requests: string;
    reviews: string;
    disputes: string;
    profile: string;
    overview: string;
    members: string;
  };
  trades: {
    all: string;
    electrician: string;
    plumber: string;
    carpenter: string;
    cleaning: string;
    painting: string;
    appliances: string;
  };
  statuses: {
    requested: string;
    accepted: string;
    in_progress: string;
    completed: string;
    disputed: string;
    declined: string;
    expired: string;
  };
  customer: {
    home: {
      greeting: string;
      wardHub: string;
      zone: string;
      waitingWorker: string;
      workerEnRoute: string;
      workUnderway: string;
      trackStatus: string;
      quickActions: string;
      bookWorker: string;
      myBookings: string;
      raiseDispute: string;
      nearbyWorkers: string;
      viewAll: string;
      jobsDone: string;
      minsAway: string;
      requestBtn: string;
      guaranteeTitle: string;
      guaranteePoint1: string;
      guaranteePoint2: string;
      guaranteePoint3: string;
      guaranteePoint4: string;
    };
    book: {
      selectWardHub: string;
      searchPlaceholder: string;
      workersNearbyCount: string;
      sortedBy: string;
      coopBadge: string;
      requestWorker: string;
      describeTask: string;
      describeTaskPlaceholder: string;
      preferredSlot: string;
      slotImmediate: string;
      slotAfternoon: string;
      slotEvening: string;
      slotTomorrow: string;
      serviceAddress: string;
      transparentPricing: string;
      baseVisit: string;
      coopSafetyFund: string;
      totalPayable: string;
      escrowProtected: string;
      directPayoutNote: string;
      sendRequestBtn: string;
      dispatchedTo: string;
      waitingConfirmation: string;
      noPenalty: string;
      taskLabel: string;
      slotLabel: string;
      totalLabel: string;
      demoControls: string;
      demoAccept: string;
      demoDecline: string;
      demoExpire: string;
    };
    bookings: {
      title: string;
      subtitle: string;
      filterAll: string;
      filterActive: string;
      filterCompleted: string;
      filterDisputes: string;
      emptyBookings: string;
      bookWorkerNow: string;
      directPayoutPercent: string;
      serviceLifecycle: string;
      stageSent: string;
      stageConfirmed: string;
      stageWork: string;
      stageDone: string;
      stageRated: string;
      demoWorkStarted: string;
      demoMarkCompleted: string;
      rateWorker: string;
      ratedScore: string;
      raiseIssue: string;
      reviewTitle: string;
      selectRating: string;
      feedbackLabel: string;
      feedbackPlaceholder: string;
      submitReview: string;
    };
    invoices: {
      certifiedReceipts: string;
      headerTitle: string;
      headerDesc: string;
      emptyTitle: string;
      emptyDesc: string;
      serviceBy: string;
      workerPayout: string;
      welfareFund: string;
      platformFee: string;
      viewInvoiceBtn: string;
      modalTitle: string;
      billedTo: string;
      provider: string;
      residentClient: string;
      serviceParticulars: string;
      spareParts: string;
      platformCommission: string;
      zeroExtortion: string;
      socialWelfarePool: string;
      totalAmountPaid: string;
      paymentMode: string;
      refId: string;
      downloadPdf: string;
      closeBtn: string;
      downloadSuccess: string;
    };
    support: {
      title: string;
      subtitle: string;
      councilBadge: string;
      bannerTitle: string;
      bannerDesc: string;
      raiseIssueBtn: string;
      activeGrievances: string;
      noDisputesTitle: string;
      noDisputesDesc: string;
      targetProfessional: string;
      yourStatement: string;
      workerResponse: string;
      councilResolution: string;
      emergencyTitle: string;
      helplineTitle: string;
      helplineTiming: string;
      callBtn: string;
      wardHubCell: string;
      wardHubAddress: string;
      modalTitle: string;
      modalSubtitle: string;
      selectBooking: string;
      describeIssue: string;
      describeIssuePlaceholder: string;
      coopProtection: string;
      submitGrievanceBtn: string;
    };
    reviews: {
      title: string;
      subtitle: string;
      totalReviews: string;
      verified: string;
      coopImpact: string;
      dividendAudited: string;
      emptyTitle: string;
      viewCompletedBtn: string;
    };
  };
  worker: {
    jobs: {
      dutyShiftActive: string;
      wardHub: string;
      directPayoutRate: string;
      activeJobs: string;
      todayNet: string;
      qualityScore: string;
      newRequestAlert: string;
      decisionWindowActive: string;
      reviewBtn: string;
      filterActive: string;
      filterCompleted: string;
      filterAll: string;
      emptyJobs: string;
      customer: string;
      baseTariff: string;
      yourTakeHome: string;
      coopContribution: string;
      startJobBtn: string;
      completeJobBtn: string;
      completedBadge: string;
    };
    requests: {
      title: string;
      pendingCount: string;
      windowSubtitle: string;
      immediateRequest: string;
      expiresIn: string;
      customerAddress: string;
      taskDescription: string;
      rateBreakdown: string;
      totalCustomerPaid: string;
      directCredit: string;
      welfareShare: string;
      acceptJobBtn: string;
      declineJobBtn: string;
      simulateRequestBtn: string;
      emptyRequests: string;
    };
    reviews: {
      trustMetric: string;
      customerReputation: string;
      tierAVerified: string;
      totalRatings: string;
      recentCustomerFeedback: string;
      verifiedBooking: string;
    };
    disputes: {
      peerPanel: string;
      disputeCases: string;
      disputesSubtitle: string;
      noActiveDisputes: string;
      allClearDesc: string;
      claimDetails: string;
      yourStatement: string;
      yourResponse: string;
      peerCouncilRuling: string;
      respondBtn: string;
      modalTitle: string;
      provideExplanation: string;
      explanationPlaceholder: string;
      fairHearingNote: string;
      submitResponseBtn: string;
    };
    profile: {
      coopOwner: string;
      memberId: string;
      joinedDate: string;
      availabilityStatus: string;
      receivingRequests: string;
      pausedStatus: string;
      governanceOverview: string;
      directTakeHome: string;
      welfarePool: string;
      votingEquity: string;
      verifiedMemberSince: string;
      contactVerification: string;
      phone: string;
      societyHub: string;
      wardArea: string;
      certifications: string;
      safetyCertified: string;
      verifiedSkill: string;
      resetAppDemo: string;
    };
  };
  cooperative: {
    overview: {
      hubWard: string;
      regNumber: string;
      societyName: string;
      collectiveSubtitle: string;
      memberOwners: string;
      onActiveDuty: string;
      wardQuality: string;
      wardOperations: string;
      smartDemandTab: string;
      grievanceAlert: string;
      grievanceAlertDesc: string;
      activeJobs: string;
      newIncoming: string;
      workerOwners: string;
      democraticVoting: string;
      retainedReserve: string;
      coopSocialFund: string;
      reviews: string;
      positiveRating: string;
      cooperativeOperations: string;
      enrollMember: string;
      enrollMemberDesc: string;
      peerCouncil: string;
      peerCouncilDesc: string;
      smartSuiteBadge: string;
      predictiveModel: string;
      aiHeadline: string;
      aiDescription: string;
      hourlyDemandTitle: string;
      next12Hours: string;
      technicianShortfall: string;
      adequateCapacity: string;
      activeVsRecommended: string;
      crossWardTitle: string;
      autoRebalanceBtn: string;
      assigned: string;
      utilization: string;
      platformGovTitle: string;
      platformGovDesc: string;
    };
    members: {
      title: string;
      subtitle: string;
      enrollWorkerBtn: string;
      searchPlaceholder: string;
      activeShift: string;
      offShift: string;
      jobsDone: string;
      baseVisit: string;
      equalShareholder: string;
      addModalTitle: string;
      fullName: string;
      trade: string;
      phone: string;
      locality: string;
      baseFee: string;
      shareNotice: string;
      cancelBtn: string;
      confirmBtn: string;
    };
    bookings: {
      title: string;
      subtitle: string;
      totalLogs: string;
      searchPlaceholder: string;
      toCoop: string;
      promptAcceptHub: string;
      reassignBtn: string;
      activeExecution: string;
      markDoneBtn: string;
      noMatch: string;
    };
    disputes: {
      title: string;
      subtitle: string;
      pendingCount: string;
      noGrievances: string;
      customerComplaint: string;
      workerStatement: string;
      councilRuling: string;
      remediationLabel: string;
      remediationPlaceholder: string;
      approveRemedyBtn: string;
      recordRulingBtn: string;
    };
    reviews: {
      title: string;
      subtitle: string;
      avgScore: string;
      punctuality: string;
      fairInvoicing: string;
      disputeRate: string;
      searchPlaceholder: string;
      verifiedClient: string;
    };
  };
  notifications: {
    title: string;
    updates: string;
    markAllRead: string;
    emptyText: string;
    tapToView: string;
  };
  roleSelect: {
    title: string;
    subtitle: string;
    customerTitle: string;
    customerSub: string;
    customerDesc: string;
    workerTitle: string;
    workerSub: string;
    workerDesc: string;
    coopTitle: string;
    coopSub: string;
    coopDesc: string;
    activeBadge: string;
    switchBtn: string;
  };
  common: {
    cancel: string;
    close: string;
    submit: string;
    confirm: string;
    hours: string;
    mins: string;
    total: string;
    viewAll: string;
  };
}

export const mobileTranslations: Record<AppLanguage, Translations> = {
  en: {
    tagline: 'Kaam bhi, Samman bhi.',
    brand: {
      name: 'Rojgar',
      tagline: 'Kaam bhi, Samman bhi.'
    },
    roles: {
      customer: 'Customer',
      worker: 'Worker-Owner',
      cooperative: 'Cooperative'
    },
    auth: {
      loginTitle: 'Welcome to Rojgar',
      signupTitle: 'Join the Rojgar Collective',
      loginTab: 'Log In',
      signupTab: 'Sign Up',
      chooseRole: 'Select Your Role',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Pooja Sharma',
      phone: 'Mobile Number',
      phonePlaceholder: '+91 98230 45671',
      locality: 'Ward Hub / Locality',
      localityPlaceholder: 'e.g. Kothrud, Pune',
      primaryTrade: 'Primary Trade / Skill',
      coopName: 'Cooperative Society Name',
      coopNamePlaceholder: 'e.g. Pune Central Electricians Co-operative',
      useDemoBtn: '⚡ Use Demo Profile (1-Tap)',
      loginBtn: 'Log In to Rojgar',
      signupBtn: 'Create Account & Continue',
      switchAccount: 'Switch Account',
      logout: 'Log Out',
      quickDemoNotice: 'No password needed. Select a role and tap Use Demo Profile for instant access.'
    },
    header: {
      title: 'Rojgar',
      roleActive: 'Active Role',
      switchRole: 'Switch Role',
      notifications: 'Activity Notifications',
      logout: 'Log Out',
      resetState: 'Reset App Data',
      resetConfirm: 'Reset all mock data to original defaults?'
    },
    tabs: {
      home: 'Home',
      book: 'Book',
      bookings: 'Bookings',
      invoices: 'Invoices',
      support: 'Support',
      jobs: 'Jobs',
      requests: 'Requests',
      reviews: 'Reviews',
      disputes: 'Disputes',
      profile: 'Profile',
      overview: 'Overview',
      members: 'Members'
    },
    trades: {
      all: 'All Trades',
      electrician: 'Electrician',
      plumber: 'Plumber',
      carpenter: 'Carpenter',
      cleaning: 'Deep Cleaning',
      painting: 'Painter',
      appliances: 'Appliance Repair'
    },
    statuses: {
      requested: 'Waiting for Worker',
      accepted: 'Confirmed (En Route)',
      in_progress: 'Work In Progress',
      completed: 'Completed',
      disputed: 'Under Dispute',
      declined: 'Declined',
      expired: 'Expired'
    },
    customer: {
      home: {
        greeting: 'Namaste,',
        wardHub: 'Ward Hub:',
        zone: 'Co-op Zone 4',
        waitingWorker: 'Waiting for Worker Confirmation',
        workerEnRoute: 'Worker En Route',
        workUnderway: 'Work Underway',
        trackStatus: 'Track Live Status & Timeline',
        quickActions: 'Quick Actions',
        bookWorker: 'Book Worker',
        myBookings: 'My Bookings',
        raiseDispute: 'Raise Dispute',
        nearbyWorkers: 'Nearby Verified Co-op Workers',
        viewAll: 'View all',
        jobsDone: 'jobs',
        minsAway: 'mins away',
        requestBtn: 'Request',
        guaranteeTitle: 'Rojgar Cooperative Guarantee',
        guaranteePoint1: '88% Direct Payout to Worker',
        guaranteePoint2: 'Zero Middleman Surge Fees',
        guaranteePoint3: '30-Day Free Rework Warranty',
        guaranteePoint4: '100% Police Verified Members'
      },
      book: {
        selectWardHub: 'Select Ward Hub',
        searchPlaceholder: 'Search worker name, skill, or cooperative...',
        workersNearbyCount: '{count} Verified Co-op Workers Nearby',
        sortedBy: 'Sorted by Distance & ETA',
        coopBadge: 'Co-op',
        requestWorker: 'Request {name}',
        describeTask: 'Describe Task or Problem *',
        describeTaskPlaceholder: 'e.g. Living room switchboard sparking, need MCB inspection...',
        preferredSlot: 'Preferred Time Slot',
        slotImmediate: 'Immediate (within 30-45 mins)',
        slotAfternoon: 'Today, 2:00 PM - 3:00 PM',
        slotEvening: 'Today, 5:00 PM - 6:00 PM',
        slotTomorrow: 'Tomorrow Morning (9:00 AM - 11:00 AM)',
        serviceAddress: 'Service Address',
        transparentPricing: 'Transparent Cooperative Pricing',
        baseVisit: 'Base Visit & Inspection',
        coopSafetyFund: 'Cooperative Safety & Tool Fund',
        totalPayable: 'Total Payable (Escrow Protected)',
        escrowProtected: 'Escrow Protected',
        directPayoutNote: '₹{amount} (88%) goes directly to {name}\'s account',
        sendRequestBtn: 'Send Request (5-Min Window)',
        dispatchedTo: 'Dispatched to {name}',
        waitingConfirmation: 'Waiting for worker-owner confirmation. Zero penalty if worker is unavailable.',
        noPenalty: 'No cancellation fee charged.',
        taskLabel: 'Task:',
        slotLabel: 'Slot:',
        totalLabel: 'Total:',
        demoControls: 'Prototype Simulation Controls',
        demoAccept: '[✓ Accept]',
        demoDecline: '[✕ Decline]',
        demoExpire: '[⏱ Expire]'
      },
      bookings: {
        title: 'Your Service Bookings',
        subtitle: 'Track real-time arrival, lifecycle, and cooperative guarantees',
        filterAll: 'All ({count})',
        filterActive: 'Active',
        filterCompleted: 'Completed',
        filterDisputes: 'Disputes',
        emptyBookings: 'No bookings found in this category.',
        bookWorkerNow: 'Book a Worker Now',
        directPayoutPercent: '(88% direct)',
        serviceLifecycle: 'Service Lifecycle',
        stageSent: 'Sent',
        stageConfirmed: 'Confirmed',
        stageWork: 'Work',
        stageDone: 'Done',
        stageRated: 'Rated',
        demoWorkStarted: '[Demo: Simulate Work Started]',
        demoMarkCompleted: '[Demo: Simulate Mark Completed]',
        rateWorker: 'Rate & Review {name}',
        ratedScore: 'Rated {rating} / 5',
        raiseIssue: 'Raise Issue',
        reviewTitle: 'Review {name}',
        selectRating: 'Select Rating',
        feedbackLabel: 'Your Feedback / Comment',
        feedbackPlaceholder: 'Share feedback on arrival time, workmanship, cooperative fair pricing...',
        submitReview: 'Submit Verified Review'
      },
      invoices: {
        certifiedReceipts: 'Certified Cooperative Digital Receipts',
        headerTitle: 'Digital Invoices & Receipts',
        headerDesc: 'Transparent fee breakdowns with 0% platform extraction and 100% economic fairness.',
        emptyTitle: 'No invoices generated yet',
        emptyDesc: 'Complete a service booking to receive an official co-op invoice.',
        serviceBy: 'Service by: {name} ({trade})',
        workerPayout: 'Worker Payout (88% Take-Home):',
        welfareFund: 'Cooperative Welfare & Health Fund (12%):',
        platformFee: 'Platform Extraction Fee:',
        viewInvoiceBtn: 'View Official Co-op Tax Invoice',
        modalTitle: 'Certified Labor Co-op Invoice',
        billedTo: 'Billed To:',
        provider: 'Provider:',
        residentClient: 'Resident Client',
        serviceParticulars: 'Service Particulars',
        spareParts: 'Approved Spare Parts / Materials',
        platformCommission: 'Platform Service Commission (Zero Extortion)',
        zeroExtortion: '₹0.00 (Zero Extortion)',
        socialWelfarePool: 'Worker Social Welfare & Health Pool (12%)',
        totalAmountPaid: 'Total Amount Paid',
        paymentMode: 'Payment Mode:',
        refId: 'Ref / Txn ID:',
        downloadPdf: 'Download PDF Receipt',
        closeBtn: 'Close',
        downloadSuccess: 'Downloaded Receipt: {invoiceNumber}'
      },
      support: {
        title: 'Support & Grievance Council',
        subtitle: 'Democratically arbitrated dispute resolution with right-to-be-heard',
        councilBadge: 'Ward Dispute Council',
        bannerTitle: 'Have an issue with a booking?',
        bannerDesc: 'File a claim under our 30-day rework warranty.',
        raiseIssueBtn: 'Raise Issue',
        activeGrievances: 'Your Active Grievances ({count})',
        noDisputesTitle: 'No Open Disputes',
        noDisputesDesc: 'All your bookings are in good standing.',
        targetProfessional: 'Target Professional: {name} ({trade})',
        yourStatement: 'Your Grievance Statement:',
        workerResponse: '{name}\'s Response:',
        councilResolution: 'Ward Council Resolution:',
        emergencyTitle: 'Emergency Assistance',
        helplineTitle: 'Cooperative Toll-Free Helpline',
        helplineTiming: '1800-260-8900 (Mon–Sat, 8am–9pm)',
        callBtn: 'Call',
        wardHubCell: 'Pune Ward Hub Grievance Cell',
        wardHubAddress: 'Paud Road Central Ward Office',
        modalTitle: 'Raise a Grievance',
        modalSubtitle: 'Referred to the Elected Ward Dispute Council',
        selectBooking: 'Select Booking',
        describeIssue: 'Describe Issue or Claim',
        describeIssuePlaceholder: 'Explain what went wrong, e.g. repair didn\'t hold, late arrival, tariff question...',
        coopProtection: 'Cooperative Protection: You are backed by a 30-day rework warranty. The worker is contacted respectfully by their peers with zero automated platform fines.',
        submitGrievanceBtn: 'Submit to Ward Dispute Council'
      },
      reviews: {
        title: 'Your Reviews & Ratings',
        subtitle: 'Authentic feedback supporting worker-owner quality and cooperative dividends',
        totalReviews: 'Total Reviews Given',
        verified: 'Verified',
        coopImpact: 'Cooperative Impact',
        dividendAudited: 'Fair Dividend Audited',
        emptyTitle: 'You have not submitted any reviews yet.',
        viewCompletedBtn: 'View Completed Bookings'
      }
    },
    worker: {
      jobs: {
        dutyShiftActive: 'Duty Shift: Active',
        wardHub: 'Ward 14 • Kothrud Hub',
        directPayoutRate: '88% Direct Payout Rate',
        activeJobs: 'Active Jobs',
        todayNet: 'Today\'s Net',
        qualityScore: 'Quality Score',
        newRequestAlert: 'New Direct Request Waiting!',
        decisionWindowActive: '5-minute decision window active',
        reviewBtn: 'Review',
        filterActive: 'Active',
        filterCompleted: 'Completed',
        filterAll: 'All',
        emptyJobs: 'No active jobs assigned at the moment.',
        customer: 'Customer:',
        baseTariff: 'Base Tariff:',
        yourTakeHome: 'Your Take-Home (88%):',
        coopContribution: 'Co-op Reserve (12%):',
        startJobBtn: 'Start Job Execution',
        completeJobBtn: 'Mark Job Completed',
        completedBadge: 'Completed & Escrow Released'
      },
      requests: {
        title: 'Incoming Direct Requests',
        pendingCount: '{count} Pending',
        windowSubtitle: '5-minute prompt acceptance window',
        immediateRequest: 'Immediate Service Request',
        expiresIn: 'Decision Window: {timer}',
        customerAddress: 'Service Address:',
        taskDescription: 'Customer Task:',
        rateBreakdown: 'Cooperative Rate Breakdown',
        totalCustomerPaid: 'Total Customer Deposit:',
        directCredit: 'Direct Bank Credit (88%):',
        welfareShare: 'Ward Social Pool (12%):',
        acceptJobBtn: 'Accept Job (En Route)',
        declineJobBtn: 'Decline respectfully',
        simulateRequestBtn: '+ Simulate Incoming Customer Request',
        emptyRequests: 'No pending requests. You are active on the Ward 14 roster.'
      },
      reviews: {
        trustMetric: 'Cooperative Trust Metric',
        customerReputation: 'Customer Reputation',
        tierAVerified: 'Tier-A Verified',
        totalRatings: '{count} total ratings',
        recentCustomerFeedback: 'Recent Verified Feedback',
        verifiedBooking: 'Verified Service Booking'
      },
      disputes: {
        peerPanel: 'Peer Review Panel',
        disputeCases: 'Dispute Cases',
        disputesSubtitle: 'Democratic resolution without arbitrary account suspensions',
        noActiveDisputes: 'No active dispute claims against your profile.',
        allClearDesc: 'Your peer evaluation rating is in excellent standing.',
        claimDetails: 'Claim Details',
        yourStatement: 'Your Formal Statement:',
        yourResponse: 'Your Response:',
        peerCouncilRuling: 'Peer Council Ruling:',
        respondBtn: 'Respond to Claim',
        modalTitle: 'Submit Explanation to Council',
        provideExplanation: 'Provide your factual account of the service visit:',
        explanationPlaceholder: 'e.g. Arrived on time, tested internal wiring, replaced faulty breaker with client approval...',
        fairHearingNote: 'Your cooperative peer council evaluates both statements fairly with zero automated penalties.',
        submitResponseBtn: 'Submit Statement to Council'
      },
      profile: {
        coopOwner: 'Co-op Owner',
        memberId: 'Member ID: #PEM-14-042 • Joined March 2024',
        joinedDate: 'Joined March 2024',
        availabilityStatus: 'Availability Status',
        receivingRequests: 'Receiving direct booking requests nearby',
        pausedStatus: 'Paused (Off Duty / Busy)',
        governanceOverview: 'Cooperative Governance Rights',
        directTakeHome: 'Direct Take-Home',
        welfarePool: 'Health & Tool Pool',
        votingEquity: 'Equal Voting Equity',
        verifiedMemberSince: 'Verified Member Since 2024',
        contactVerification: 'Contact & Verification',
        phone: 'Phone:',
        societyHub: 'Society Hub:',
        wardArea: 'Ward 14 (Kothrud, Pune)',
        certifications: 'Skills & Certifications',
        safetyCertified: 'Safety Certified',
        verifiedSkill: 'Master Wireman License',
        resetAppDemo: 'Reset App Data (Clear Local State)'
      }
    },
    cooperative: {
      overview: {
        hubWard: 'Society Hub • Ward 14',
        regNumber: 'Reg # MH/COOP/2024/771',
        societyName: 'Pune Central Electricians Co-operative',
        collectiveSubtitle: 'Democratic Worker-Owned Ward Collective • Registered Primary Society',
        memberOwners: 'Member Owners',
        onActiveDuty: 'On Active Duty',
        wardQuality: 'Ward Quality',
        wardOperations: 'Ward Operations',
        smartDemandTab: 'Smart Demand Allocation',
        grievanceAlert: '{count} Customer Grievance Needs Ward Council Review',
        grievanceAlertDesc: 'Fair hearing with worker & customer',
        activeJobs: 'Active Jobs',
        newIncoming: '{count} new incoming',
        workerOwners: 'Worker Owners',
        democraticVoting: '100% democratic voting',
        retainedReserve: 'Retained Reserve',
        coopSocialFund: '12% co-op social fund',
        reviews: 'Reviews',
        positiveRating: '98.2% positive rating',
        cooperativeOperations: 'Cooperative Operations',
        enrollMember: 'Enroll Member',
        enrollMemberDesc: 'Add worker to co-op',
        peerCouncil: 'Peer Council',
        peerCouncilDesc: 'Mediate complaints',
        smartSuiteBadge: 'Smart Automation Suite',
        predictiveModel: 'Predictive Model v2.4',
        aiHeadline: 'AI Demand Forecasting & Dynamic Workforce Allocation',
        aiDescription: 'Equitably distributes workload across worker-owners and anticipates ward surges without predatory surge pricing or arbitrary deactivations.',
        hourlyDemandTitle: 'Ward 14 Hourly Demand Prediction',
        next12Hours: 'Next 12 Hours',
        technicianShortfall: '{count} Technician Shortfall',
        adequateCapacity: 'Adequate Capacity',
        activeVsRecommended: 'Active: {active} / Recommended: {recommended}',
        crossWardTitle: 'Cross-Ward Workforce Balancing',
        autoRebalanceBtn: 'Auto-Rebalance',
        assigned: 'Assigned: {count}',
        utilization: 'Utilization: {rate}%',
        platformGovTitle: 'Democratic Platform Governance',
        platformGovDesc: 'Unlike venture platforms extracting 25-35% commission with opaque automated deactivations, Rojgar cooperatives cap platform fees to real server costs, route 88% to worker-owners, and invest the remaining 12% in healthcare, pensions, and tool insurance.'
      },
      members: {
        title: 'Ward 14 Worker-Owners',
        subtitle: 'Democratic co-op roster with equal voting rights',
        enrollWorkerBtn: 'Enroll Worker',
        searchPlaceholder: 'Search member name or area...',
        activeShift: 'Active Shift',
        offShift: 'Off Shift',
        jobsDone: '{count} jobs done',
        baseVisit: 'Base Visit:',
        equalShareholder: 'Equal Voting Shareholder',
        addModalTitle: 'Enroll New Cooperative Member',
        fullName: 'Worker Full Name',
        trade: 'Primary Trade',
        phone: 'Phone Number',
        locality: 'Ward Hub / Locality',
        baseFee: 'Base Visit Fee (₹)',
        shareNotice: 'By enrolling, this worker receives 1 share of voting equity in the cooperative and full health/accident coverage.',
        cancelBtn: 'Cancel',
        confirmBtn: 'Confirm Admission'
      },
      bookings: {
        title: 'Ward Dispatch & Bookings',
        subtitle: 'Live monitoring of jobs across Ward 14',
        totalLogs: '{count} Total Logs',
        searchPlaceholder: 'Search booking, customer, or worker...',
        toCoop: '+₹{amount} to Co-op',
        promptAcceptHub: 'Prompt Accept as Hub',
        reassignBtn: 'Reassign',
        activeExecution: 'Active Field Execution',
        markDoneBtn: 'Mark Done',
        noMatch: 'No bookings match this filter'
      },
      disputes: {
        title: 'Ward 14 Peer Arbitration',
        subtitle: 'Democratically elected member review panel',
        pendingCount: '{count} Pending',
        noGrievances: 'No active grievances in Ward 14',
        customerComplaint: 'Customer Complaint',
        workerStatement: 'Worker Statement',
        councilRuling: 'Council Final Ruling',
        remediationLabel: 'Council Finding & Remediation:',
        remediationPlaceholder: 'e.g., Council verified original parts were used; granted ₹150 goodwill voucher from ward fund...',
        approveRemedyBtn: 'Approve Co-op Remedy',
        recordRulingBtn: 'Record Final Ruling'
      },
      reviews: {
        title: 'Ward Quality Feed',
        subtitle: 'Real customer ratings for Ward 14 worker-owners',
        avgScore: '{score} Avg',
        punctuality: 'Punctuality',
        fairInvoicing: 'Fair Invoicing',
        disputeRate: 'Dispute Rate',
        searchPlaceholder: 'Search customer, worker, or feedback...',
        verifiedClient: 'Verified Resident Client'
      }
    },
    notifications: {
      title: 'Activity Notifications',
      updates: '{role} portal updates',
      markAllRead: 'Mark all read',
      emptyText: 'No notifications at this moment.',
      tapToView: 'Tap to view details'
    },
    roleSelect: {
      title: 'Switch Role Profile',
      subtitle: 'Experience the Rojgar platform from any perspective',
      customerTitle: 'Customer Portal',
      customerSub: 'Household Service Requester',
      customerDesc: 'Discover verified workers, book with 5-minute confirmation, track status, and submit reviews.',
      workerTitle: 'Worker-Owner Portal',
      workerSub: 'Skilled Cooperative Member',
      workerDesc: 'Manage dispatched jobs, accept 5-minute requests, track reviews, and resolve customer disputes.',
      coopTitle: 'Cooperative Federation Portal',
      coopSub: 'Ward Society Administrator',
      coopDesc: 'Monitor member allocations, oversee fair pricing, mediate disputes, and manage social welfare pools.',
      activeBadge: 'Currently Active',
      switchBtn: 'Switch to this Profile'
    },
    common: {
      cancel: 'Cancel',
      close: 'Close',
      submit: 'Submit',
      confirm: 'Confirm',
      hours: 'hours',
      mins: 'mins',
      total: 'Total',
      viewAll: 'View all'
    }
  },

  hi: {
    tagline: 'काम भी, सम्मान भी।',
    brand: {
      name: 'Rojgar',
      tagline: 'काम भी, सम्मान भी।'
    },
    roles: {
      customer: 'ग्राहक',
      worker: 'श्रमिक-स्वामी',
      cooperative: 'सहकारी संस्था'
    },
    auth: {
      loginTitle: 'रोज़गार में आपका स्वागत है',
      signupTitle: 'रोज़गार सहकारी संघ से जुड़ें',
      loginTab: 'लॉग इन करें',
      signupTab: 'नया खाता बनाएँ',
      chooseRole: 'अपनी भूमिका चुनें',
      fullName: 'पूरा नाम',
      fullNamePlaceholder: 'उदा. पूजा शर्मा',
      phone: 'मोबाइल नंबर',
      phonePlaceholder: '+91 98230 45671',
      locality: 'वार्ड हब / इलाका',
      localityPlaceholder: 'उदा. कोथरूड, पुणे',
      primaryTrade: 'मुख्य कौशल / कार्य क्षेत्र',
      coopName: 'सहकारी समिति का नाम',
      coopNamePlaceholder: 'उदा. पुणे सेंट्रल इलेक्ट्रीशियन कोऑपरेटिव',
      useDemoBtn: '⚡ डेमो प्रोफ़ाइल उपयोग करें (1-टैप)',
      loginBtn: 'रोज़गार में प्रवेश करें',
      signupBtn: 'खाता बनाएँ और आगे बढ़ें',
      switchAccount: 'खाता बदलें',
      logout: 'लॉग आउट',
      quickDemoNotice: 'पासवर्ड की आवश्यकता नहीं है। भूमिका चुनें और तत्काल पहुँच के लिए डेमो प्रोफ़ाइल दबाएँ।'
    },
    header: {
      title: 'Rojgar',
      roleActive: 'सक्रिय भूमिका',
      switchRole: 'भूमिका बदलें',
      notifications: 'गतिविधि सूचनाएँ',
      logout: 'लॉग आउट',
      resetState: 'डेटा रीसेट करें',
      resetConfirm: 'क्या आप सभी डेटा को प्रारंभिक स्थिति में रीसेट करना चाहते हैं?'
    },
    tabs: {
      home: 'होम',
      book: 'कारीगर खोजें',
      bookings: 'बुकिंग्स',
      invoices: 'रसीदें',
      support: 'सहायता',
      jobs: 'कार्य',
      requests: 'अनुरोध',
      reviews: 'समीक्षाएँ',
      disputes: 'विवाद',
      profile: 'प्रोफ़ाइल',
      overview: 'अवलोकन',
      members: 'सदस्य'
    },
    trades: {
      all: 'सभी कार्य',
      electrician: 'इलेक्ट्रीशियन',
      plumber: 'प्लंबर',
      carpenter: 'बढ़ई',
      cleaning: 'सफाई विशेषज्ञ',
      painting: 'पेंटर',
      appliances: 'उपकरण मरम्मत'
    },
    statuses: {
      requested: 'कारीगर पुष्टि की प्रतीक्षा',
      accepted: 'पुष्टि हो चुकी (रास्ते में)',
      in_progress: 'कार्य प्रगति पर',
      completed: 'कार्य संपन्न',
      disputed: 'विवाद विचाराधीन',
      declined: 'अस्वीकृत',
      expired: 'समय समाप्त'
    },
    customer: {
      home: {
        greeting: 'नमस्ते,',
        wardHub: 'वार्ड हब:',
        zone: 'सहकारी ज़ोन 4',
        waitingWorker: 'कारीगर स्वीकृति की प्रतीक्षा',
        workerEnRoute: 'कारीगर रास्ते में हैं',
        workUnderway: 'कार्य चल रहा है',
        trackStatus: 'लाइव स्थिति व समय-रेखा देखें',
        quickActions: 'त्वरित सेवाएँ',
        bookWorker: 'कारीगर बुक करें',
        myBookings: 'मेरी बुकिंग्स',
        raiseDispute: 'शिकायत दर्ज करें',
        nearbyWorkers: 'पास के सत्यापित सहकारी श्रमिक-स्वामी',
        viewAll: 'सभी देखें',
        jobsDone: 'कार्य पूर्ण',
        minsAway: 'मिनट की दूरी',
        requestBtn: 'अनुरोध भेजें',
        guaranteeTitle: 'रोज़गार सहकारी सुरक्षा गारंटी',
        guaranteePoint1: '88% सीधा भुगतान कारीगर के खाते में',
        guaranteePoint2: 'शून्य बिचौलिया शुल्क',
        guaranteePoint3: '30-दिवसीय निःशुल्क पुनः कार्य वारंटी',
        guaranteePoint4: '100% पुलिस सत्यापित सदस्य'
      },
      book: {
        selectWardHub: 'वार्ड हब चुनें',
        searchPlaceholder: 'कारीगर का नाम, कौशल या सहकारी समिति खोजें...',
        workersNearbyCount: '{count} सत्यापित सहकारी कारीगर पास में उपलब्ध',
        sortedBy: 'दूरी व अनुमानित समय अनुसार क्रमबद्ध',
        coopBadge: 'सहकारी',
        requestWorker: '{name} को अनुरोध भेजें',
        describeTask: 'कार्य या समस्या का विवरण दें *',
        describeTaskPlaceholder: 'उदा. मुख्य स्विचबोर्ड में स्पार्किंग, एमसीबी जांच जरूरी है...',
        preferredSlot: 'सुविधाजनक समय स्लॉट',
        slotImmediate: 'तत्काल (30-45 मिनट में)',
        slotAfternoon: 'आज, दोपहर 2:00 - 3:00',
        slotEvening: 'आज, शाम 5:00 - 6:00',
        slotTomorrow: 'कल सुबह (9:00 - 11:00)',
        serviceAddress: 'सेवा का पता',
        transparentPricing: 'पारदर्शी सहकारी दर विवरण',
        baseVisit: 'मूल विज़िट व निरीक्षण शुल्क',
        coopSafetyFund: 'सहकारी सुरक्षा व उपकरण कोष',
        totalPayable: 'कुल देय राशि (एस्क्रो सुरक्षित)',
        escrowProtected: 'एस्क्रो सुरक्षित',
        directPayoutNote: '₹{amount} (88%) सीधे {name} के बैंक खाते में जाएगी',
        sendRequestBtn: 'अनुरोध भेजें (5-मिनट विंडो)',
        dispatchedTo: '{name} को अनुरोध भेजा गया',
        waitingConfirmation: 'श्रमिक-स्वामी की पुष्टि की प्रतीक्षा। अनुपलब्ध होने पर शून्य शुल्क।',
        noPenalty: 'कोई रद्दीकरण शुल्क नहीं काटा जाएगा।',
        taskLabel: 'कार्य:',
        slotLabel: 'समय:',
        totalLabel: 'कुल:',
        demoControls: 'प्रोटोटाइप अनुकरण नियंत्रण',
        demoAccept: '[✓ स्वीकारें]',
        demoDecline: '[✕ अस्वीकारें]',
        demoExpire: '[⏱ समाप्त]'
      },
      bookings: {
        title: 'आपकी सेवा बुकिंग्स',
        subtitle: 'रीयल-टाइम आगमन, जीवनचक्र व सहकारी गारंटी देखें',
        filterAll: 'सभी ({count})',
        filterActive: 'सक्रिय',
        filterCompleted: 'संपन्न',
        filterDisputes: 'विवाद',
        emptyBookings: 'इस श्रेणी में कोई बुकिंग नहीं मिली।',
        bookWorkerNow: 'अभी कारीगर बुक करें',
        directPayoutPercent: '(88% सीधा भुगतान)',
        serviceLifecycle: 'सेवा प्रगति क्रम',
        stageSent: 'भेजा गया',
        stageConfirmed: 'पुष्ट',
        stageWork: 'कार्य',
        stageDone: 'पूर्ण',
        stageRated: 'रेटिंग दी',
        demoWorkStarted: '[डेमो: कार्य आरंभ करें]',
        demoMarkCompleted: '[डेमो: कार्य संपन्न करें]',
        rateWorker: '{name} को रेटिंग व समीक्षा दें',
        ratedScore: 'रेटिंग {rating} / 5',
        raiseIssue: 'मुद्दा उठाएँ',
        reviewTitle: '{name} की समीक्षा करें',
        selectRating: 'रेटिंग चुनें',
        feedbackLabel: 'आपकी प्रतिक्रिया / टिप्पणी',
        feedbackPlaceholder: 'आगमन समय, कारीगरी व उचित मूल्य के बारे में बताएं...',
        submitReview: 'सत्यापित समीक्षा जमा करें'
      },
      invoices: {
        certifiedReceipts: 'सत्यापित सहकारी डिजिटल रसीदें',
        headerTitle: 'डिजिटल इनवॉइस व रसीदें',
        headerDesc: '0% बिचौलिया कटौती और 100% आर्थिक पारदर्शिता के साथ शुल्क विवरण।',
        emptyTitle: 'अभी तक कोई इनवॉइस नहीं बनी',
        emptyDesc: 'आधिकारिक सहकारी रसीद प्राप्त करने के लिए सेवा बुकिंग पूरी करें।',
        serviceBy: 'सेवा प्रदाता: {name} ({trade})',
        workerPayout: 'कारीगर भुगतान (88% हिस्सा):',
        welfareFund: 'सहकारी कल्याण व स्वास्थ्य कोष (12%):',
        platformFee: 'प्लेटफॉर्म निष्कर्षण शुल्क:',
        viewInvoiceBtn: 'आधिकारिक सहकारी टैक्स इनवॉइस देखें',
        modalTitle: 'प्रमाणित सहकारी सेवा इनवॉइस',
        billedTo: 'ग्राहक विवरण:',
        provider: 'सेवा प्रदाता:',
        residentClient: 'निवासी ग्राहक',
        serviceParticulars: 'सेवा विवरण',
        spareParts: 'स्वीकृत स्पेयर पार्ट्स / सामग्री',
        platformCommission: 'प्लेटफॉर्म कमीशन (शून्य वसूली)',
        zeroExtortion: '₹0.00 (शून्य वसूली)',
        socialWelfarePool: 'सामाजिक सुरक्षा व स्वास्थ्य निधि (12%)',
        totalAmountPaid: 'कुल भुगतान राशि',
        paymentMode: 'भुगतान माध्यम:',
        refId: 'संदर्भ / लेन-देन संख्या:',
        downloadPdf: 'पीडीएफ रसीद डाउनलोड करें',
        closeBtn: 'बंद करें',
        downloadSuccess: 'रसीद डाउनलोड की गई: {invoiceNumber}'
      },
      support: {
        title: 'सहायता एवं शिकायत निवारण परिषद',
        subtitle: 'पक्ष सुनने के लोकतांत्रिक अधिकार के साथ निष्पक्ष विवाद समाधान',
        councilBadge: 'वार्ड विवाद परिषद',
        bannerTitle: 'क्या किसी सेवा से समस्या है?',
        bannerDesc: 'हमारी 30-दिवसीय निःशुल्क पुनः कार्य वारंटी के तहत दावा दर्ज करें।',
        raiseIssueBtn: 'शिकायत दर्ज करें',
        activeGrievances: 'आपकी सक्रिय शिकायतें ({count})',
        noDisputesTitle: 'कोई सक्रिय विवाद नहीं है',
        noDisputesDesc: 'आपकी सभी बुकिंग्स संतोषजनक स्थिति में हैं।',
        targetProfessional: 'संबंधित पेशेवर: {name} ({trade})',
        yourStatement: 'आपका शिकायत विवरण:',
        workerResponse: '{name} का उत्तर:',
        councilResolution: 'वार्ड परिषद का निर्णय:',
        emergencyTitle: 'आपातकालीन सहायता',
        helplineTitle: 'सहकारी टोल-फ्री हेल्पलाइन',
        helplineTiming: '1800-260-8900 (सोम-शनि, सुबह 8 - रात 9)',
        callBtn: 'कॉल करें',
        wardHubCell: 'पुणे वार्ड हब शिकायत निवारण कक्ष',
        wardHubAddress: 'पौड रोड सेंट्रल वार्ड कार्यालय',
        modalTitle: 'शिकायत दर्ज करें',
        modalSubtitle: 'निर्वाचित वार्ड विवाद परिषद को प्रेषित',
        selectBooking: 'बुकिंग चुनें',
        describeIssue: 'समस्या या दावे का विवरण दें',
        describeIssuePlaceholder: 'विस्तार से बताएं, उदा. मरम्मत ठीक से नहीं हुई, देरी से आए...',
        coopProtection: 'सहकारी सुरक्षा: आपको 30-दिवसीय पुनः कार्य गारंटी प्राप्त है। कारीगर से उनके साथी सम्मानपूर्वक संपर्क करते हैं, बिना किसी मनमाने जुर्माने के।',
        submitGrievanceBtn: 'वार्ड विवाद परिषद को भेजें'
      },
      reviews: {
        title: 'आपकी समीक्षाएं एवं रेटिंग्स',
        subtitle: 'श्रमिक-स्वामियों की गुणवत्ता व सहकारी लाभांश को सुदृढ़ करने वाली प्रामाणिक प्रतिक्रिया',
        totalReviews: 'कुल दी गई समीक्षाएं',
        verified: 'सत्यापित',
        coopImpact: 'सहकारी प्रभाव',
        dividendAudited: 'उचित लाभांश ऑडिटेड',
        emptyTitle: 'आपने अभी तक कोई समीक्षा नहीं दी है।',
        viewCompletedBtn: 'पूर्ण बुकिंग्स देखें'
      }
    },
    worker: {
      jobs: {
        dutyShiftActive: 'ड्यूटी शिफ्ट: सक्रिय',
        wardHub: 'वार्ड 14 • कोथरूड हब',
        directPayoutRate: '88% सीधा बैंक भुगतान',
        activeJobs: 'सक्रिय कार्य',
        todayNet: 'आज की शुद्ध आय',
        qualityScore: 'गुणवत्ता स्कोर',
        newRequestAlert: 'नया सीधा अनुरोध प्रतीक्षारत!',
        decisionWindowActive: '5-मिनट निर्णय विंडो सक्रिय है',
        reviewBtn: 'देखें',
        filterActive: 'सक्रिय',
        filterCompleted: 'संपन्न',
        filterAll: 'सभी',
        emptyJobs: 'इस समय कोई सक्रिय कार्य आवंटित नहीं है।',
        customer: 'ग्राहक:',
        baseTariff: 'मूल दर:',
        yourTakeHome: 'आपकी आय (88%):',
        coopContribution: 'सहकारी रिज़र्व (12%):',
        startJobBtn: 'कार्य शुरू करें',
        completeJobBtn: 'कार्य पूर्ण मार्क करें',
        completedBadge: 'कार्य संपन्न व राशि हस्तांतरित'
      },
      requests: {
        title: 'आने वाले सीधे अनुरोध',
        pendingCount: '{count} प्रतीक्षारत',
        windowSubtitle: '5-मिनट त्वरित स्वीकृति विंडो',
        immediateRequest: 'तत्काल सेवा अनुरोध',
        expiresIn: 'निर्णय समय शेष: {timer}',
        customerAddress: 'सेवा का पता:',
        taskDescription: 'ग्राहक का कार्य:',
        rateBreakdown: 'सहकारी दर विभाजन',
        totalCustomerPaid: 'ग्राहक कुल जमा:',
        directCredit: 'सीधा बैंक क्रेडिट (88%):',
        welfareShare: 'वार्ड कल्याण निधि (12%):',
        acceptJobBtn: 'कार्य स्वीकारें (रास्ते में)',
        declineJobBtn: 'ससम्मान अस्वीकारें',
        simulateRequestBtn: '+ ग्राहक अनुरोध का अनुकरण करें',
        emptyRequests: 'कोई नया अनुरोध लंबित नहीं है। आप वार्ड 14 में सक्रिय हैं।'
      },
      reviews: {
        trustMetric: 'सहकारी विश्वसनीयता पैमाना',
        customerReputation: 'ग्राहक प्रतिष्ठा',
        tierAVerified: 'टियर-ए सत्यापित',
        totalRatings: 'कुल {count} रेटिंग्स',
        recentCustomerFeedback: 'हालिया सत्यापित ग्राहक प्रतिक्रिया',
        verifiedBooking: 'सत्यापित सेवा बुकिंग'
      },
      disputes: {
        peerPanel: 'साथी समीक्षा समिति',
        disputeCases: 'विवाद प्रकरण',
        disputesSubtitle: 'बिना मनमाने निलंबन के लोकतांत्रिक समाधान',
        noActiveDisputes: 'आपकी प्रोफ़ाइल पर कोई सक्रिय शिकायत नहीं है।',
        allClearDesc: 'आपका साथी मूल्यांकन स्कोर उत्कृष्ट स्थिति में है।',
        claimDetails: 'दावा विवरण',
        yourStatement: 'आपका आधिकारिक पक्ष:',
        yourResponse: 'आपका उत्तर:',
        peerCouncilRuling: 'परिषद का निर्णय:',
        respondBtn: 'शिकायत का उत्तर दें',
        modalTitle: 'परिषद के समक्ष अपना पक्ष रखें',
        provideExplanation: 'सेवा विज़िट का तथ्यात्मक विवरण लिखें:',
        explanationPlaceholder: 'उदा. समय पर पहुंचा, वायरिंग की जांच की, ग्राहक की सहमति से नया ब्रेकर लगाया...',
        fairHearingNote: 'आपकी सहकारी साथी परिषद दोनों पक्षों को निष्पक्ष रूप से सुनती है।',
        submitResponseBtn: 'परिषद को वक्तव्य भेजें'
      },
      profile: {
        coopOwner: 'सहकारी स्वामी',
        memberId: 'सदस्य आईडी: #PEM-14-042 • सदस्यता मार्च 2024',
        joinedDate: 'मार्च 2024 से सदस्य',
        availabilityStatus: 'उपलब्धता स्थिति',
        receivingRequests: 'आस-पास से सीधे सेवा अनुरोध प्राप्त कर रहे हैं',
        pausedStatus: 'विश्राम पर (ऑफ ड्यूटी / व्यस्त)',
        governanceOverview: 'सहकारी शासन व अधिकार',
        directTakeHome: 'सीधा पारिश्रमिक',
        welfarePool: 'स्वास्थ्य व उपकरण बीमा',
        votingEquity: 'समान मताधिकार शेयर',
        verifiedMemberSince: '2024 से सत्यापित सदस्य',
        contactVerification: 'संपर्क व सत्यापन',
        phone: 'फ़ोन:',
        societyHub: 'सोसायटी हब:',
        wardArea: 'वार्ड 14 (कोथरूड, पुणे)',
        certifications: 'कौशल व प्रमाणपत्र',
        safetyCertified: 'सुरक्षा प्रमाणित',
        verifiedSkill: 'मास्टर वायरमैन लाइसेंस',
        resetAppDemo: 'ऐप डेटा रीसेट करें (लोकल स्टेट साफ़ करें)'
      }
    },
    cooperative: {
      overview: {
        hubWard: 'सोसायटी हब • वार्ड 14',
        regNumber: 'पंजीयन संख्या: MH/COOP/2024/771',
        societyName: 'पुणे सेंट्रल इलेक्ट्रीशियन कोऑपरेटिव',
        collectiveSubtitle: 'श्रमिक-स्वामित्व वाली लोकतांत्रिक वार्ड संस्था • पंजीकृत प्राथमिक समिति',
        memberOwners: 'सदस्य स्वामी',
        onActiveDuty: 'सक्रिय ड्यूटी पर',
        wardQuality: 'वार्ड गुणवत्ता',
        wardOperations: 'वार्ड संचालन',
        smartDemandTab: 'स्मार्ट मांग आवंटन',
        grievanceAlert: '{count} ग्राहक शिकायत पर वार्ड परिषद की समीक्षा आवश्यक है',
        grievanceAlertDesc: 'कारीगर व ग्राहक दोनों की निष्पक्ष सुनवाई',
        activeJobs: 'सक्रिय कार्य',
        newIncoming: '{count} नए आने वाले',
        workerOwners: 'श्रमिक-स्वामी',
        democraticVoting: '100% लोकतांत्रिक मतदान',
        retainedReserve: 'संचित रिज़र्व निधि',
        coopSocialFund: '12% सहकारी सामाजिक कोष',
        reviews: 'समीक्षाएँ',
        positiveRating: '98.2% सकारात्मक रेटिंग',
        cooperativeOperations: 'सहकारी संचालन',
        enrollMember: 'सदस्य जोड़ें',
        enrollMemberDesc: 'नए कारीगर को शामिल करें',
        peerCouncil: 'साथी परिषद',
        peerCouncilDesc: 'शिकायतों की मध्यस्थता करें',
        smartSuiteBadge: 'स्मार्ट ऑटोमेशन सूट',
        predictiveModel: 'पूर्वानुमान मॉडल v2.4',
        aiHeadline: 'एआई मांग पूर्वानुमान एवं गतिशील कार्यबल आवंटन',
        aiDescription: 'श्रमिक-स्वामियों में कार्य का समान वितरण करता है और बिना किसी अत्यधिक सर्ज मूल्य के मांग की पूर्ति सुनिश्चित करता है।',
        hourlyDemandTitle: 'वार्ड 14 प्रति घंटा मांग पूर्वानुमान',
        next12Hours: 'अगले 12 घंटे',
        technicianShortfall: '{count} तकनीशियन की कमी',
        adequateCapacity: 'पर्याप्त क्षमता उपलब्ध',
        activeVsRecommended: 'सक्रिय: {active} / अनुशंसित: {recommended}',
        crossWardTitle: 'अंतर-वार्ड कार्यबल संतुलन',
        autoRebalanceBtn: 'स्वतः संतुलन करें',
        assigned: 'आवंटित: {count}',
        utilization: 'उपयोग दर: {rate}%',
        platformGovTitle: 'लोकतांत्रिक प्लेटफॉर्म शासन',
        platformGovDesc: '25-35% कमीशन वसूलने वाली निजी कंपनियों के विपरीत, रोज़गार सहकारी संस्थाएँ केवल वास्तविक सर्वर लागत लेती हैं, 88% सीधे कामगार को देती हैं और 12% स्वास्थ्य, पेंशन और टूल बीमा में निवेश करती हैं।'
      },
      members: {
        title: 'वार्ड 14 श्रमिक-स्वामी सूची',
        subtitle: 'समान मताधिकार के साथ लोकतांत्रिक सहकारी रोस्टर',
        enrollWorkerBtn: 'कारीगर नामांकित करें',
        searchPlaceholder: 'सदस्य का नाम या क्षेत्र खोजें...',
        activeShift: 'सक्रिय शिफ्ट',
        offShift: 'ऑफ शिफ्ट',
        jobsDone: '{count} कार्य पूर्ण',
        baseVisit: 'मूल विज़िट शुल्क:',
        equalShareholder: 'समान मताधिकार शेयरधारक',
        addModalTitle: 'नए सहकारी सदस्य का नामांकन',
        fullName: 'कारीगर का पूरा नाम',
        trade: 'मुख्य कौशल',
        phone: 'फ़ोन नंबर',
        locality: 'वार्ड हब / इलाका',
        baseFee: 'मूल विज़िट शुल्क (₹)',
        shareNotice: 'नामांकन के साथ, इस कारीगर को सहकारी समिति में 1 वोटिंग शेयर तथा पूर्ण स्वास्थ्य/दुर्घटना कवर प्राप्त होता है।',
        cancelBtn: 'रद्द करें',
        confirmBtn: 'नामांकन स्वीकृत करें'
      },
      bookings: {
        title: 'वार्ड प्रेषण व बुकिंग्स',
        subtitle: 'वार्ड 14 के सभी कार्यों की लाइव निगरानी',
        totalLogs: 'कुल {count} रिकॉर्ड्स',
        searchPlaceholder: 'बुकिंग, ग्राहक या कारीगर खोजें...',
        toCoop: '+₹{amount} समिति कोष में',
        promptAcceptHub: 'हब की ओर से स्वीकारें',
        reassignBtn: 'पुनर्आवंटित करें',
        activeExecution: 'कार्य जारी है',
        markDoneBtn: 'पूर्ण चिह्नित करें',
        noMatch: 'इस फ़िल्टर से कोई बुकिंग मेल नहीं खाती'
      },
      disputes: {
        title: 'वार्ड 14 साथी मध्यस्थता परिषद',
        subtitle: 'लोकतांत्रिक रूप से निर्वाचित सदस्य समीक्षा समिति',
        pendingCount: '{count} लंबित',
        noGrievances: 'वार्ड 14 में कोई सक्रिय शिकायत नहीं है',
        customerComplaint: 'ग्राहक की शिकायत',
        workerStatement: 'कारीगर का वक्तव्य',
        councilRuling: 'परिषद का अंतिम निर्णय',
        remediationLabel: 'परिषद का निष्कर्ष व समाधान:',
        remediationPlaceholder: 'उदा. परिषद ने जांच की कि मूल पुर्जे इस्तेमाल हुए; वार्ड फंड से ₹150 वाउचर दिया गया...',
        approveRemedyBtn: 'सहकारी समाधान स्वीकृत करें',
        recordRulingBtn: 'अंतिम निर्णय दर्ज करें'
      },
      reviews: {
        title: 'वार्ड गुणवत्ता फ़ीड',
        subtitle: 'वार्ड 14 के श्रमिक-स्वामियों के लिए वास्तविक ग्राहक रेटिंग',
        avgScore: '{score} औसत',
        punctuality: 'समयबद्धता',
        fairInvoicing: 'उचित बिलिंग',
        disputeRate: 'विवाद दर',
        searchPlaceholder: 'ग्राहक, कारीगर या प्रतिक्रिया खोजें...',
        verifiedClient: 'सत्यापित निवासी ग्राहक'
      }
    },
    notifications: {
      title: 'गतिविधि सूचनाएँ',
      updates: '{role} पोर्टल अपडेट',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      emptyText: 'इस समय कोई सूचना नहीं है।',
      tapToView: 'विवरण देखने के लिए टैप करें'
    },
    roleSelect: {
      title: 'भूमिका प्रोफ़ाइल बदलें',
      subtitle: 'रोज़गार मंच को किसी भी दृष्टिकोण से अनुभव करें',
      customerTitle: 'ग्राहक पोर्टल',
      customerSub: 'घरेलू सेवा अनुरोधकर्ता',
      customerDesc: 'सत्यापित कारीगर खोजें, 5-मिनट में बुकिंग पक्की करें और समीक्षाएं साझा करें।',
      workerTitle: 'श्रमिक-स्वामी पोर्टल',
      workerSub: 'कुशल सहकारी सदस्य',
      workerDesc: 'आवंटित कार्य प्रबंधित करें, 5-मिनट में अनुरोध स्वीकारें और विवाद सुलझाएं।',
      coopTitle: 'सहकारी महासंघ पोर्टल',
      coopSub: 'वार्ड समिति प्रशासक',
      coopDesc: 'कार्यबल आवंटन पर नज़र रखें, उचित मूल्य सुनिश्चित करें और सामाजिक कोष प्रबंधित करें।',
      activeBadge: 'वर्तमान सक्रिय',
      switchBtn: 'इस प्रोफ़ाइल पर जाएँ'
    },
    common: {
      cancel: 'रद्द करें',
      close: 'बंद करें',
      submit: 'जमा करें',
      confirm: 'पुष्टि करें',
      hours: 'घंटे',
      mins: 'मिनट',
      total: 'कुल',
      viewAll: 'सभी देखें'
    }
  },

  mr: {
    tagline: 'कामही, सन्मानही.',
    brand: {
      name: 'Rojgar',
      tagline: 'कामही, सन्मानही.'
    },
    roles: {
      customer: 'ग्राहक',
      worker: 'कामगार-मालक',
      cooperative: 'सहकारी संस्था'
    },
    auth: {
      loginTitle: 'रोजगार मध्ये आपले स्वागत आहे',
      signupTitle: 'रोजगार सहकारी चळवळीत सहभागी व्हा',
      loginTab: 'लॉग इन करा',
      signupTab: 'नोंदणी करा',
      chooseRole: 'आपली भूमिका निवडा',
      fullName: 'पूर्ण नाव',
      fullNamePlaceholder: 'उदा. पूजा शर्मा',
      phone: 'मोबाइल नंबर',
      phonePlaceholder: '+91 98230 45671',
      locality: 'वॉर्ड हब / परिसर',
      localityPlaceholder: 'उदा. कोथरूड, पुणे',
      primaryTrade: 'मुख्य व्यवसाय / कौशल्य',
      coopName: 'सहकारी संस्थेचे नाव',
      coopNamePlaceholder: 'उदा. पुणे सेंट्रल इलेक्ट्रिशियन को-ऑपरेटिव्ह',
      useDemoBtn: '⚡ डेमो प्रोफाइल वापरा (1-टॅप)',
      loginBtn: 'रोजगार मध्ये प्रवेश करा',
      signupBtn: 'खाते तयार करा आणि पुढे जा',
      switchAccount: 'खाते बदला',
      logout: 'लॉग आउट',
      quickDemoNotice: 'पासवर्डची आवश्यकता नाही. भूमिका निवडा आणि त्वरित प्रवेशासाठी डेमो प्रोफाइल दाबा.'
    },
    header: {
      title: 'Rojgar',
      roleActive: 'सक्रिय भूमिका',
      switchRole: 'भूमिका बदला',
      notifications: 'सूचना व अपडेट्स',
      logout: 'लॉग आउट',
      resetState: 'डेटा रीसेट करा',
      resetConfirm: 'सर्व डेटा मूळ स्थितीत रीसेट करायचा आहे का?'
    },
    tabs: {
      home: 'मुख्यपृष्ठ',
      book: 'कामगार शोधा',
      bookings: 'बुकिंग्ज',
      invoices: 'पावत्या',
      support: 'मदत व तक्रार',
      jobs: 'कामे',
      requests: 'मागण्या',
      reviews: 'अभिप्राय',
      disputes: 'तक्रारी',
      profile: 'प्रोफाइल',
      overview: 'आढावा',
      members: 'सभासद'
    },
    trades: {
      all: 'सर्व व्यवसाय',
      electrician: 'इलेक्ट्रिशियन',
      plumber: 'प्लंबर',
      carpenter: 'सुतार',
      cleaning: 'स्वच्छता तज्ज्ञ',
      painting: 'रंगारी (पेंटर)',
      appliances: 'उपकरण दुरुस्ती'
    },
    statuses: {
      requested: 'कामगार पुष्टीची प्रतीक्षा',
      accepted: 'निश्चित झाले (मार्गावर)',
      in_progress: 'काम प्रगतीपथावर',
      completed: 'काम पूर्ण झाले',
      disputed: 'तक्रार निवारणाधीन',
      declined: 'नाकारले',
      expired: 'वेळ संपली'
    },
    customer: {
      home: {
        greeting: 'नमस्ते,',
        wardHub: 'वॉर्ड हब:',
        zone: 'सहकारी झोन 4',
        waitingWorker: 'कामगार पुष्टीची प्रतीक्षा',
        workerEnRoute: 'कामगार मार्गावर आहेत',
        workUnderway: 'काम सुरू आहे',
        trackStatus: 'थेट स्थिती आणि प्रगती पहा',
        quickActions: 'त्वरित सेवा',
        bookWorker: 'कामगार बुक करा',
        myBookings: 'माझ्या बुकिंग्ज',
        raiseDispute: 'तक्रार नोंदवा',
        nearbyWorkers: 'परिसरातील पडताळणी केलेले सहकारी कामगार-मालक',
        viewAll: 'सर्व पहा',
        jobsDone: 'कामे पूर्ण',
        minsAway: 'मिनिटांच्या अंतरावर',
        requestBtn: 'मागणी पाठवा',
        guaranteeTitle: 'रोजगार सहकारी हमी योजना',
        guaranteePoint1: '88% थेट मोबदला कामगाराच्या खात्यात',
        guaranteePoint2: 'शून्य मध्यस्थ अतिरिक्त शुल्क',
        guaranteePoint3: '30 दिवसांची मोफत फेरकाम वॉरंटी',
        guaranteePoint4: '100% पोलीस पडताळणी केलेले सभासद'
      },
      book: {
        selectWardHub: 'वॉर्ड हब निवडा',
        searchPlaceholder: 'कामगाराचे नाव, कौशल्य किंवा संस्था शोधा...',
        workersNearbyCount: '{count} पडताळणी केलेले सहकारी कामगार जवळ उपलब्ध',
        sortedBy: 'अंतर आणि अंदाजे वेळेनुसार क्रमबद्ध',
        coopBadge: 'सहकारी',
        requestWorker: '{name} यांना मागणी पाठवा',
        describeTask: 'कामाचे किंवा समस्येचे स्वरूप सांगा *',
        describeTaskPlaceholder: 'उदा. बैठकीच्या खोलीतील स्विचबोर्ड स्पार्क होत आहे, दुरुस्ती हवी आहे...',
        preferredSlot: 'सोयीची वेळ',
        slotImmediate: 'तातडीने (30-45 मिनिटांत)',
        slotAfternoon: 'आज दुपारी 2:00 ते 3:00',
        slotEvening: 'आज संध्याकाळी 5:00 ते 6:00',
        slotTomorrow: 'उद्या सकाळी (9:00 ते 11:00)',
        serviceAddress: 'सेवेचा पत्ता',
        transparentPricing: 'पारदर्शक सहकारी दरपत्रक',
        baseVisit: 'मूळ भेट व तपासणी शुल्क',
        coopSafetyFund: 'सहकारी सुरक्षा व साधन निधी',
        totalPayable: 'एकूण देय रक्कम (एस्क्रो सुरक्षित)',
        escrowProtected: 'एस्क्रो सुरक्षित',
        directPayoutNote: '₹{amount} (88%) थेट {name} यांच्या बँक खात्यात जमा होईल',
        sendRequestBtn: 'मागणी पाठवा (5 मिनिटांची मुदत)',
        dispatchedTo: '{name} यांना मागणी पाठवली',
        waitingConfirmation: 'कामगार-मालकाच्या पुष्टीची प्रतीक्षा. कामगार उपलब्ध नसल्यास शून्य शुल्क.',
        noPenalty: 'कोणताही रद्द करण्याचा भुर्दंड आकारला जाणार नाही.',
        taskLabel: 'काम:',
        slotLabel: 'वेळ:',
        totalLabel: 'एकूण:',
        demoControls: 'प्रोटोटाइप सिम्युलेशन नियंत्रणे',
        demoAccept: '[✓ स्वीकारा]',
        demoDecline: '[✕ नाकारा]',
        demoExpire: '[⏱ मुदत संपली]'
      },
      bookings: {
        title: 'आपल्या सेवा बुकिंग्ज',
        subtitle: 'कामगाराचे आगमन, टप्पे आणि सहकारी हमी थेट तपासा',
        filterAll: 'सर्व ({count})',
        filterActive: 'सक्रिय',
        filterCompleted: 'पूर्ण झालेली',
        filterDisputes: 'तक्रारी',
        emptyBookings: 'या प्रकारात कोणतीही बुकिंग आढळली नाही.',
        bookWorkerNow: 'कामगार बुक करा',
        directPayoutPercent: '(88% थेट)',
        serviceLifecycle: 'सेवा प्रगती टप्पे',
        stageSent: 'पाठवले',
        stageConfirmed: 'निश्चित',
        stageWork: 'काम',
        stageDone: 'पूर्ण',
        stageRated: 'रेटिंग',
        demoWorkStarted: '[डेमो: काम सुरू झाले]',
        demoMarkCompleted: '[डेमो: काम पूर्ण झाल्याची नोंद करा]',
        rateWorker: '{name} यांना अभिप्राय व रेटिंग द्या',
        ratedScore: 'रेटिंग {rating} / 5',
        raiseIssue: 'तक्रार नोंदवा',
        reviewTitle: '{name} यांचा अभिप्राय',
        selectRating: 'रेटिंग निवडा',
        feedbackLabel: 'आपला अभिप्राय / टिप्पणी',
        feedbackPlaceholder: 'कामाचा दर्जा, वक्तशीरपणा आणि रास्त दराविषयी सांगा...',
        submitReview: 'पडताळलेला अभिप्राय सादर करा'
      },
      invoices: {
        certifiedReceipts: 'प्रमाणित सहकारी डिजिटल पावत्या',
        headerTitle: 'डिजिटल इनव्हॉइस आणि पावत्या',
        headerDesc: 'शून्य टक्के नफेखोरी आणि 100% पारदर्शकतेसह दराचा तपशील.',
        emptyTitle: 'अद्याप कोणतीही पावती तयार झालेली नाही',
        emptyDesc: 'अधिकृत सहकारी पावती मिळवण्यासाठी सेवा बुकिंग पूर्ण करा.',
        serviceBy: 'सेवा प्रदाता: {name} ({trade})',
        workerPayout: 'कामगार मोबदला (88% हिस्सा):',
        welfareFund: 'सहकारी कल्याण व आरोग्य निधी (12%):',
        platformFee: 'प्लॅटफॉर्म मध्यस्थ शुल्क:',
        viewInvoiceBtn: 'अधिकृत सहकारी कर पावती पहा',
        modalTitle: 'प्रमाणित कामगार सहकार कर पावती',
        billedTo: 'ग्राहकाचे नाव:',
        provider: 'सेवा प्रदाता:',
        residentClient: 'स्थानिक रहिवासी',
        serviceParticulars: 'सेवेचा तपशील',
        spareParts: 'मंजूर सुटे भाग / साहित्य',
        platformCommission: 'प्लॅटफॉर्म सेवा शुल्क (शून्य लूट)',
        zeroExtortion: '₹0.00 (शून्य लूट)',
        socialWelfarePool: 'कामगार सामाजिक सुरक्षा व आरोग्य निधी (12%)',
        totalAmountPaid: 'एकूण भरलेली रक्कम',
        paymentMode: 'पेमेंट प्रकार:',
        refId: 'संदर्भ / व्यवहार क्रमांक:',
        downloadPdf: 'पीडीएफ पावती डाउनलोड करा',
        closeBtn: 'बंद करा',
        downloadSuccess: 'पावती डाउनलोड केली: {invoiceNumber}'
      },
      support: {
        title: 'सहाय्य आणि तक्रार निवारण परिषद',
        subtitle: 'लोकशाही तत्त्वावर दोन्ही बाजू ऐकून घेऊन निष्पक्ष निवारण',
        councilBadge: 'वॉर्ड तक्रार निवारण परिषद',
        bannerTitle: 'काही कामाबाबत तक्रार आहे का?',
        bannerDesc: 'आमच्या 30 दिवसांच्या फेरकाम हमीअंतर्गत दावा दाखल करा.',
        raiseIssueBtn: 'तक्रार नोंदवा',
        activeGrievances: 'आपल्या सक्रिय तक्रारी ({count})',
        noDisputesTitle: 'कोणतीही प्रलंबित तक्रार नाही',
        noDisputesDesc: 'आपली सर्व कामे समाधानकारक स्थितीत आहेत.',
        targetProfessional: 'संबंधित कारागीर: {name} ({trade})',
        yourStatement: 'आपली तक्रार:',
        workerResponse: '{name} यांचे उत्तर:',
        councilResolution: 'वॉर्ड परिषदेचा निर्णय:',
        emergencyTitle: 'तातडीची मदत',
        helplineTitle: 'सहकारी टोल-फ्री हेल्पलाइन',
        helplineTiming: '1800-260-8900 (सोम-शनि, सकाळी 8 ते रात्री 9)',
        callBtn: 'कॉल करा',
        wardHubCell: 'पुणे वॉर्ड हब तक्रार निवारण कक्ष',
        wardHubAddress: 'पौड रोड मध्यवर्ती वॉर्ड कार्यालय',
        modalTitle: 'तक्रार दाखल करा',
        modalSubtitle: 'निवडून आलेल्या वॉर्ड तक्रार निवारण परिषदेकडे प्रेषित',
        selectBooking: 'बुकिंग निवडा',
        describeIssue: 'तक्रार किंवा समस्येचे स्वरूप सांगा',
        describeIssuePlaceholder: 'सविस्तर सांगा, उदा. काम नीट झाले नाही, वेळेवर आले नाहीत...',
        coopProtection: 'सहकारी संरक्षण: आपल्याला 30 दिवसांची फेरकाम हमी आहे. कामगाराशी त्यांचे सहकारी सन्मानाने बोलतात, कोणताही मनमानी दंड आकारला जात नाही.',
        submitGrievanceBtn: 'वॉर्ड परिषदेकडे तक्रार दाखल करा'
      },
      reviews: {
        title: 'आपले अभिप्राय आणि रेटिंग्ज',
        subtitle: 'कामगार-मालकांची गुणवत्ता आणि सहकाराला बळ देणारा अस्सल अभिप्राय',
        totalReviews: 'एकूण दिलेले अभिप्राय',
        verified: 'पडताळलेले',
        coopImpact: 'सहकारी परिणाम',
        dividendAudited: 'लाभांश ऑडिट केलेले',
        emptyTitle: 'आपण अद्याप कोणताही अभिप्राय दिलेला नाही.',
        viewCompletedBtn: 'पूर्ण झालेली कामे पहा'
      }
    },
    worker: {
      jobs: {
        dutyShiftActive: 'ड्यूटी शिफ्ट: सुरू',
        wardHub: 'वॉर्ड 14 • कोथरूड हब',
        directPayoutRate: '88% थेट बँक मोबदला',
        activeJobs: 'सक्रिय कामे',
        todayNet: 'आजची निव्वळ कमाई',
        qualityScore: 'गुणवत्ता गुण',
        newRequestAlert: 'नवीन थेट मागणी आली आहे!',
        decisionWindowActive: '5 मिनिटांची मुदत सुरू आहे',
        reviewBtn: 'तपासा',
        filterActive: 'सक्रिय',
        filterCompleted: 'पूर्ण झालेली',
        filterAll: 'सर्व',
        emptyJobs: 'या वेळी कोणतेही सक्रिय काम नेमलेले नाही.',
        customer: 'ग्राहक:',
        baseTariff: 'मूळ दर:',
        yourTakeHome: 'आपली कमाई (88%):',
        coopContribution: 'संस्था निधी (12%):',
        startJobBtn: 'काम सुरू करा',
        completeJobBtn: 'काम पूर्ण झाल्याची नोंद करा',
        completedBadge: 'काम पूर्ण झाले व मोबदला वर्ग झाला'
      },
      requests: {
        title: 'नवीन थेट मागण्या',
        pendingCount: '{count} प्रलंबित',
        windowSubtitle: '5 मिनिटांची त्वरित स्वीकृती मुदत',
        immediateRequest: 'तातडीची सेवा मागणी',
        expiresIn: 'निर्णयाची वेळ शिल्लक: {timer}',
        customerAddress: 'कामाचा पत्ता:',
        taskDescription: 'ग्राहकाचे काम:',
        rateBreakdown: 'सहकारी दर विभाजन',
        totalCustomerPaid: 'ग्राहकाने भरलेली रक्कम:',
        directCredit: 'थेट बँक खात्यात (88%):',
        welfareShare: 'वॉर्ड कल्याण निधी (12%):',
        acceptJobBtn: 'काम स्वीकारा (मार्गावर)',
        declineJobBtn: 'सस्नेह नाकारा',
        simulateRequestBtn: '+ ग्राहक मागणीचे सिम्युलेशन करा',
        emptyRequests: 'कोणतीही मागणी प्रलंबित नाही. आपण वॉर्ड 14 मध्ये सक्रिय आहात.'
      },
      reviews: {
        trustMetric: 'सहकारी विश्वासार्हता निर्देशांक',
        customerReputation: 'ग्राहक प्रतिष्ठा',
        tierAVerified: 'टियर-ए पडताळणीकृत',
        totalRatings: 'एकूण {count} रेटिंग्ज',
        recentCustomerFeedback: 'नुकताच आलेला ग्राहक अभिप्राय',
        verifiedBooking: 'पडताळलेली सेवा बुकिंग'
      },
      disputes: {
        peerPanel: 'सहकारी पुनरावलोकन समिती',
        disputeCases: 'तक्रार प्रकरणे',
        disputesSubtitle: 'कोणत्याही मनमानी निलंबनाशिवाय लोकशाही पद्धतीने तोडगा',
        noActiveDisputes: 'आपल्या नावावर कोणतीही प्रलंबित तक्रार नाही.',
        allClearDesc: 'आपले सहकारी मूल्यांकन अत्यंत समाधानकारक आहे.',
        claimDetails: 'तक्रारीचा तपशील',
        yourStatement: 'आपली अधिकृत बाजू:',
        yourResponse: 'आपले उत्तर:',
        peerCouncilRuling: 'परिषदेचा निर्णय:',
        respondBtn: 'तक्रारीला उत्तर द्या',
        modalTitle: 'परिषदेसमोर आपली बाजू मांडा',
        provideExplanation: 'कामाच्या भेटीचा वस्तुनिष्ठ तपशील द्या:',
        explanationPlaceholder: 'उदा. वेळेवर पोहोचलो, वायरिंग तपासली, ग्राहकाच्या संमतीने ब्रेकर बदलला...',
        fairHearingNote: 'आपली सहकारी परिषद दोन्ही बाजूंचे म्हणणे निष्पक्षपणे ऐकून घेते.',
        submitResponseBtn: 'परिषदेकडे बाजू सादर करा'
      },
      profile: {
        coopOwner: 'सहकारी मालक',
        memberId: 'सभासद क्र: #PEM-14-042 • मार्च 2024 पासून सभासद',
        joinedDate: 'मार्च 2024 पासून सभासद',
        availabilityStatus: 'उपलब्धता स्थिती',
        receivingRequests: 'परिसरातून थेट कामाच्या मागण्या स्वीकारत आहात',
        pausedStatus: 'विश्रांतीवर (ऑफ ड्यूटी / व्यस्त)',
        governanceOverview: 'सहकारी हक्क व कारभार',
        directTakeHome: 'थेट मोबदला',
        welfarePool: 'आरोग्य व साधन निधी',
        votingEquity: 'समान मतदानाचा हक्क',
        verifiedMemberSince: '2024 पासून पडताळणीकृत सभासद',
        contactVerification: 'संपर्क व पडताळणी',
        phone: 'फोन:',
        societyHub: 'सोसायटी हब:',
        wardArea: 'वॉर्ड 14 (कोथरूड, पुणे)',
        certifications: 'कौशल्ये व प्रमाणपत्रे',
        safetyCertified: 'सुरक्षितता प्रमाणित',
        verifiedSkill: 'मास्टर वायरमन परवाना',
        resetAppDemo: 'अॅप डेटा रीसेट करा (लोकल डेटा साफ करा)'
      }
    },
    cooperative: {
      overview: {
        hubWard: 'सोसायटी हब • वॉर्ड 14',
        regNumber: 'नोंदणी क्र: MH/COOP/2024/771',
        societyName: 'पुणे सेंट्रल इलेक्ट्रिशियन को-ऑपरेटिव्ह',
        collectiveSubtitle: 'कामगार-मालकांची लोकशाही वॉर्ड संस्था • नोंदणीकृत प्राथमिक सहकारी संस्था',
        memberOwners: 'सभासद मालक',
        onActiveDuty: 'सध्या कर्तव्यावर',
        wardQuality: 'वॉर्ड गुणवत्ता',
        wardOperations: 'वॉर्ड कामकाज',
        smartDemandTab: 'स्मार्ट मागणी वाटप',
        grievanceAlert: '{count} ग्राहक तक्रारीवर वॉर्ड परिषदेचा निर्णय आवश्यक आहे',
        grievanceAlertDesc: 'कामगार व ग्राहक दोघांची निष्पक्ष सुनावणी',
        activeJobs: 'सक्रिय कामे',
        newIncoming: '{count} नवीन मागण्या',
        workerOwners: 'कामगार-मालक',
        democraticVoting: '100% लोकशाही मतदान',
        retainedReserve: 'राखून ठेवलेला निधी',
        coopSocialFund: '12% सहकारी सामाजिक निधी',
        reviews: 'अभिप्राय',
        positiveRating: '98.2% सकारात्मक रेटिंग',
        cooperativeOperations: 'सहकारी कामकाज',
        enrollMember: 'सभासद जोडा',
        enrollMemberDesc: 'नवीन कामगाराची नोंद करा',
        peerCouncil: 'सहकारी परिषद',
        peerCouncilDesc: 'तक्रारींवर तोडगा काढा',
        smartSuiteBadge: 'स्मार्ट ऑटोमेशन सूट',
        predictiveModel: 'अंदाज मॉडेल v2.4',
        aiHeadline: 'एआय मागणी अंदाज व गतिशील कार्यबल वाटप',
        aiDescription: 'कामगार-मालकांमध्ये कामाचे समान वाटप करते आणि कोणतीही अवाजवी दरवाढ न करता वॉर्डातील वाढीव मागणी पूर्ण करते.',
        hourlyDemandTitle: 'वॉर्ड 14 तासांनुसार मागणीचा अंदाज',
        next12Hours: 'पुढील 12 तास',
        technicianShortfall: '{count} तंत्रज्ञांची कमतरता',
        adequateCapacity: 'पुरेशी क्षमता उपलब्ध',
        activeVsRecommended: 'सक्रिय: {active} / शिफारस केलेले: {recommended}',
        crossWardTitle: 'विविध वॉर्डांमधील मनुष्यबळ संतुलन',
        autoRebalanceBtn: 'स्वयं-संतुलन करा',
        assigned: 'नेमलेले: {count}',
        utilization: 'वापर दर: {rate}%',
        platformGovTitle: 'लोकशाही प्लॅटफॉर्म कारभार',
        platformGovDesc: '25-35% कमिशन उकळणाऱ्या कॉर्पोरेट कंपन्यांप्रमाणे नव्हे, तर रोजगार संस्था फक्त प्रत्यक्ष सर्व्हर खर्च ठेवतात, 88% थेट कामगाराला देतात आणि उरलेले 12% आरोग्य, पेन्शन व अवजारे विम्यात गुंतवतात.'
      },
      members: {
        title: 'वॉर्ड 14 कामगार-मालक यादी',
        subtitle: 'समान मतदानाचा हक्क असलेला लोकशाही सहकारी रोस्टर',
        enrollWorkerBtn: 'कामगाराची नोंदणी करा',
        searchPlaceholder: 'सभासदाचे नाव किंवा परिसर शोधा...',
        activeShift: 'सक्रिय शिफ्ट',
        offShift: 'ऑफ शिफ्ट',
        jobsDone: '{count} कामे पूर्ण',
        baseVisit: 'मूळ भेट शुल्क:',
        equalShareholder: 'समान मतदानाचा वाटा असलेला भागधारक',
        addModalTitle: 'नवीन सहकारी सभासदाची नोंदणी',
        fullName: 'कामगाराचे पूर्ण नाव',
        trade: 'मुख्य व्यवसाय',
        phone: 'फोन नंबर',
        locality: 'वॉर्ड हब / परिसर',
        baseFee: 'मूळ भेट शुल्क (₹)',
        shareNotice: 'नोंदणीमुळे या कामगाराला सहकारी संस्थेत 1 मतदानाचा शेअर आणि संपूर्ण आरोग्य/अपघात विमा संरक्षण मिळते.',
        cancelBtn: 'रद्द करा',
        confirmBtn: 'नोंदणी मंजूर करा'
      },
      bookings: {
        title: 'वॉर्ड डिस्पॅच आणि बुकिंग्ज',
        subtitle: 'वॉर्ड 14 मधील सर्व कामांचे थेट निरीक्षण',
        totalLogs: 'एकूण {count} नोंदी',
        searchPlaceholder: 'बुकिंग, ग्राहक किंवा कामगार शोधा...',
        toCoop: '+₹{amount} संस्था निधी',
        promptAcceptHub: 'हब म्हणून स्वीकारा',
        reassignBtn: 'पुन्हा नेमा',
        activeExecution: 'काम सुरू आहे',
        markDoneBtn: 'पूर्ण झाल्याचे नोंदवा',
        noMatch: 'या निकषात कोणतीही बुकिंग आढळली नाही'
      },
      disputes: {
        title: 'वॉर्ड 14 सहकारी लवाद परिषद',
        subtitle: 'लोकशाही पद्धतीने निवडलेली सभासद पुनरावलोकन समिती',
        pendingCount: '{count} प्रलंबित',
        noGrievances: 'वॉर्ड 14 मध्ये कोणतीही सक्रिय तक्रार नाही',
        customerComplaint: 'ग्राहकाची तक्रार',
        workerStatement: 'कामगाराची बाजू',
        councilRuling: 'परिषदेचा अंतिम निर्णय',
        remediationLabel: 'परिषदेचा निष्कर्ष व तोडगा:',
        remediationPlaceholder: 'उदा. मूळ सुटे भाग वापरल्याची खात्री केली; वॉर्ड निधीतून ₹150 चे व्हाउचर्स ग्राहकाला मंजूर केले...',
        approveRemedyBtn: 'सहकारी तोडगा मंजूर करा',
        recordRulingBtn: 'अंतिम निर्णय नोंदवा'
      },
      reviews: {
        title: 'वॉर्ड गुणवत्ता फीड',
        subtitle: 'वॉर्ड 14 कामगार-मालकांसाठी थेट ग्राहक अभिप्राय',
        avgScore: '{score} सरासरी',
        punctuality: 'वक्तशीरपणा',
        fairInvoicing: 'रास्त बिलिंग',
        disputeRate: 'तक्रार दर',
        searchPlaceholder: 'ग्राहक, कामगार किंवा अभिप्राय शोधा...',
        verifiedClient: 'पडताळलेले स्थानिक रहिवासी'
      }
    },
    notifications: {
      title: 'सूचना व अपडेट्स',
      updates: '{role} पोर्टल अपडेट्स',
      markAllRead: 'सर्व वाचल्याचे चिन्हांकित करा',
      emptyText: 'या क्षणी कोणतीही सूचना नाही.',
      tapToView: 'तपशील पाहण्यासाठी टॅप करा'
    },
    roleSelect: {
      title: 'भूमिका प्रोफाइल बदला',
      subtitle: 'कोणत्याही भूमिकेतून रोजगार प्लॅटफॉर्मचा अनुभव घ्या',
      customerTitle: 'ग्राहक पोर्टल',
      customerSub: 'घरगुती सेवा शोधणारा ग्राहक',
      customerDesc: 'पडताळलेले कामगार शोधा, 5 मिनिटांत बुकिंग पक्के करा आणि अभिप्राय द्या.',
      workerTitle: 'कामगार-मालक पोर्टल',
      workerSub: 'कुशल सहकारी सभासद',
      workerDesc: 'नेमलेली कामे व्यवस्थापित करा, 5 मिनिटांत मागणी स्वीकारा आणि तक्रारी मिटवा.',
      coopTitle: 'सहकारी महासंघ पोर्टल',
      coopSub: 'वॉर्ड संस्था प्रशासक',
      coopDesc: 'मनुष्यबळ वाटप तपासा, रास्त दर सुनिश्चित करा आणि सामाजिक सुरक्षा निधी सांभाळा.',
      activeBadge: 'सध्या सक्रिय',
      switchBtn: 'या प्रोफाइलवर जा'
    },
    common: {
      cancel: 'रद्द करा',
      close: 'बंद करा',
      submit: 'सादर करा',
      confirm: 'पुष्टी करा',
      hours: 'तास',
      mins: 'मिनिटे',
      total: 'एकूण',
      viewAll: 'सर्व पहा'
    }
  }
};

/**
 * Helper to resolve deeply nested string by path, e.g. "customer.home.greeting"
 * Supports dynamic parameter interpolation like {name}, {count}, {amount}, {timer}
 */
export const translate = (
  lang: AppLanguage,
  path: string,
  params?: Record<string, string | number>
): string => {
  const dictionary = mobileTranslations[lang] || mobileTranslations.en;
  const parts = path.split('.');
  
  let current: any = dictionary;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English dictionary
      let fallbackCurrent: any = mobileTranslations.en;
      for (const fPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fPart];
        } else {
          return path;
        }
      }
      current = fallbackCurrent;
      break;
    }
  }

  if (typeof current !== 'string') {
    return path;
  }

  if (!params) {
    return current;
  }

  // Replace {paramName} with value
  let result = current;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
};

/**
 * Dynamic Content Localization Helpers
 * Guarantees that even mock user data, slots, tasks, statuses and trades switch cleanly
 */
export const getLocalizedTrade = (trade: string, lang: AppLanguage): string => {
  const t = mobileTranslations[lang] || mobileTranslations.en;
  const normalized = (trade || '').toLowerCase();
  if (normalized.includes('electric') || normalized.includes('विद्युत') || normalized.includes('इलेक्ट्रिशियन')) return t.trades.electrician;
  if (normalized.includes('plumb') || normalized.includes('प्लंबर')) return t.trades.plumber;
  if (normalized.includes('carpent') || normalized.includes('बढ़ई') || normalized.includes('सुतार')) return t.trades.carpenter;
  if (normalized.includes('clean') || normalized.includes('सफाई') || normalized.includes('स्वच्छता')) return t.trades.cleaning;
  if (normalized.includes('paint') || normalized.includes('रंगाई') || normalized.includes('पेंटर')) return t.trades.painting;
  if (normalized.includes('appliance') || normalized.includes('उपकरण')) return t.trades.appliances;
  return trade;
};

export const getLocalizedStatus = (status: string, lang: AppLanguage): string => {
  const t = mobileTranslations[lang] || mobileTranslations.en;
  switch (status) {
    case 'requested': return t.statuses.requested;
    case 'accepted': return t.statuses.accepted;
    case 'in_progress': return t.statuses.in_progress;
    case 'completed': return t.statuses.completed;
    case 'disputed': return t.statuses.disputed;
    case 'declined': return t.statuses.declined;
    case 'expired': return t.statuses.expired;
    default: return status;
  }
};

export const getLocalizedSlot = (slot: string, lang: AppLanguage): string => {
  if (!slot) return '';
  if (lang === 'hi') {
    if (slot.includes('Immediate') || slot.includes('30 min')) return 'तत्काल (30 मिनट के भीतर)';
    if (slot.includes('Afternoon') || slot.includes('2 PM')) return 'आज दोपहर (2 PM - 5 PM)';
    if (slot.includes('Evening') || slot.includes('5 PM')) return 'आज शाम (5 PM - 8 PM)';
    if (slot.includes('Tomorrow') || slot.includes('9 AM')) return 'कल सुबह (9 AM - 12 PM)';
  }
  if (lang === 'mr') {
    if (slot.includes('Immediate') || slot.includes('30 min')) return 'त्वरित (30 मिनिटांच्या आत)';
    if (slot.includes('Afternoon') || slot.includes('2 PM')) return 'आज दुपारी (2 PM - 5 PM)';
    if (slot.includes('Evening') || slot.includes('5 PM')) return 'आज संध्याकाळी (5 PM - 8 PM)';
    if (slot.includes('Tomorrow') || slot.includes('9 AM')) return 'उद्या सकाळी (9 AM - 12 PM)';
  }
  return slot;
};

// Common task descriptions
export const getLocalizedTask = (task: string, lang: AppLanguage): string => {
  if (!task) return '';
  if (lang === 'hi') {
    if (task.includes('Ceiling fan') || task.includes('switchboard')) return 'सीलिंग फैन स्पार्क और स्विचबोर्ड निदान';
    if (task.includes('pipeline blockage') || task.includes('basin')) return 'रसोई पाइपलाइन रुकावट और बेसिन ट्रैप प्रतिस्थापन';
    if (task.includes('shower leakage')) return 'बाथरूम शावर रिसाव मरम्मत';
    if (task.includes('door lock')) return 'लकड़ी के दरवाजे का ताला ठीक करना';
    if (task.includes('Tripping') || task.includes('MCB')) return 'आपातकालीन विद्युत ट्रिपिंग और एमसीबी निदान';
    if (task.includes('Split AC') || task.includes('AC')) return 'स्प्लिट एसी डीप केमिकल वॉश सर्विसिंग';
    if (task.includes('Water purifier') || task.includes('RO')) return 'वाटर प्यूरीफायर (RO) सेडिमेंट और कार्बन फिल्टर चेंज';
  }
  if (lang === 'mr') {
    if (task.includes('Ceiling fan') || task.includes('switchboard')) return 'सिलिंग फॅन स्पार्क आणि स्विचबोर्ड तपासणी';
    if (task.includes('pipeline blockage') || task.includes('basin')) return 'स्वयंपाकघर पाईपलाईन ब्लॉकेज व बेसिन ट्रॅप बदलणे';
    if (task.includes('shower leakage')) return 'बाथरूम शॉवर गळती दुरुस्ती';
    if (task.includes('door lock')) return 'लाकडी दरवाजाचे लॉक दुरुस्त करणे';
    if (task.includes('Tripping') || task.includes('MCB')) return 'तातडीची विद्युत ट्रिपिंग आणि एमसीबी तपासणी';
    if (task.includes('Split AC') || task.includes('AC')) return 'स्प्लिट एसी केमिकल वॉश सर्व्हिसिंग';
    if (task.includes('Water purifier') || task.includes('RO')) return 'वॉटर प्युरिफायर (RO) फिल्टर बदलणे';
  }
  return task;
};

// Localized mock statements & dispute rulings
export const getLocalizedStatement = (statement: string, lang: AppLanguage): string => {
  if (!statement) return '';
  if (lang === 'hi') {
    if (statement.includes('35 minutes late') || statement.includes('shoe covers')) {
      return 'तकनीशियन सुरक्षा जूते कवर के बिना 35 मिनट देर से पहुंचे और हॉलवे कालीन पर प्लास्टर की धूल छोड़ दी।';
    }
    if (statement.includes('traffic congestion') || statement.includes('Paud Flyover')) {
      return 'पौड फ्लाईओवर पर भारी ट्रैफिक जाम था। मैंने तुरंत वैक्यूम क्लीन करने की पेशकश की; जाने के समय ग्राहक संतुष्ट थे।';
    }
    if (statement.includes('Council Ruling') || statement.includes('advisory')) {
      return 'प्राथमिक विवाद समाधान परिषद निर्णय: तकनीशियन को सौहार्दपूर्ण परामर्श जारी किया गया। ग्राहक के वॉलेट में ₹50 सद्भावना टोकन जमा किया गया।';
    }
  }
  if (lang === 'mr') {
    if (statement.includes('35 minutes late') || statement.includes('shoe covers')) {
      return 'तंत्रज्ञ सुरक्षेचे शू-कव्हर न घालता 35 मिनिटे उशिरा आले आणि हॉलच्या कार्पेटवर प्लास्टरची धूळ सोडली.';
    }
    if (statement.includes('traffic congestion') || statement.includes('Paud Flyover')) {
      return 'पौड उड्डाणपुलावर अनपेक्षित वाहतूक कोंडी होती. मी त्वरित व्हॅक्यूमने स्वच्छता करण्याची तयारी दर्शवली; निघताना ग्राहक समाधानी होते.';
    }
    if (statement.includes('Council Ruling') || statement.includes('advisory')) {
      return 'प्राथमिक तंटा निवारण समितीचा निर्णय: तंत्रज्ञांना मैत्रीपूर्ण सूचना देण्यात आली. ग्राहकाच्या खात्यात ₹50 सदिच्छा टोकन जमा करण्यात आले.';
    }
  }
  return statement;
};

// Localized mock review comment
export const getLocalizedReview = (comment: string, lang: AppLanguage): string => {
  if (!comment) return '';
  if (lang === 'hi') {
    if (comment.includes('Prompt arrival') || comment.includes('uniform')) {
      return 'समय पर आगमन, सहकारी सदस्य स्वच्छ वर्दी और पहचान पत्र के साथ आए। बिना किसी छिपे शुल्क के पारदर्शी दर।';
    }
    if (comment.includes('Fast diagnostic') || comment.includes('MCB')) {
      return 'खराब एमसीबी का त्वरित निदान। उत्कृष्ट सहकारी सेवा!';
    }
    if (comment.includes('carpentry') || comment.includes('Cleaned up')) {
      return 'बहुत ही पेशेवर बढ़ई का काम। जाने से पहले लकड़ी का बुरादा साफ किया।';
    }
  }
  if (lang === 'mr') {
    if (comment.includes('Prompt arrival') || comment.includes('uniform')) {
      return 'वेळेवर आगमन, सहकारी सदस्य स्वच्छ गणवेश आणि ओळखपत्रासह आले. कोणताही छुपे शुल्क नसलेला पारदर्शक दर.';
    }
    if (comment.includes('Fast diagnostic') || comment.includes('MCB')) {
      return 'दोषपूर्ण एमसीबीचे जलद निदान. उत्कृष्ट सहकारी सेवा!';
    }
    if (comment.includes('carpentry') || comment.includes('Cleaned up')) {
      return 'अतिशय व्यावसायिक सुतारकाम. निघण्यापूर्वी लाकडाचा भुसा साफ केला.';
    }
  }
  return comment;
};

