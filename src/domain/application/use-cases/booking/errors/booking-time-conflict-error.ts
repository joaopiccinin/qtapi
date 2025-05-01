import { UseCaseError } from "../../commons/errors/use-case-error";

export class BookingTimeConflictError extends Error implements UseCaseError {
  constructor() {
    super("Booking time conflict.");
  }
}
