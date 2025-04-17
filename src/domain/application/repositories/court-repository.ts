import { Court } from "@/domain/enterprise/entities/court/court";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface CourtRepository extends BaseRepository<Court> {}
