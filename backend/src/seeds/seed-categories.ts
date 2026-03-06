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

  // ✅ SOUS-CATÉGORIES :
  //    Clothing    → 'coats' | 'sets' | 'vestes' | 'pantalons'
  //    Accessories → 'colliers' | 'bracelets' | 'boucles-doreilles'
  //    Scarfs      → null (pas de sous-catégories)

  const products = [

    // ════════════════════════════════════════
    // SCARFS — subcategory: null
    // ════════════════════════════════════════
    {
      name: 'Écharpe Rose',
      price: 40, stock: 15,
      description: 'Écharpe en cachemire rose.',
      subcategory: null,
      images: ['/images/scarfs/pink.jpeg', '/images/scarfs/pink1.jpeg', '/images/scarfs/pink2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Bleu Ciel',
      price: 40, stock: 15,
      description: 'Écharpe en cachemire bleu ciel.',
      subcategory: null,
      images: ['/images/scarfs/bleu ciel.jpeg', '/images/scarfs/bleuciel1.jpeg', '/images/scarfs/bleuciel2.jpeg', '/images/scarfs/bleuciel3.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Bleu Marine',
      price: 40, stock: 15,
      description: 'Écharpe Bleu marine en Melloton Gratté.',
      subcategory: null,
      images: ['/images/scarfs/bleumarine.jpeg', '/images/scarfs/bleumarine1.jpeg', '/images/scarfs/bleumarine2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Vert Kiwi',
      price: 40, stock: 15,
      description: 'Écharpe en cachemire Vert Kiwi.',
      subcategory: null,
      images: ['/images/scarfs/green.jpeg', '/images/scarfs/green1.jpeg', '/images/scarfs/green2.jpeg', '/images/scarfs/green3.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Violette',
      price: 40, stock: 15,
      description: 'Écharpe en cachemire violette.',
      subcategory: null,
      images: ['/images/scarfs/violet.jpeg', '/images/scarfs/violet1.jpeg', '/images/scarfs/violet2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Bordeaux',
      price: 40, stock: 10,
      description: 'Écharpe bordeaux en laine fine.',
      subcategory: null,
      images: ['/images/scarfs/burgundy.jpeg', '/images/scarfs/burgundy.jpeg', '/images/scarfs/burgundy.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Zébra',
      price: 40, stock: 8,
      description: 'Écharpe motif zébré.',
      subcategory: null,
      images: ['/images/scarfs/zebra.jpeg', '/images/scarfs/zebra1.jpeg', '/images/scarfs/zebra2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Tigrée',
      price: 40, stock: 6,
      description: 'Écharpe tigré en Bouclette.',
      subcategory: null,
      images: ['/images/scarfs/tigre.jpeg', '/images/scarfs/tigre1.jpeg', '/images/scarfs/tigre.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Rouge',
      price: 40, stock: 20,
      description: 'Écharpe rouge vif.',
      subcategory: null,
      images: [
        '/images/scarfs/red.jpeg',
         '/images/scarfs/rouge1.jpeg', 
         '/images/scarfs/red2.jpeg', 
         '/images/scarfs/red3.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Noire',
      price: 40, stock: 16,
      description: 'Écharpe noire élégante en Cachemire.',
      subcategory: null,
      images: [
        '/images/scarfs/noir.jpeg',
         '/images/scarfs/black1.jpeg', 
         '/images/scarfs/black.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Blanche',
      price: 40, stock: 12,
      description: 'Écharpe blanche légère.',
      subcategory: null,
      images: ['/images/scarfs/white.jpeg', '/images/scarfs/white1.jpeg', '/images/scarfs/white2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Marron Bouclette',
      price: 40, stock: 9,
      description: 'Écharpe Marron en Bouclette.',
      subcategory: null,
      images: ['/images/scarfs/brown.jpeg', '/images/scarfs/marrose.jpeg', '/images/scarfs/brown1.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Gris & Blanc',
      price: 40, stock: 9,
      description: 'Écharpe Gris & Blanc en Bouclette.',
      subcategory: null,
      images: ['/images/scarfs/grey.jpeg', '/images/scarfs/grey1.jpeg', '/images/scarfs/grey2.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Marron',
      price: 40, stock: 9,
      description: 'Écharpe Marron en Cachemire.',
      subcategory: null,
      images: ['/images/scarfs/marron.jpeg', '/images/scarfs/marron1.jpeg', '/images/scarfs/marron2.jpeg', '/images/scarfs/marron3.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Bleue',
      price: 40, stock: 14,
      description: 'Écharpe bleue en Melloton Gratté.',
      subcategory: null,
      images: ['/images/scarfs/bleu.jpeg', '/images/scarfs/bley.jpeg', '/images/scarfs/bleu.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Noir & Blanc',
      price: 40, stock: 7,
      description: 'Écharpe motif vache originale.',
      subcategory: null,
      images: ['/images/scarfs/cow.jpeg', '/images/scarfs/cow1.jpeg', '/images/scarfs/cow.jpeg'],
      category: S,
    },
    {
      name: 'Écharpe Jaune',
      price: 40, stock: 11,
      description: 'Écharpe jaune ensoleillée.',
      subcategory: null,
      images: ['/images/scarfs/jaune2.jpeg', '/images/scarfs/jaune1.jpeg', '/images/scarfs/jaune.jpeg'],
      category: S,
    },

    // ════════════════════════════════════════
    // ACCESSORIES — avec subcategory
    // ════════════════════════════════════════
    {
      name: 'Accessoire Cerise',
      price: 15, stock: 25,
      description: 'Bijou cerise artisanal.',
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/cerise.jpeg', '/images/accessoires/cerise1.jpeg', '/images/accessoires/cerise.jpeg'],
      category: A,
    },
    {
      name: 'Bracelet Élégant',
      price: 25, stock: 30,
      description: 'Bracelet acier inoxydable.',
      subcategory: 'bracelets',
      images: ['/images/accessoires/braclet.jpeg', '/images/accessoires/braclet.jpeg', '/images/accessoires/braclet.jpeg'],
      category: A,
    },
    {
      name: 'Collier Fleur',
      price: 25, stock: 18,
      description: 'Collier floral en acier inoxydable.',
      subcategory: 'colliers',
      images: ['/images/accessoires/collierfleur.jpeg', '/images/accessoires/collierfleur.jpeg', '/images/accessoires/collierfleur.jpeg'],
      category: A,
    },
    {
      name: 'Collier Tunisie',
      price: 20, stock: 20,
      description: 'Collier fin et élégant.',
      subcategory: 'colliers',
      images: ['/images/accessoires/collier1.jpeg', '/images/accessoires/collier.jpeg', '/images/accessoires/felfel.jpeg'],
      category: A,
    },
    {
      name: 'Boucles Coeur',
      price: 20, stock: 35,
      description: "Boucles d'oreilles en forme de coeur.",
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/coeur.jpeg', '/images/accessoires/coeur1.jpeg', '/images/accessoires/coeur2.jpeg'],
      category: A,
    },
    {
      name: 'Coquettes',
      price: 20, stock: 35,
      description: 'Accessoires coquettes assortis.',
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/coquettes.jpeg', '/images/accessoires/coquettes.jpeg', '/images/accessoires/coquettes.jpeg'],
      category: A,
    },
    {
      name: 'Papillon Décoratif',         
      price: 20, stock: 22,
      description: 'Accessoire papillon Dorée en acier inoxydable.',
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/papillon1.jpeg', '/images/accessoires/papillon2.jpeg', '/images/accessoires/papillon3.jpeg'],
      category: A,
    },
    {
      name: 'Bracelet Coeur',              
      price: 20, stock: 22,
      description: 'Bracelet Coeur chic en acier inoxydable.',
      subcategory: 'bracelets',
      images: [
        '/images/accessoires/bracletcoeur.jpeg',
         '/images/accessoires/bracletcoeur.jpeg', 
         '/images/accessoires/bracletcoeur.jpeg'],
      category: A,
    },
    {
      name: 'Boucles Multicolores',       
      price: 20, stock: 22,
      description: 'Boucles multicolores dorée en acier inoxydable.',
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/bouclecouleurs.jpeg', 
        '/images/accessoires/bouclecouleurs1.jpeg',
         '/images/accessoires/bouclecouleurs.jpeg'],
      category: A,
    },
     {
      name: 'Boucles Fleurs',       
      price: 20, stock: 22,
      description: 'Boucles Blanc et Noir en acier inoxydable.',
      subcategory: 'boucles-doreilles',
      images: ['/images/accessoires/bouclefleur.jpeg', 
        '/images/accessoires/bouclefleur.jpeg',
         ],
      category: A,
    },
    {
      name: 'Des Bagues dorée',              
      price: 10, stock: 22,
      description: 'Bagues en acier inoxydable.',
      subcategory: 'bagues',
      images: [
        '/images/accessoires/bagues.jpeg',
         ],
      category: A,
    },
{
      name: 'Deux Bagues dorée et argentée',              
      price: 10, stock: 22,
      description: 'Deux Bagues coeur en acier inoxydable.',
      subcategory: 'bagues',
      images: [
        '/images/accessoires/baguecoeur.jpeg',
         ],
      category: A,
    },
    // ════════════════════════════════════════
    // CLOTHING — avec subcategory
    // ════════════════════════════════════════
    {
      name: 'Trench Coat Noir long',            
      price: 120, stock: 22,
      description: 'Trench coat Noir élégant.',
      subcategory: 'coats',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'] ,
      images: ['/images/clothing/blanc1.jpeg', '/images/clothing/blanc.jpeg', '/images/clothing/blanc1.jpeg'],
      category: C,
    },
    {
      name: 'Burgundy Coat',               
      price: 180, stock: 22,
      description: 'Manteau bordeaux élégant.',
      subcategory: 'coats',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: ['/images/clothing/redcoat.jpeg', '/images/clothing/redcoat1.jpeg', '/images/clothing/redcoat.jpeg'],
      category: C,
    },
    {
      name: 'Trench Coat Beige',           
      price: 180, stock: 22,
      description: 'Trench coat beige classique.',
      subcategory: 'coats',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'] ,
      images: ['/images/clothing/trenchbeige.png', '/images/clothing/trenchbeige1.png'],
      category: C,
    },
    {
      name: 'Blazer Beige',                
      price: 100, stock: 22,
      description: 'Blazer beige raffiné.',
      subcategory: 'vestes',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'] ,
      images: ['/images/clothing/blazerbeige.png', '/images/clothing/blazerbeige1.png'],
      category: C,
    },
    {
      name: 'Chemise Rayée',              
      price: 45, stock: 22,
      description: 'Chemise en rayures élégante.',
      subcategory: 'Chemises',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'] ,
      images: ['/images/clothing/chemiserayé.png', '/images/clothing/chemiserayé1.png'],
      category: C,
    },
  ];

  // ── SUPPRIMER les anciens doublons en BDD ──────────────────
  const seedNames = products.map(p => p.name);
  const allInDb   = await productRepo.find();
  const toDelete  = allInDb.filter(p => !seedNames.includes(p.name));

  if (toDelete.length > 0) {
    await productRepo.remove(toDelete);
    console.log(`🗑  ${toDelete.length} produit(s) supprimé(s) : ${toDelete.map(p => p.name).join(', ')}`);
  }

  const deletedCount = toDelete.length;
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
        subcategory: p.subcategory,  // ← NOUVEAU
        status:      ProductStatus.PUBLISHED,
        isActive:    true,
      });
      updated++;
    } else {
      await productRepo.save(productRepo.create({
        ...p,
        subcategory: p.subcategory,  // ← NOUVEAU
        status:      ProductStatus.PUBLISHED,
        isActive:    true,
        viewsCount:  0,
        dimensions:  {},
        metadata:    {},
      }));
      created++;
    }
  }

  console.log(`\n🎉 Seed terminé — ✅ ${created} créés | 🔄 ${updated} mis à jour | 🗑 ${deletedCount} supprimés`);
};