import { DomainEvents } from "@/core/domain-events/domain-events";
import { EstablishmentAddressRepository } from "@/domain/stock/application/repositories/establishment-address-repository";
import {
  EstablishmentAddress,
  EstablishmentAddressProps,
} from "@/domain/enterprise/entities/relationships/establishment-address";

export class InMemoryEstablishmentAddressRepository
  implements EstablishmentAddressRepository
{
  public items: EstablishmentAddress[] = [];

  constructor() {}

  async findById(id: string): Promise<EstablishmentAddress | null> {
    const establishmentAddress = this.items.find(
      (item) => item.id.toString() === id
    );

    if (!establishmentAddress) {
      return null;
    }

    return establishmentAddress;
  }

  async create(establishmentAddress: EstablishmentAddress): Promise<void> {
    this.items.push(establishmentAddress);

    DomainEvents.dispatchEventsForAggregate(establishmentAddress.id);
  }

  async save(establishmentAddress: EstablishmentAddress): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === establishmentAddress.id
    );

    this.items[itemIndex] = establishmentAddress;

    DomainEvents.dispatchEventsForAggregate(establishmentAddress.id);
  }

  async delete(establishmentAddress: EstablishmentAddress): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === establishmentAddress.id
    );

    this.items.splice(itemIndex, 1);
  }

  async update(
    establishmentAddress: EstablishmentAddress,
    request: Partial<EstablishmentAddressProps>
  ): Promise<void> {
    Object.assign(establishmentAddress, request);
  }

  async findByAddressIdAndEstablishmentId(
    addressId: string,
    establishmentId: string
  ): Promise<EstablishmentAddress | null> {
    const establishmentAddress = this.items.find(
      (item) =>
        item.addressId.toString() === addressId &&
        item.establishmentId.toString() === establishmentId
    );

    if (!establishmentAddress) {
      return null;
    }

    return establishmentAddress;
  }

  async findManyByEstablishmentId(
    establishmentId: string
  ): Promise<EstablishmentAddress[]> {
    const establishmentAddresss = this.items.filter(
      (item) => item.establishmentId.toString() === establishmentId
    );

    return establishmentAddresss;
  }

  async deleteManyByEstablishmentId(establishmentId: string): Promise<void> {
    const establishmentAddresss = this.items.filter(
      (item) => item.establishmentId.toString() !== establishmentId
    );

    this.items = establishmentAddresss;
  }
}
