import { DomainEvents } from "@/core/domain-events/domain-events";
import { EstablishmentRepository } from "@/domain/stock/application/repositories/establishment-repository";
import { Establishment, EstablishmentProps } from "@/domain/enterprise/entities/establishment/establishment";

export class InMemoryEstablishmentRepository implements EstablishmentRepository {
  public items: Establishment[] = [];

  constructor() {}

  async findById(id: string): Promise<Establishment | null> {
    const establishment = this.items.find((item) => item.id.toString() === id);

    if (!establishment) {
      return null;
    }

    return establishment;
  }

  async findByEmail(email: string): Promise<Establishment | null> {
    const establishment = this.items.find((item) => item.email === email);

    if (!establishment) {
      return null;
    }

    return establishment;
  }

  async create(establishment: Establishment): Promise<void> {
    this.items.push(establishment);

    DomainEvents.dispatchEventsForAggregate(establishment.id);
  }

  async save(establishment: Establishment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === establishment.id);

    this.items[itemIndex] = establishment;

    DomainEvents.dispatchEventsForAggregate(establishment.id);
  }

  async delete(establishment: Establishment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === establishment.id);

    this.items.splice(itemIndex, 1);
  }

  async update(establishment: Establishment, request: Partial<EstablishmentProps>): Promise<void> {
    Object.assign(establishment, request);
  }
}
