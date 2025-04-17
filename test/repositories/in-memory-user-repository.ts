import { DomainEvents } from "@/core/domain-events/domain-events";
import { UserRepository } from "@/domain/application/repositories/user-repository";
import { User, UserProps } from "@/domain/enterprise/entities/user/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  constructor() {}

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);

    DomainEvents.dispatchEventsForAggregate(user.id);
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items[itemIndex] = user;

    DomainEvents.dispatchEventsForAggregate(user.id);
  }

  async delete(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIndex, 1);
  }

  async update(user: User, request: Partial<UserProps>): Promise<void> {
    Object.assign(user, request);
  }
}
