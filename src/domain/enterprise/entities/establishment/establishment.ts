import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export interface EstablishmentProps {
  name: string;
  email: string;
  phone: string;
  parentEstablishmentId?: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Establishment extends AggregateRoot<EstablishmentProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get parentEstablishmentId(): string | undefined {
    return this.props.parentEstablishmentId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  set parentEstablishmentId(parentEstablishmentId: string) {
    this.props.parentEstablishmentId = parentEstablishmentId;
  }

  static create(
    props: Optional<EstablishmentProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID
  ): Establishment {
    const user = new Establishment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return user;
  }
}
