import { Role } from 'src/auth/entities/roles.entity';
import { Company } from 'src/companies/entities/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  hash: string;

  @Column({ nullable: true, unique: true })
  salt: string;

  @Column({ nullable: true, unique: true })
  resetPasswordToken: string;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => Company)
  company: Company;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
