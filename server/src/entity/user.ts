import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'text' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'text' })
  updatedAt!: Date;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  uniqueId!: string;

  @Column()
  isEmailConfirmed!: boolean;

  @Column()
  password!: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  loginToken?: string;

  @Column({ nullable: true })
  loginTokenExpires?: Date;
}
