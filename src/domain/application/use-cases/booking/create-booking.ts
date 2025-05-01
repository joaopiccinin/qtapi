import { Booking } from "@/domain/enterprise/entities/booking/booking";
import { BookingRepository } from "../../repositories/booking-repository";
import { CourtRepository } from "../../repositories/court-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";
import { UserRepository } from "../../repositories/user-repository";
import { BookingTimeConflictError } from "./errors/booking-time-conflict-error";
import { InvalidDateRangeError } from "../commons/errors/invalid-date-range-error";
import { Court } from "@/domain/enterprise/entities/court/court";
import { User } from "@/domain/enterprise/entities/user/user";

interface CreateBookingUseCaseRequest {
  courtId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
}

type CreateBookingUseCaseResponse = Either<
  ResourceNotFoundError | BookingTimeConflictError | InvalidDateRangeError,
  {
    booking: Booking;
  }
>;

export class CreateBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private courtRepository: CourtRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    request: CreateBookingUseCaseRequest
  ): Promise<CreateBookingUseCaseResponse> {
    const court = await this.validateCourt(request.courtId);
    if (!court) return failure(new ResourceNotFoundError());

    const user = await this.validateUser(request.userId);
    if (!user) return failure(new ResourceNotFoundError());

    if (!this.isDateRangeValid(request.startTime, request.endTime)) {
      return failure(new InvalidDateRangeError());
    }

    const hasTimeConflict = await this.hasBookingConflict(
      court.id.toString(),
      request.startTime,
      request.endTime
    );

    if (hasTimeConflict) {
      return failure(new BookingTimeConflictError());
    }

    const booking = Booking.create({
      courtId: court.id,
      userId: user.id,
      establishmentId: court.establishmentId,
      startTime: request.startTime,
      endTime: request.endTime,
      status: BookingStatusEnum.SCHEDULED,
      createdAt: new Date(),
    });

    await this.bookingRepository.create(booking);

    return success({ booking });
  }

  private async validateCourt(courtId: string): Promise<Court | null> {
    return this.courtRepository.findById(courtId);
  }

  private async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  private isDateRangeValid(start: Date, end: Date): boolean {
    return start < end;
  }

  private async hasBookingConflict(
    courtId: string,
    start: Date,
    end: Date
  ): Promise<boolean> {
    return this.bookingRepository.existsBookingInRange(courtId, start, end);
  }
}
