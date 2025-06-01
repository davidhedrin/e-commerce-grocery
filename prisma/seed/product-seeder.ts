import { AuthProviderEnum, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`);
  
    await tx.product.createMany({
      data: [
        {
          slug: "green-apple-granny-smith",
          name: "Green Apple Granny Smith",
          desc: "Fresh green apples with a crisp texture and tangy flavor, perfect for snacking or salads.",
          short_desc: "Crisp and tangy green apples.",
          brand: "Nature's Best",
          uom: "Piece",
          img: "https://fisherscart.com/cdn/shop/products/greenapple.png?v=1672232680",
          category_id: 1,
          createdBy: "SEEDER"
        },
        {
          slug: "red-bell-pepper",
          name: "Red Bell Pepper",
          desc: "Sweet red bell peppers rich in vitamin C and antioxidants, ideal for stir-fry or salads.",
          short_desc: "Sweet and fresh red bell pepper.",
          brand: "Green Valley",
          uom: "Piece",
          img: "https://bonnieplants.com/cdn/shop/products/060721_T110854_202044_202178_Bonnie_PepperRedBell_ALT_01.jpg?v=1706042177",
          category_id: 1,
          createdBy: "SEEDER"
        },
        {
          slug: "fresh-salmon-fillet",
          name: "Fresh Salmon Fillet",
          desc: "High-quality fresh salmon fillets, rich in omega-3, suitable for grilling, baking, or sashimi.",
          short_desc: "Omega-3 rich fresh salmon.",
          brand: "Ocean's Best",
          uom: "Kilogram",
          img: "https://m.media-amazon.com/images/I/817y+lN3ohL._AC_UF894,1000_QL80_.jpg",
          category_id: 2,
          createdBy: "SEEDER"
        },
        {
          slug: "organic-chicken-breast",
          name: "Organic Chicken Breast",
          desc: "Boneless organic chicken breasts raised without antibiotics, a healthy lean protein source.",
          short_desc: "Organic boneless chicken breast.",
          brand: "Pure Farm",
          uom: "Kilogram",
          img: "https://greenpasturefarms.co.uk/wp-content/uploads/2018/05/Chicken-Whole-02.jpg",
          category_id: 2,
          createdBy: "SEEDER"
        },
        {
          slug: "organic-cottage-cheese",
          name: "Organic Cottage Cheese",
          desc: "Soft textured, low-fat organic cottage cheese, high in protein and great for healthy diets.",
          short_desc: "Organic, low-fat cottage cheese.",
          brand: "Green Dairy",
          uom: "Gram",
          img: "https://kalonacreamery.com/wp-content/uploads/2019/01/Square-Editing-18.jpg",
          category_id: 3,
          createdBy: "SEEDER"
        },
        {
          slug: "free-range-eggs",
          name: "Free Range Eggs",
          desc: "Naturally laid free-range eggs, packed with nutrients and superior flavor compared to regular eggs.",
          short_desc: "Healthy free-range eggs.",
          brand: "Farm Fresh",
          uom: "Dozen",
          img: "https://ganico.co.za/wp-content/uploads/2020/11/Farm-Eggs-04.jpg",
          category_id: 3,
          createdBy: "SEEDER"
        },
        {
          slug: "whole-wheat-bread",
          name: "Whole Wheat Bread",
          desc: "Whole grain bread without preservatives, high in fiber, ideal for a nutritious breakfast or snack.",
          short_desc: "High-fiber whole grain bread.",
          brand: "Bread Co.",
          uom: "Slice",
          img: "https://www.organicsbylee.com/wp-content/uploads/2019/03/wholewheatbread-copy.jpg",
          category_id: 4,
          createdBy: "SEEDER"
        },
        {
          slug: "chocolate-croissant",
          name: "Chocolate Croissant",
          desc: "Flaky croissant filled with melted Belgian chocolate, perfect for a sweet morning treat or snack.",
          short_desc: "Chocolate-filled croissant.",
          brand: "Pastry Delight",
          uom: "Piece",
          img: "https://pastriesbyrandolph.com/wp-content/uploads/2019/03/chocolate-croissant.jpg",
          category_id: 4,
          createdBy: "SEEDER"
        },
        {
          slug: "frozen-vegetable-mix",
          name: "Frozen Vegetable Mix",
          desc: "A blend of frozen carrots, peas, and corn, perfect for quick stir-fries or as a side dish.",
          short_desc: "Mixed frozen vegetables for quick meals.",
          brand: "Fresh Choice",
          uom: "Kilogram",
          img: "https://www.laurafuentes.com/wp-content/uploads/2022/12/Roasted-frozen-vegetables_RC-SQ.jpg",
          category_id: 5,
          createdBy: "SEEDER"
        },
        {
          slug: "frozen-french-fries",
          name: "Frozen French Fries",
          desc: "Crispy and golden frozen French fries, ideal for air frying or deep frying.",
          short_desc: "Crispy frozen French fries.",
          brand: "Golden Harvest",
          uom: "Kilogram",
          img: "https://www.dadcooksdinner.com/wp-content/uploads/2022/11/Instant-Pot-Air-Fryer-Frozen-French-Fries-1280x-DSCF1341.jpg",
          category_id: 5,
          createdBy: "SEEDER"
        },
        {
          slug: "chocolate-chip-cookies",
          name: "Chocolate Chip Cookies",
          desc: "Soft and chewy cookies loaded with chocolate chips, perfect for a sweet snack.",
          short_desc: "Soft chocolate chip cookies.",
          brand: "Sweet Treats",
          uom: "Pack",
          img: "https://handletheheat.com/wp-content/uploads/2020/10/BAKERY-STYLE-CHOCOLATE-CHIP-COOKIES-9-637x637-1-500x500.jpg",
          category_id: 6,
          createdBy: "SEEDER"
        },
        {
          slug: "cola-soda",
          name: "Cola Soda",
          desc: "Refreshing cola-flavored soda, carbonated and sweetened to perfection.",
          short_desc: "Classic cola soda.",
          brand: "Fizzy Pop",
          uom: "Liter",
          img: "https://s.alicdn.com/@sc04/kf/H75bc495024e143acab78b71f0414f72ck.jpg_720x720q50.jpg",
          category_id: 6,
          createdBy: "SEEDER"
        },
        {
          slug: "all-purpose-cleaner",
          name: "All-Purpose Cleaner",
          desc: "Multi-surface cleaner that removes dirt and grime, leaving a fresh scent.",
          short_desc: "Versatile all-purpose cleaner.",
          brand: "CleanMaster",
          uom: "Liter",
          img: "https://berducdn.com/img/1200/bsob0d3ebsof2awrmp_2/h42tHszBCzh0LP1h42l4n2lgpxbGLER4iBkYvctKOwww.jpg",
          category_id: 7,
          createdBy: "SEEDER"
        },
        {
          slug: "paper-towels",
          name: "Paper Towels",
          desc: "Absorbent paper towels for cleaning spills and wiping surfaces.",
          short_desc: "Strong and absorbent paper towels.",
          brand: "QuickWipe",
          uom: "Roll",
          img: "https://assets.onegoodthingbyjillee.com/2023/06/best-paper-towels.jpg",
          category_id: 7,
          createdBy: "SEEDER"
        },
        {
          slug: "vitamin-c-supplement",
          name: "Vitamin C Supplement",
          desc: "Immune-boosting Vitamin C tablets to support overall health.",
          short_desc: "Daily Vitamin C supplement.",
          brand: "HealthPlus",
          uom: "Tablet",
          img: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ndm/ndm01650/l/41.jpg",
          category_id: 8,
          createdBy: "SEEDER"
        },
        {
          slug: "aloe-vera-gel",
          name: "Aloe Vera Gel",
          desc: "Soothing aloe vera gel for skin hydration and relief from sunburn.",
          short_desc: "Natural aloe vera gel.",
          brand: "PureNature",
          uom: "Gram",
          img: "https://meihao.shopping/wp-content/uploads/2019/12/111007-1.jpg",
          category_id: 8,
          createdBy: "SEEDER"
        },
        {
          slug: "baby-diapers",
          name: "Baby Diapers",
          desc: "Soft and absorbent diapers to keep your baby comfortable and dry.",
          short_desc: "Comfortable baby diapers.",
          brand: "BabySoft",
          uom: "Pack",
          img: "https://image.astronauts.cloud/product-images/2025/3/babyhappys56_0f920c9b-9f60-4873-8912-21a57f4e3410_900x900.jpg",
          category_id: 9,
          createdBy: "SEEDER"
        },
        {
          slug: "kids-toothbrush",
          name: "Kids Toothbrush",
          desc: "Colorful toothbrush designed for children's small mouths and gentle brushing.",
          short_desc: "Fun and gentle kids toothbrush.",
          brand: "BrightSmiles",
          uom: "Piece",
          img: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//103/MTA-50319759/jordan_jordan-kids-toothbrush-hello-smile-soft_full01.jpg",
          category_id: 9,
          createdBy: "SEEDER"
        },
        {
          slug: "dog-food",
          name: "Dog Food",
          desc: "Nutritious dry dog food with essential vitamins and minerals for your pet's health.",
          short_desc: "Balanced nutrition for dogs.",
          brand: "PetCare",
          uom: "Kilogram",
          img: "https://www.petsense.com/cdn/shop/files/1879992.jpg?v=1726670805",
          category_id: 10,
          createdBy: "SEEDER"
        },
        {
          slug: "cat-litter",
          name: "Cat Litter",
          desc: "Clumping cat litter that controls odor and absorbs moisture effectively.",
          short_desc: "Odor-controlling cat litter.",
          brand: "KittyClean",
          uom: "Kilogram",
          img: "https://id-test-11.slatic.net/p/b4b9f59d484849f480bbb48f05bf3fd3.jpg",
          category_id: 10,
          createdBy: "SEEDER"
        }
      ]
    });
  });
  console.log('Multiple Products Created!');
}