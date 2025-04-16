import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { UpdateUserUseCase } from "./update-user";
import { makeUser } from "test/factories/make-user";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: UpdateUserUseCase;

describe("Update User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new UpdateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to update an user", async () => {
    const user = makeUser();
    await inMemoryUserRepository.create(user);

    const result = await sut.execute(user.id.toString(), {
      name: "João Atualizado",
      phone: "11 1112222",
    });

    expect(result.isSuccess()).toBe(true);

    const updatedUser = await inMemoryUserRepository.findById(
      user.id.toString()
    );

    expect(updatedUser).toEqual(
      expect.objectContaining({
        name: "João Atualizado",
        phone: "11 1112222",
        updatedAt: expect.any(Date),
      })
    );
  });

  it("should not be able to update an user if it does not exist", async () => {
    const result = await sut.execute("inexistent-user", {
      name: "João Atualizado",
      phone: "11 1112222",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
