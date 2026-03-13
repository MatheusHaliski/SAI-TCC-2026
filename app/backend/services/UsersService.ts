import { UsersRepository } from '@/app/backend/repositories/UsersRepository';

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

<<<<<<< HEAD
  async getById(userId: string) {
=======
  async getById(userId: number) {
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
    return this.usersRepository.getById(userId);
  }
}
