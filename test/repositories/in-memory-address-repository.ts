import { DomainEvents } from "@/core/domain-events/domain-events";
import { AddressRepository } from "@/domain/stock/application/repositories/address-repository";
import { Address, AddressProps } from "@/domain/enterprise/entities/address/address";

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = [];

  constructor() {}

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id.toString() === id);

    if (!address) {
      return null;
    }

    return address;
  }

  async create(address: Address): Promise<void> {
    this.items.push(address);

    DomainEvents.dispatchEventsForAggregate(address.id);
  }

  async save(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id);

    this.items[itemIndex] = address;

    DomainEvents.dispatchEventsForAggregate(address.id);
  }

  async delete(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id);

    this.items.splice(itemIndex, 1);
  }

  async update(address: Address, request: Partial<AddressProps>): Promise<void> {
    Object.assign(address, request);
  }
}
