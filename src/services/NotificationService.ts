import { AppNotification, NotificationType, UserRole, Booking } from "../types";

let _counter = 0;
const uid = (tag: string) => `notif-${Date.now()}-${tag}-${_counter++}`;

export class NotificationService {
  static make(
    role: UserRole,
    recipientId: string,
    title: string,
    message: string,
    type: NotificationType,
    extras: Partial<Pick<AppNotification, "bookingId" | "targetTab" | "entityId">> = {}
  ): AppNotification {
    return {
      id: uid(role[0]),
      role,
      recipientId,
      title,
      message,
      type,
      timestamp: "Just now",
      isRead: false,
      ...extras,
    };
  }

  /** Notifications fired when a customer creates a new booking. */
  static forNewBooking(booking: Booking, coopId: string, _coopName: string): AppNotification[] {
    return [
      NotificationService.make(
        "worker",
        booking.workerId,
        booking.isEmergency ? "⚡ URGENT: Emergency Booking!" : "⚡ New Direct Booking Request!",
        `${booking.customerName} requested ${booking.taskDescription} at ${booking.locality}. 5 mins to accept!`,
        "booking_request",
        { bookingId: booking.id, targetTab: "requests" }
      ),
      NotificationService.make(
        "cooperative",
        coopId,
        "Dispatch Logged: New Ward Request",
        `Direct request dispatched to member ${booking.workerName} (₹${booking.totalAmount}).`,
        "booking_request",
        { bookingId: booking.id, targetTab: "bookings" }
      ),
    ];
  }

  /** Notifications fired when a booking is marked completed. */
  static forJobCompleted(booking: Booking, invoiceId: string, invoiceNumber: string): AppNotification[] {
    return [
      NotificationService.make(
        "customer",
        booking.customerId,
        "🧾 Digital Co-op Invoice Generated",
        `Work completed by ${booking.workerName}. Invoice #${invoiceNumber} paid via Escrow.`,
        "invoice_issued",
        { bookingId: booking.id, targetTab: "invoices", entityId: invoiceId }
      ),
      NotificationService.make(
        "worker",
        booking.workerId,
        `💰 ₹${booking.workerPayout} Credited to Wallet`,
        `Payout for booking #${booking.id.slice(-6).toUpperCase()} settled instantly (88% direct earnings).`,
        "payment_received",
        { bookingId: booking.id, targetTab: "jobs" }
      ),
      NotificationService.make(
        "cooperative",
        booking.coopId,
        `🏛️ +₹${booking.coopFund} Retained to Welfare Reserve`,
        `12% social security contribution collected from completed job #${booking.id.slice(-6).toUpperCase()}.`,
        "payment_received",
        { bookingId: booking.id, targetTab: "overview" }
      ),
    ];
  }

  /** Generic status-change alert for the customer. */
  static forStatusChange(booking: Booking, nextStatus: string, bookingId: string): AppNotification {
    return NotificationService.make(
      "customer",
      booking.customerId,
      `Job Update: ${nextStatus.replace("_", " ").toUpperCase()}`,
      `${booking.workerName} updated booking #${bookingId.slice(-6).toUpperCase()}: ${nextStatus.replace("_", " ")}`,
      nextStatus === "accepted" ? "booking_accepted" : "job_started",
      { bookingId, targetTab: "bookings" }
    );
  }

  /** Notification to the worker when they receive a review. */
  static forReview(booking: Booking, rating: number, text: string): AppNotification {
    return NotificationService.make(
      "worker",
      booking.workerId,
      `⭐ New ${rating}-Star Review!`,
      `${booking.customerName} reviewed your service: "${text.slice(0, 45)}..."`,
      "review_received",
      { targetTab: "reviews" }
    );
  }

  /** Notifications fired when a dispute is raised. */
  static forDisputeRaised(booking: Booking): AppNotification[] {
    return [
      NotificationService.make(
        "worker",
        booking.workerId,
        "Customer Inquiry / Grievance Logged",
        `Customer ${booking.customerName} filed an inquiry. Please review and provide your statement.`,
        "dispute_opened",
        { targetTab: "disputes" }
      ),
      NotificationService.make(
        "cooperative",
        booking.coopId,
        "Ward Peer Council Alert: New Grievance",
        `Ward grievance logged regarding booking #${booking.id.slice(-6).toUpperCase()}. Council mediation required.`,
        "dispute_opened",
        { targetTab: "disputes" }
      ),
    ];
  }

  /** Notification to cooperative when a worker submits a dispute response. */
  static forWorkerDisputeResponse(coopId: string, disputeId: string): AppNotification {
    return NotificationService.make(
      "cooperative",
      coopId,
      "Worker Clarification Submitted",
      `Worker statement submitted for dispute #${disputeId.slice(-6).toUpperCase()}. Ready for Ward Council ruling.`,
      "dispute_opened",
      { targetTab: "disputes" }
    );
  }

  /** Notifications when cooperative resolves a dispute. */
  static forDisputeResolved(
    customerId: string,
    workerId: string,
    resolutionNotes: string
  ): AppNotification[] {
    return [
      NotificationService.make(
        "customer",
        customerId,
        "✅ Grievance Resolved by Cooperative Council",
        resolutionNotes,
        "dispute_resolved",
        { targetTab: "support" }
      ),
      NotificationService.make(
        "worker",
        workerId,
        "Dispute Concluded by Ward Council",
        resolutionNotes,
        "dispute_resolved",
        { targetTab: "disputes" }
      ),
    ];
  }

  /** Notification for new member enrollment. */
  static forMemberEnrolled(coopId: string, workerName: string): AppNotification {
    return NotificationService.make(
      "cooperative",
      coopId,
      "🎉 Worker-Owner Enrolled!",
      `${workerName} has joined Pune Central Electricians Co-op (Ward 14).`,
      "booking_accepted",
      { targetTab: "members" }
    );
  }
}
