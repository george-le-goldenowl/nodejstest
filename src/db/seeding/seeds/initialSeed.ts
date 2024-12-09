import { User } from '../../../user/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(30);
  }
}
