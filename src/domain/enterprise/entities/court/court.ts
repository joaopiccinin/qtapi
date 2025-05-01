import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { CourtLocationTypeEnum } from "./enum/court-location-type.enum";

export interface CourtProps {
  name: string;
  type: string;
  establishmentId: UniqueEntityID;
  locationType: CourtLocationTypeEnum;
  bookingDurationMinutes: number
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Court extends AggregateRoot<CourtProps> {
  get name(): string {
    return this.props.name;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }

  get type(): string {
    return this.props.type;
  }

  get establishmentId(): UniqueEntityID {
    return this.props.establishmentId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get locationType(): CourtLocationTypeEnum {
    return this.props.locationType;
  }

  get bookingDurationMinutes(): number {
    return this.props.bookingDurationMinutes;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set type(type: string) {
    this.props.type = type;
  }

  set establishmentId(establishmentId: UniqueEntityID) {
    this.props.establishmentId = establishmentId;
  }

  set locationType(locationType: CourtLocationTypeEnum) {
    this.props.locationType = locationType;
  }

  set bookingDurationMinutes(bookingDurationMinutes: number) {
    this.props.bookingDurationMinutes = bookingDurationMinutes;
  }

  static create(
    props: Optional<CourtProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID
  ): Court {
    const court = new Court(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return court;
  }
}
