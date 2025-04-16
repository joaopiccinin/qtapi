import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Establishment, EstablishmentProps } from "@/domain/enterprise/entities/establishment/establishment";

export function makeEstablishment(
  override: Partial<EstablishmentProps> = {},
  id?: UniqueEntityID
) {
  const establishment = Establishment.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return establishment;
}
