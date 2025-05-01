import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Booking,
  BookingProps,
} from "@/domain/enterprise/entities/booking/booking";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";

export function makeBooking(
  override: Partial<BookingProps> = {},
  id?: UniqueEntityID
) {
  const booking = Booking.create(
    {
      courtId: new UniqueEntityID("court-1"),
      userId: new UniqueEntityID("user-1"),
      establishmentId: new UniqueEntityID("establishment-1"),
      startTime: new Date(),
      endTime: new Date(),
      status: BookingStatusEnum.SCHEDULED,
      ...override,
    },
    id
  );

  return booking;
}
