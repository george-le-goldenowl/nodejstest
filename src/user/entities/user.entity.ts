import { BaseEntity } from '../../base/entities/base.entity';
import { TABLE } from '../../libs/constants/table';
import { Column, Entity, Index } from 'typeorm';

@Entity(TABLE.USERS)
export class User extends BaseEntity {
  @Index('email-idx')
  @Column()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstname?: string;

  @Column({ type: 'varchar', nullable: true })
  lastname?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'jsonb', nullable: true })
  locations: {
    city: string;
    country: string;
  };
}
