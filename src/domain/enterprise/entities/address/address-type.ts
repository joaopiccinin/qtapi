import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export enum AddressTypeEnum {
  Residential = "Residential",
  Commercial = "Commercial",
  Business = "Business",
}

//For while, we will just use an enum for address types, but, in future versions, we will implement personalized adress types if necessary.

export interface AddressTypeProps {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AddressType extends AggregateRoot<AddressTypeProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
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

  set description(description: string) {
    this.props.description = description;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  static create(
    props: Optional<AddressTypeProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID
  ): AddressType {
    const address = new AddressType(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return address;
  }
}
