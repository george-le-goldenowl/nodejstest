import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection } from 'typeorm';

import { User } from '../../../user/entities/user.entity';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(15);
  }
}
