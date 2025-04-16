import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UserEstablishmentProps {
  userId: UniqueEntityID
  establishmentId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class UserEstablishment extends Entity<UserEstablishmentProps> {
  get userId() {
    return this.props.userId
  }

  get establishmentId() {
    return this.props.establishmentId
  }

  static create(props: UserEstablishmentProps, id?: UniqueEntityID) {
    const userEstablishment = new UserEstablishment(props, id)

    return userEstablishment
  }
}