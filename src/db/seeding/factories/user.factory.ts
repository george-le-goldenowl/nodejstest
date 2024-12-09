import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../../user/entities/user.entity';

define(User, () => {
  const user = new User();

  user.email = faker.internet.email();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.birthday = faker.date.past();
  user.locations = [
    {
      city: faker.address.city(),
      country: faker.address.country(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
    },
  ];

  return user;
});
