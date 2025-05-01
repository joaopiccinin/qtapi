import { Booking } from "@/domain/enterprise/entities/booking/booking";
import { BookingRepository } from "../../repositories/booking-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";

interface UpdateBookingUseCaseRequest {
  status?: BookingStatusEnum;
}

type UpdateBookingUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    booking: Booking;
  }
>;

export class UpdateBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(
    id: string,
    request: UpdateBookingUseCaseRequest
  ): Promise<UpdateBookingUseCaseResponse> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      return failure(new ResourceNotFoundError());
    }

    if (request.status) booking.status = request.status;

    await this.bookingRepository.save(booking);

    return success({ booking });
  }
}
