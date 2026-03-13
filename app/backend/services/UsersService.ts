import { UsersRepository } from '@/app/backend/repositories/UsersRepository';

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

  async getById(userId: number) {
    return this.usersRepository.getById(userId);
  }
}
