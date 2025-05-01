import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { BookingStatusEnum } from "./enum/booking-status.enum";

export interface BookingProps {
  userId: UniqueEntityID;
  courtId: UniqueEntityID;
  establishmentId: UniqueEntityID;
  startTime: Date;
  endTime: Date;
  status: BookingStatusEnum;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Booking extends AggregateRoot<BookingProps> {
  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get courtId(): UniqueEntityID {
    return this.props.courtId;
  }

  get establishmentId(): UniqueEntityID {
    return this.props.establishmentId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get status(): BookingStatusEnum {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId;
  }

  set courtId(courtId: UniqueEntityID) {
    this.props.courtId = courtId;
  }

  set establishmentId(establishmentId: UniqueEntityID) {
    this.props.establishmentId = establishmentId;
  }

  set startTime(startTime: Date) {
    this.props.startTime = startTime;
  }

  set endTime(endTime: Date) {
    this.props.endTime = endTime;
  }

  set status(status: BookingStatusEnum) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  static create(
    props: Optional<BookingProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID
  ): Booking {
    const booking = new Booking(
      {
        ...props,
        status: props.status ?? BookingStatusEnum.PENDING,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return booking;
  }
}
