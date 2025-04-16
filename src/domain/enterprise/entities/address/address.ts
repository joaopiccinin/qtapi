import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AggregateRoot } from "@/core/entities/aggregate-root";

export interface AddressProps {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  complement?: string;
  postalCode: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Address extends AggregateRoot<AddressProps> {
  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get country(): string {
    return this.props.country;
  }

  get number(): string {
    return this.props.number;
  }

  get complement(): string | undefined {
    return this.props.complement;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }

  set street(street: string) {
    this.props.street = street;
  }

  set city(city: string) {
    this.props.city = city;
  }

  set state(state: string) {
    this.props.state = state;
  }

  set postalCode(postalCode: string) {
    this.props.postalCode = postalCode;
  }

  set country(country: string) {
    this.props.country = country;
  }

  set number(number: string) {
    this.props.number = number;
  }

  set complement(complement: string | undefined) {
    this.props.complement = complement;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  static create(
    props: Optional<AddressProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID
  ): Address {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return address;
  }
}
