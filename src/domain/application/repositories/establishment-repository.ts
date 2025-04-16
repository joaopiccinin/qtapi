import { Establishment } from "../../enterprise/entities/establishment/establishment";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface EstablishmentRepository extends BaseRepository<Establishment>{
  findByEmail(email: string): Promise<Establishment | null>;
}
