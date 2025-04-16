import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface EstablishmentAddressProps {
  establishmentId: UniqueEntityID;
  addressId: UniqueEntityID;
  addressType: string;
  isMain: boolean;
  createdAt: Date;
}

export class EstablishmentAddress extends Entity<EstablishmentAddressProps> {
  get addressId() {
    return this.props.addressId;
  }

  get establishmentId() {
    return this.props.establishmentId;
  }

  get addressType() {
    return this.props.addressType;
  }

  get isMain() {
    return this.props.isMain;
  }

  set isMain(value: boolean) {
    this.props.isMain = value;
  }

  static create(props: EstablishmentAddressProps, id?: UniqueEntityID) {
    const userEstablishment = new EstablishmentAddress(props, id);

    return userEstablishment;
  }
}
