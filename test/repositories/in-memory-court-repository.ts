import { DomainEvents } from "@/core/domain-events/domain-events";
import { CourtRepository } from "@/domain/application/repositories/court-repository";
import { Court, CourtProps } from "@/domain/enterprise/entities/court/court";

export class InMemoryCourtRepository implements CourtRepository {
  public items: Court[] = [];

  constructor() {}

  async findById(id: string): Promise<Court | null> {
    const court = this.items.find((item) => item.id.toString() === id);

    if (!court) {
      return null;
    }

    return court;
  }

  async create(court: Court): Promise<void> {
    this.items.push(court);

    DomainEvents.dispatchEventsForAggregate(court.id);
  }

  async save(court: Court): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === court.id);

    this.items[itemIndex] = court;

    DomainEvents.dispatchEventsForAggregate(court.id);
  }

  async delete(court: Court): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === court.id);

    this.items.splice(itemIndex, 1);
  }

  async update(court: Court, request: Partial<CourtProps>): Promise<void> {
    Object.assign(court, request);
  }
}
