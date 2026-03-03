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
  const S = saved['scarfs'];
  const A = saved['accessories'];
  const C = saved['clothing'];
  const products = [
    { name: 'Écharpe Rose',        price: 40,  stock: 15, images: ['/images/scarfs/pink.jpeg'],           description: 'Écharpe en cachemire rose.',              category: S },
    { name: 'Écharpe Bleu Ciel',   price: 40,  stock: 15, images: ['/images/scarfs/bleu ciel.jpeg'],      description: 'Écharpe en cachemire bleu ciel.',          category: S },
    { name: 'Écharpe Bleu Marine', price: 40,  stock: 15, images: ['/images/scarfs/bleumarine2.jpeg'],      description: 'Écharpe Bleu marine en Melloton Gratté.', category: S },
    { name: 'Écharpe Vert Kiwi',   price: 40,  stock: 15, images: ['/images/scarfs/green.jpeg'],           description: 'Écharpe en cachemire Vert Kiwi.',         category: S },
    { name: 'Écharpe Violette',    price: 40,  stock: 15, images: ['/images/scarfs/violet.jpeg'],           description: 'Écharpe en cachemire violette.',         category: S },
    { name: 'Écharpe Bordeaux',    price: 40,  stock: 10, images: ['/images/scarfs/burgundy.jpeg'],          description: 'Écharpe bordeaux en laine fine.',       category: S },
    { name: 'Écharpe Zébra',       price: 40,  stock: 8,  images: ['/images/scarfs/zebra1.jpeg'],            description: 'Écharpe motif zébré.',                  category: S },
    { name: 'Écharpe Tigré   ',    price: 40,  stock: 6,  images: ['/images/scarfs/tigre.jpeg'],             description: 'Écharpe tigré en Bouclette.',           category: S },
    { name: 'Écharpe Rouge',       price: 40,  stock: 20, images: ['/images/scarfs/red2.jpeg'],              description: 'Écharpe rouge vif en coton premium.',   category: S },
    { name: 'Écharpe Noire',       price: 40, stock: 16, images: ['/images/scarfs/noir.jpeg'],               description: 'Écharpe noire élégante en Cachemire.',   category: S },
    { name: 'Écharpe Blanche',     price: 40,  stock: 12, images: ['/images/scarfs/white.jpeg'],             description: 'Écharpe blanche légère.',               category: S },
    { name: 'Écharpe Marron Bouclette',  price: 40,  stock: 9,  images: ['/images/scarfs/brown.jpeg'],       description: 'Écharpe Marron en Bouclette.',           category: S },
    { name: 'Écharpe Gris & Blanc', price: 40, stock: 9,  images: ['/images/scarfs/grey.jpeg'],           description: 'Écharpe Gris & Blanc en Bouclette.',         category: S },
    { name: 'Écharpe Marron    ',  price: 40,  stock: 9,  images: ['/images/scarfs/marron.jpeg'],           description: 'Écharpe Marron en Cachemire.',           category: S },
    { name: 'Écharpe Bleue',       price: 40,  stock: 14, images: ['/images/scarfs/bleu.jpeg'],            description: 'Écharpe bleue en Melloton Gratté.',        category: S },
    { name: 'Écharpe Noir & Blanc', price: 40,  stock: 7,  images: ['/images/scarfs/cow.jpeg'],               description: 'Écharpe motif vache originale.',        category: S },
    { name: 'Écharpe Jaune',       price: 40,  stock: 11, images: ['/images/scarfs/jaune2.jpeg'],            description: 'Écharpe jaune ensoleillée.',             category: S },
    { name: 'Accessoire Cerise',   price: 15,  stock: 25, images: ['/images/accessoires/cerise.jpeg'],       description: 'Bijou cerise artisanal.',               category: A },
    { name: 'Bracelet Élégant',    price: 25,  stock: 30, images: ['/images/accessoires/braclet.jpeg'],      description: 'Bracelet fait main en Tunisie.',        category: A },
    { name: 'Collier Fleur',       price: 25,  stock: 18, images: ['/images/accessoires/collierfleur.jpeg'], description: 'Collier floral artisanal.',              category: A },
    { name: 'Collier Tunisie',     price: 20,  stock: 20, images: ['/images/accessoires/collier1.jpeg'],     description: 'Collier fin et élégant.',               category: A },
    { name: 'Boucles Coeur',       price: 20,  stock: 35, images: ['/images/accessoires/coeur.jpeg'],        description: 'Accessoires coquettes assortis.',       category: A },
    { name: 'Coquettes',           price: 20,  stock: 35, images: ['/images/accessoires/coquettes.jpeg'],    description: 'Accessoires coquettes assortis.',       category: A },
    { name: 'Papillon Décoratif',  price: 20,  stock: 22, images: ['/images/accessoires/papillon1.jpeg'],      description: 'Accessoire papillon original.',         category: A },
    { name: 'Trench Coat Noir',    price: 120,  stock: 22, images: ['/images/scarfs/blanc1.jpeg'],           description: 'Trench coat noire élégante.',           category: C },
    { name: 'Trench Coat Noir',    price: 120,  stock: 22, images: ['/images/scarfs/blanc.jpeg'],            description: 'Trench coat noire élégante.',           category: C },
];
const seedNames = products.map(p => p.name);

  // ── SUPPRIMER les produits qui ne sont plus dans le code ──
  const allInDb = await productRepo.find();
  const toDelete = allInDb.filter(p => !seedNames.includes(p.name));
  if (toDelete.length > 0) {
    await productRepo.remove(toDelete);
    console.log(`🗑  ${toDelete.length} produit(s) supprimé(s) : ${toDelete.map(p => p.name).join(', ')}`);
  }

 let created = 0, updated = 0;

  for (const p of products) {
    const existing = await productRepo.findOne({ where: { name: p.name } });

    if (existing) {
      await productRepo.save({
        ...existing,
        price:       p.price,
        stock:       p.stock,
        images:      p.images,
        description: p.description,
        category:    p.category,
        status:      ProductStatus.PUBLISHED,
        isActive:    true,
      });
      updated++;
    } else {
      await productRepo.save(productRepo.create({
        ...p,
        status:     ProductStatus.PUBLISHED,
        isActive:   true,
        viewsCount: 0,
        dimensions: {},
        metadata:   {},
      }));
      created++;
    }
  }

  console.log(`\n🎉 Seed terminé — ✅ ${created} créés | 🔄 ${updated} mis à jour | 🗑 ${toDelete.length} supprimés`);
}; 
