import { UserEstablishment } from "../../enterprise/entities/relationships/user-establishment";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface UserEstablishmentRepository extends BaseRepository<UserEstablishment> {
  findByUserIdAndEstablishmentId(userId: string, establishmentId: string): Promise<UserEstablishment | null>
  findManyByEstablishmentId(establishmentId: string): Promise<UserEstablishment[]>
  findManyByUserId(userId: string): Promise<UserEstablishment[]>
  deleteManyByEstablishmentId(establishmentId: string): Promise<void>
}
