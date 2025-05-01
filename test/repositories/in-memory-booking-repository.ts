import {
  Booking,
  BookingProps,
} from "@/domain/enterprise/entities/booking/booking";
import { BookingRepository } from "@/domain/application/repositories/booking-repository";
import { DomainEvents } from "@/core/domain-events/domain-events";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";

export class InMemoryBookingRepository implements BookingRepository {
  public items: Booking[] = [];

  async findById(id: string): Promise<Booking | null> {
    const booking = this.items.find((item) => item.id.toString() === id);

    if (!booking) {
      return null;
    }

    return booking;
  }

  async create(booking: Booking): Promise<void> {
    this.items.push(booking);

    DomainEvents.dispatchEventsForAggregate(booking.id);
  }

  async save(booking: Booking): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === booking.id);

    if (itemIndex >= 0) {
      this.items[itemIndex] = booking;
    }

    DomainEvents.dispatchEventsForAggregate(booking.id);
  }

  async delete(booking: Booking): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === booking.id);

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1);
    }
  }

  async update(
    booking: Booking,
    request: Partial<BookingProps>
  ): Promise<void> {
    Object.assign(booking, request);
  }

  async existsBookingInRange(
    courtId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    return this.items.some((booking) => {
      const isSameCourt = booking.courtId.toString() === courtId;
      const isActive =
        booking.status === BookingStatusEnum.SCHEDULED ||
        booking.status === BookingStatusEnum.CONFIRMED;

      const overlaps =
        booking.startTime < endTime && booking.endTime > startTime;

      return isSameCourt && isActive && overlaps;
    });
  }
}
