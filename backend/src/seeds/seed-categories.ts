// apps/backend/src/seeds/seed-categories.ts
import { DataSource } from 'typeorm';
import { Category } from '../categories/categories.entity';
import { Product } from '../products/products.entity';
import { ProductStatus } from '../products/types/product-status.enum';

export const seedCategories = async (dataSource: DataSource) => {
  if (!dataSource.isInitialized) {
    console.log('⏳ DataSource non initialisé — seed ignoré');
    return;
  }

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo  = dataSource.getRepository(Product);

  // ── 1. CATÉGORIES ──────────────────────────────────────────
  const cats = [
    { name: 'Clothing',    slug: 'clothing'    },
    { name: 'Scarfs',      slug: 'scarfs'      },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const saved: Record<string, Category> = {};

  for (const cat of cats) {
    let c = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!c) {
      c = await categoryRepo.save(categoryRepo.create(cat));
      console.log(`✅ Catégorie créée : ${cat.name}`);
    } else {
      console.log(`⏭  Catégorie existante : ${cat.name}`);
    }
    saved[cat.slug] = c;
  }

  // ── 2. PRODUITS ────────────────────────────────────────────
  const count = await productRepo.count();
  if (count > 0) {
    console.log(`⏭  ${count} produits déjà en base — seed ignoré`);
    return;
  }

  const S = saved['scarfs'];
  const A = saved['accessories'];

  const products = [
    { name: 'Écharpe Violette',    price: 40,  stock: 15, images: ['/images/scarfs/violet.jpeg'],           description: 'Écharpe en cachemire violette.',        category: S },
    { name: 'Écharpe Bordeaux',    price: 40,  stock: 10, images: ['/images/scarfs/burgundy.jpeg'],          description: 'Écharpe bordeaux en laine fine.',       category: S },
    { name: 'Écharpe Zébrée I',    price: 40,  stock: 8,  images: ['/images/scarfs/zebra1.jpeg'],            description: 'Écharpe motif zébré.',                  category: S },
    { name: 'Écharpe Zébrée II',   price: 40,  stock: 6,  images: ['/images/scarfs/zebra.jpeg'],             description: 'Variante zébrée coloris doux.',         category: S },
    { name: 'Écharpe Rouge',       price: 40,  stock: 20, images: ['/images/scarfs/red2.jpeg'],              description: 'Écharpe rouge vif en coton premium.',   category: S },
    { name: 'Écharpe Rouge Classic',price: 40, stock: 16, images: ['/images/scarfs/red.jpeg'],               description: 'Écharpe rouge classique.',              category: S },
    { name: 'Écharpe Blanche',     price: 40,  stock: 12, images: ['/images/scarfs/white.jpeg'],             description: 'Écharpe blanche légère.',               category: S },
    { name: 'Écharpe Rose Mauve',  price: 40,  stock: 9,  images: ['/images/scarfs/marrose.jpeg'],           description: 'Écharpe rose mauve en soie.',           category: S },
    { name: 'Écharpe Cœur',        price: 40,  stock: 14, images: ['/images/scarfs/coeur1.jpeg'],            description: 'Écharpe motif cœur romantique.',        category: S },
    { name: 'Écharpe Vache',       price: 40,  stock: 7,  images: ['/images/scarfs/cow.jpeg'],               description: 'Écharpe motif vache originale.',        category: S },
    { name: 'Écharpe Jaune',       price: 40,  stock: 11, images: ['/images/scarfs/jaune2.jpeg'],            description: 'Écharpe jaune ensoleillée.',             category: S },
    { name: 'Accessoire Cerise',   price: 15,  stock: 25, images: ['/images/accessoires/cerise.jpeg'],       description: 'Bijou cerise artisanal.',               category: A },
    { name: 'Bracelet Élégant',    price: 25,  stock: 30, images: ['/images/accessoires/braclet.jpeg'],      description: 'Bracelet fait main en Tunisie.',        category: A },
    { name: 'Collier Fleur',       price: 25,  stock: 18, images: ['/images/accessoires/collierfleur.jpeg'], description: 'Collier floral artisanal.',              category: A },
    { name: 'Collier Élégant',     price: 20,  stock: 20, images: ['/images/accessoires/collier1.jpeg'],     description: 'Collier fin et élégant.',               category: A },
    { name: 'Coquettes',           price: 20,  stock: 35, images: ['/images/accessoires/coquettes.jpeg'],    description: 'Accessoires coquettes assortis.',       category: A },
    { name: 'Papillon Décoratif',  price: 20,  stock: 22, images: ['/images/accessoires/papillon.jpg'],      description: 'Accessoire papillon original.',         category: A },
  ];

  for (const p of products) {
    await productRepo.save(productRepo.create({
      ...p,
      status: ProductStatus.PUBLISHED,
      isActive: true,
      viewsCount: 0,
      dimensions: {},
      metadata: {},
    }));
    console.log(`✅ Produit créé : ${p.name}`);
  }

  console.log(`\n🎉 Seed terminé — ${products.length} produits créés`);
};