import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';

export const seedAdmin = async (dataSource: DataSource) => {
  if (!dataSource.isInitialized) return;

  const userRepo = dataSource.getRepository(User);

  const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'ghofrane26@jass.tn';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'benachour@jass2026';
  const ADMIN_NAME     = process.env.ADMIN_NAME     ?? 'Admin JASS';

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existing = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    // ✅ Toujours remettre le hash + role au cas où password est null
    existing.role     = UserRole.ADMIN;
    existing.password = hash;
    await userRepo.save(existing);
    console.log(`🔄 Admin mis à jour : ${ADMIN_EMAIL}`);
  } else {
    await userRepo.save(
      userRepo.create({
        name:     ADMIN_NAME,
        email:    ADMIN_EMAIL,
        password: hash,
        role:     UserRole.ADMIN,
      })
    );
    console.log(`✅ Compte admin créé : ${ADMIN_EMAIL}`);
  }

  console.log(`🔑 Mot de passe : ${ADMIN_PASSWORD}`);
};