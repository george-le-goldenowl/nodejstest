import { faker } from '@faker-js/faker';
import { User } from '../../../user/entities/user.entity';
import { define } from 'typeorm-seeding';

define(User, () => {
  const user = new User();

  user.email = faker.internet.email();
  user.firstname = faker.name.firstName();
  user.lastname = faker.name.lastName();
  user.birthday = faker.date.past();
  user.locations = {
    city: faker.address.city(),
    country: faker.address.country(),
  };

  return user;
});
