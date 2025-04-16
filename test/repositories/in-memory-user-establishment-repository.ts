import { DomainEvents } from "@/core/domain-events/domain-events";
import { UserEstablishmentRepository } from "@/domain/stock/application/repositories/user-establishment-repository";
import {
  UserEstablishment,
  UserEstablishmentProps,
} from "@/domain/enterprise/entities/relationships/user-establishment";

export class InMemoryuserEstablishmentRepository
  implements UserEstablishmentRepository
{
  public items: UserEstablishment[] = [];

  constructor() {}

  async findById(id: string): Promise<UserEstablishment | null> {
    const userEstablishment = this.items.find(
      (item) => item.id.toString() === id
    );

    if (!userEstablishment) {
      return null;
    }

    return userEstablishment;
  }

  async create(userEstablishment: UserEstablishment): Promise<void> {
    this.items.push(userEstablishment);

    DomainEvents.dispatchEventsForAggregate(userEstablishment.id);
  }

  async save(userEstablishment: UserEstablishment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === userEstablishment.id
    );

    this.items[itemIndex] = userEstablishment;

    DomainEvents.dispatchEventsForAggregate(userEstablishment.id);
  }

  async delete(userEstablishment: UserEstablishment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === userEstablishment.id
    );

    this.items.splice(itemIndex, 1);
  }

  async update(
    userEstablishment: UserEstablishment,
    request: Partial<UserEstablishmentProps>
  ): Promise<void> {
    Object.assign(userEstablishment, request);
  }

  async findByUserIdAndEstablishmentId(userId: string, establishmentId: string): Promise<UserEstablishment | null> {
    const userEstablishment = this.items.find(
      (item) => item.userId.toString() === userId && item.establishmentId.toString() === establishmentId
    );

    if (!userEstablishment) {
      return null;
    }

    return userEstablishment;
  }

  async findManyByEstablishmentId(establishmentId: string): Promise<UserEstablishment[]> {
    const userEstablishments = this.items.filter(
      (item) => item.establishmentId.toString() === establishmentId
    );

    return userEstablishments;
  }

  async findManyByUserId(userId: string): Promise<UserEstablishment[]> {
    const userEstablishments = this.items.filter(
      (item) => item.userId.toString() === userId
    );

    return userEstablishments;
  }

  async deleteManyByEstablishmentId(establishmentId: string): Promise<void> {
    const userEstablishments = this.items.filter(
      (item) => item.establishmentId.toString() !== establishmentId
    );

    this.items = userEstablishments;
  }
}
