import { User } from "@/domain/enterprise/entities/user/user";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
