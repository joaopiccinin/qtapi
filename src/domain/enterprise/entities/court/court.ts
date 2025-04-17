import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export interface CourtProps {
  name: string;
  type: string;
  establishmentId: UniqueEntityID;
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

  set name(name: string) {
    this.props.name = name;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set type(type: string) {
    this.props.type = type;
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
