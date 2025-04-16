import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UserEstablishment, UserEstablishmentProps } from "@/domain/enterprise/entities/relationships/user-establishment";

export function makeUserEstablishment(
  override: Partial<UserEstablishmentProps> = {},
  id?: UniqueEntityID
) {
  const userEstablishment = UserEstablishment.create(
    {
      userId: new UniqueEntityID(),
      establishmentId: new UniqueEntityID(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return userEstablishment;
}
