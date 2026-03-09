

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';

export const seedAdmin = async (dataSource: DataSource) => {
  if (!dataSource.isInitialized) return;

  const userRepo = dataSource.getRepository(User);

  const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'ghofraneeba@jass.tn';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Motdepasse@jass2026';
  const ADMIN_NAME     = process.env.ADMIN_NAME     ?? 'Admin JASS';

  const existing = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    // Met à jour le rôle si le compte existe déjà
    if (existing.role !== UserRole.ADMIN) {
      existing.role = UserRole.ADMIN;
      await userRepo.save(existing);
      console.log(`🔄 Rôle mis à jour → admin pour : ${ADMIN_EMAIL}`);
    } else {
      console.log(`⏭  Admin déjà existant : ${ADMIN_EMAIL}`);
    }
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await userRepo.save(
    userRepo.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hash,
      role:     UserRole.ADMIN,
    })
  );

  console.log(`✅ Compte admin créé : ${ADMIN_EMAIL}`);
  console.log(`🔑 Mot de passe     : ${ADMIN_PASSWORD}`);
  console.log(`⚠️  Change le mot de passe en production !`);
};
