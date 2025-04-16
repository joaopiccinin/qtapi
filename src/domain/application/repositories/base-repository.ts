//TODO: It have to be an abstract class when we will start the server using node
export interface BaseRepository<T> {
  create(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  update(entity: T, request: Partial<T>): Promise<void>;
  delete(entity: T): Promise<void>;
}