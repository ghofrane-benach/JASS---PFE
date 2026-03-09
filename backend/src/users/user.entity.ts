// backend/src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  USER  = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;                // ✅ CORRIGÉ — dans la classe + décorateur correct

  @CreateDateColumn()
  createdAt: Date;
}