import { Booking, Review, Worker } from "../types";
import { defaultCustomer } from "../data/mockAppData";

export class ReviewService {
  /** Build a new Review from a booking + customer input. */
  static buildReview(booking: Booking, rating: number, text: string): Review {
    return {
      id: `rev-${Date.now()}`,
      bookingId: booking.id,
      workerId: booking.workerId,
      workerName: booking.workerName,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerAvatar: defaultCustomer.avatar,
      rating,
      text,
      date: "Today",
      trade: booking.workerTrade,
      coopId: booking.coopId,
    };
  }

  /**
   * Recalculate a Worker's rating after receiving a new review.
   * Uses weighted rolling average.
   */
  static updateWorkerRating(worker: Worker, newRating: number): Worker {
    const newCount = worker.reviewsCount + 1;
    const newAvg = Number(
      ((worker.rating * worker.reviewsCount + newRating) / newCount).toFixed(2)
    );
    return {
      ...worker,
      rating: newAvg,
      reviewsCount: newCount,
    };
  }
}
