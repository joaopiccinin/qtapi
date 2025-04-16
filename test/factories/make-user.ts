import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/enterprise/entities/user/user";
import { Password } from "@/domain/enterprise/entities/user/value-objects/password/password";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      createdAt: new Date(),
      passwordHash: new Password("12345Joao#").toString(),
      ...override,
    },
    id
  );

  return user;
}
