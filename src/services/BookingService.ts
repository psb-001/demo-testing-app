import { Booking, BookingStatus, Invoice, BookingTimelineEvent } from "../types";
import { defaultCooperative } from "../data/mockAppData";

export class BookingService {
  /** Build a timeline note for a given status transition. */
  static timelineNoteFor(booking: Booking, status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      draft: "Drafting service request.",
      requested: `Direct booking request sent to ${booking.workerName}.`,
      accepted: `${booking.workerName} accepted your request within prompt window.`,
      active: `${booking.workerName} is en route to site.`,
      in_progress: `${booking.workerName} arrived on site and commenced diagnostics & work.`,
      completed: "Work successfully verified and completed.",
      declined: "Worker was occupied and politely declined. Reassigned by Ward Hub.",
      expired: "Request timed out after 5 minutes. Ward dispatch triggered auto-reroute.",
      cancelled: "Booking cancelled by customer.",
      disputed: "Dispute opened for Ward Council peer mediation.",
    };
    return map[status] ?? `Status updated to ${status}`;
  }

  /** Produce an updated booking with the new status appended to its timeline. */
  static applyStatusTransition(
    booking: Booking,
    nextStatus: BookingStatus,
    note?: string
  ): Booking {
    const timelineEvent: BookingTimelineEvent = {
      status: nextStatus,
      label: nextStatus.toUpperCase(),
      timestamp: "Just now",
      note: note ?? BookingService.timelineNoteFor(booking, nextStatus),
    };
    return {
      ...booking,
      status: nextStatus,
      completedAt: nextStatus === "completed" ? Date.now() : booking.completedAt,
      timeline: [...booking.timeline, timelineEvent],
    };
  }

  /** Generate an Invoice object from a completed Booking. */
  static generateInvoice(booking: Booking): Invoice {
    const invId = `INV-${Date.now().toString().slice(-4)}`;
    return {
      id: invId,
      bookingId: booking.id,
      invoiceNumber: `ROZ/PUN/26/089-${invId.slice(-4)}`,
      customerId: booking.customerId,
      customerName: booking.customerName,
      workerId: booking.workerId,
      workerName: booking.workerName,
      workerTrade: booking.workerTrade,
      coopId: booking.coopId,
      coopName: booking.coopName,
      taskDescription: booking.taskDescription,
      date: "Today, Just now",
      baseFee: booking.baseFee,
      materialCost: 0,
      platformFee: 0,
      coopWelfareFund: booking.coopFund,
      workerPayout: booking.workerPayout,
      totalAmount: booking.totalAmount,
      paymentMethod: "Cooperative Escrow",
      paymentStatus: "paid",
      transactionRef: `UPI/ROJGAR/${Date.now().toString().slice(-8)}`,
      gstRegistration: "27AABCP8821M1ZK",
    };
  }

  /** Build a simulated incoming booking for the demo Worker portal. */
  static buildSimulatedRequest(): Booking {
    const newId = `BKG-${Date.now().toString().slice(-4)}`;
    return {
      id: newId,
      customerId: "c-102",
      customerName: "Rahul Verma",
      customerPhone: "+91 98220 88291",
      workerId: "w-ramesh-jadhav",
      workerName: "Rameshwar Jadhav",
      workerPhoto:
        "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&h=300&q=80",
      workerTrade: "Master Electrician",
      coopId: defaultCooperative.id,
      coopName: defaultCooperative.name,
      taskDescription: "Emergency Electrical Tripping & MCB Diagnosis",
      category: "electrician",
      locality: "Kothrud, Pune",
      address: "Flat 402, Rohan Ashima, Near Gandhi Bhavan, Kothrud",
      scheduledSlot: "Immediate (within 30 mins)",
      baseFee: 349,
      totalAmount: 399,
      workerPayout: 351,
      coopFund: 48,
      status: "requested",
      isEmergency: true,
      createdAt: Date.now(),
      timeline: [
        {
          status: "requested",
          label: "EMERGENCY REQUEST SENT",
          timestamp: "Just now",
          note: "Direct booking request sent to worker. 5-min decision window active.",
        },
      ],
    };
  }
}
