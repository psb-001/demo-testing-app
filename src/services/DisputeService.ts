import { Booking, Dispute } from "../types";

export class DisputeService {
  /** Build a new Dispute from a booking and customer issue description. */
  static buildDispute(booking: Booking, issue: string): Dispute {
    const dispId = `DISP-${Date.now().toString().slice(-4)}`;
    return {
      id: dispId,
      bookingId: booking.id,
      customerId: booking.customerId,
      customerName: booking.customerName,
      workerId: booking.workerId,
      workerName: booking.workerName,
      workerTrade: booking.workerTrade,
      coopId: booking.coopId,
      coopName: booking.coopName,
      issue,
      status: "open",
      createdAt: "Today",
    };
  }

  /** Apply worker response to an existing dispute, moving it to under_review. */
  static applyWorkerResponse(dispute: Dispute, response: string): Dispute {
    return {
      ...dispute,
      workerResponse: response,
      workerResponseTime: "Today, Just now",
      status: dispute.status === "open" ? "under_review" : dispute.status,
    };
  }

  /** Resolve a dispute with cooperative notes. */
  static applyResolution(dispute: Dispute, resolutionNotes: string): Dispute {
    return {
      ...dispute,
      resolutionNotes,
      resolutionDate: "Today",
      status: "resolved",
    };
  }
}
