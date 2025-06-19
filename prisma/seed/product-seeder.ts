import { PictureTypeEnum, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`);
  
    await tx.product.createMany({
      data: [
        {
          slug: "green-apple-granny-smith",
          name: "Green Apple Granny Smith",
          desc: "<h1 style=\"text-align: center;\">Green Apple Granny Smith: Rasa Asam Menyegarkan dari Alam</h1><p style=\"text-align: left;\">Apel hijau <strong>Granny Smith</strong> adalah pilihan sempurna bagi Anda yang menyukai <em>rasa segar dan asam</em>. Dengan tekstur <u>renyah dan juicy</u>, buah ini cocok untuk <strong>camilan sehat</strong> maupun campuran salad.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li>Rasa asam alami yang menyegarkan</li><li>Tekstur renyah yang memuaskan</li><li>Kaya akan <strong>vitamin C dan serat</strong></li></ul><h3 style=\"text-align: left;\">Cocok Untuk:</h3><ol><li>Salad buah atau sayur</li><li>Camilan sehat di pagi atau sore hari</li><li>Pelengkap smoothies dan jus</li></ol><p style=\"text-align: center;\"><em>“Salah satu apel paling segar yang pernah saya coba!”</em> — <strong>Fitri A., Jakarta</strong></p>",
          short_desc: "Crisp and tangy green apples.",
          brand: "Nature's Best",
          uom: "Pieces",
          img_type: PictureTypeEnum.URL,
          img_url: "https://fisherscart.com/cdn/shop/products/greenapple.png?v=1672232680",
          category_id: 1,
          createdBy: "SEEDER"
        },
        {
          slug: "red-bell-pepper",
          name: "Red Bell Pepper",
          desc: "<h1 style=\"text-align: center;\">Red Bell Pepper: Manis, Segar, dan Penuh Gizi</h1><p style=\"text-align: left;\">Paprika merah segar ini memiliki rasa <strong>manis alami</strong> dan <u>tekstur renyah</u> yang menjadikannya pilihan tepat untuk <em>masakan tumis, panggang, atau salad</em>. Mengandung <strong>vitamin C, A, dan antioksidan</strong> yang baik untuk tubuh.</p><h2 style=\"text-align: left;\">Kelebihan Produk:</h2><ul><li>Warna merah cerah, segar, dan menggoda</li><li>Tekstur tebal dan juicy</li><li>Sumber vitamin dan fitonutrien</li></ul><h3 style=\"text-align: left;\">Inspirasi Penggunaan:</h3><ol><li>Tumis sayur ala oriental</li><li>Salad Mediterania</li><li>Dibakar bersama ayam atau ikan</li></ol><p style=\"text-align: right;\"><em>“Rasa manisnya alami, cocok banget buat anak-anak!”</em> — <strong>Rina D., Bandung</strong></p>",
          short_desc: "Sweet and fresh red bell pepper.",
          brand: "Green Valley",
          uom: "Pieces",
          img_type: PictureTypeEnum.URL,
          img_url: "https://bonnieplants.com/cdn/shop/products/060721_T110854_202044_202178_Bonnie_PepperRedBell_ALT_01.jpg?v=1706042177",
          category_id: 1,
          createdBy: "SEEDER"
        },
        {
          slug: "fresh-salmon-fillet",
          name: "Fresh Salmon Fillet",
          desc: "<h1 style=\"text-align: center;\">Fresh Salmon Fillet: Kaya Nutrisi, Rasa Juara</h1><p style=\"text-align: left;\">Potongan <strong>fillet salmon segar</strong> ini berasal dari laut bersih dengan kualitas premium. <u>Kaya omega-3</u>, protein, dan vitamin D, sangat cocok untuk gaya hidup sehat dan <em>masakan spesial</em> keluarga Anda.</p><h2 style=\"text-align: left;\">Fitur Produk:</h2><ul><li>Daging lembut dan tidak berbau amis</li><li>Kualitas sashimi grade, aman dikonsumsi mentah</li><li>Kaya akan <strong>asam lemak baik</strong></li></ul><h3 style=\"text-align: left;\">Resep Populer:</h3><ol><li>Grilled salmon with lemon & herbs</li><li>Salmon teriyaki</li><li>Sashimi atau poke bowl</li></ol><p style=\"text-align: center;\"><em>“Lezat, segar, dan sehat! Salmon favorit keluarga.”</em> — <strong>Andri W., Surabaya</strong></p>",
          short_desc: "Omega-3 rich fresh salmon.",
          brand: "Ocean's Best",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://m.media-amazon.com/images/I/817y+lN3ohL._AC_UF894,1000_QL80_.jpg",
          category_id: 2,
          createdBy: "SEEDER"
        },
        {
          slug: "organic-chicken-breast",
          name: "Organic Chicken Breast",
          desc: "<h1 style=\"text-align: center;\">Organic Chicken Breast: Sehat, Bersih, dan Berkualitas</h1><p style=\"text-align: left;\">Dada ayam organik <strong>tanpa tulang</strong> ini berasal dari peternakan alami tanpa antibiotik atau hormon tambahan. <em>Sumber protein rendah lemak</em> yang sangat baik untuk kebutuhan nutrisi harian Anda.</p><h2 style=\"text-align: left;\">Kenapa Pilih Ini?</h2><ul><li><u>Organik bersertifikat</u> dan bebas bahan kimia</li><li>Tekstur lembut, mudah dimasak</li><li>Cocok untuk menu diet tinggi protein</li></ul><h3 style=\"text-align: left;\">Rekomendasi Menu:</h3><ol><li>Grilled chicken salad</li><li>Sup ayam herbal</li><li>Chicken breast panggang madu lemon</li></ol><p style=\"text-align: right;\"><em>“Rasanya juicy dan segar, benar-benar beda dari ayam biasa!”</em> — <strong>Nurul S., Yogyakarta</strong></p>",
          short_desc: "Organic boneless chicken breast.",
          brand: "Pure Farm",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://greenpasturefarms.co.uk/wp-content/uploads/2018/05/Chicken-Whole-02.jpg",
          category_id: 2,
          createdBy: "SEEDER"
        },
        {
          slug: "organic-cottage-cheese",
          name: "Organic Cottage Cheese",
          desc: "<h1 style=\"text-align: center;\">Organic Cottage Cheese: Lembut, Sehat, dan Bernutrisi</h1><p style=\"text-align: left;\">Keju cottage organik rendah lemak ini menawarkan <strong>tekstur lembut</strong> dan rasa creamy yang ringan. <em>Sempurna untuk menu diet tinggi protein</em>, vegetarian, maupun kudapan sehat sehari-hari.</p><h2 style=\"text-align: left;\">Manfaat Utama:</h2><ul><li>Tinggi protein, rendah lemak</li><li>Organik & tanpa pengawet buatan</li><li>Dapat dikombinasikan dengan buah, salad, atau sandwich</li></ul><h3 style=\"text-align: left;\">Cara Nikmat:</h3><ol><li>Campur dengan buah segar untuk sarapan</li><li>Tambahkan ke dalam salad sayur</li><li>Gunakan sebagai isian sandwich sehat</li></ol><p style=\"text-align: center;\"><em>“Lembut dan ringan, pas banget buat gaya hidup sehat saya.”</em> — <strong>Maria T., Bali</strong></p>",
          short_desc: "Organic, low-fat cottage cheese.",
          brand: "Green Dairy",
          uom: "Gram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://kalonacreamery.com/wp-content/uploads/2019/01/Square-Editing-18.jpg",
          category_id: 3,
          createdBy: "SEEDER"
        },
        {
          slug: "free-range-eggs",
          name: "Free Range Eggs",
          desc: "<h1 style=\"text-align: center;\">Free Range Eggs: Telur Sehat dari Ayam Bebas</h1><p style=\"text-align: left;\">Nikmati kualitas <strong>telur ayam kampung bebas</strong> dengan kandungan nutrisi lebih tinggi dan <em>rasa yang lebih kaya</em>. Telur ini dihasilkan dari ayam yang dibesarkan secara alami tanpa kandang sempit dan tanpa antibiotik.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li>Kuning telur lebih cerah dan padat nutrisi</li><li><u>Tinggi protein dan omega-3</u></li><li>Diproduksi secara etis dan ramah lingkungan</li></ul><h3 style=\"text-align: left;\">Cocok Untuk:</h3><ol><li>Omelet dan scrambled egg</li><li>Kue & roti premium</li><li>Menu diet tinggi protein</li></ol><p style=\"text-align: center;\"><em>“Kualitas telurnya terasa beda, lebih creamy!”</em> — <strong>Indra P., Bogor</strong></p>",
          short_desc: "Healthy free-range eggs.",
          brand: "Farm Fresh",
          uom: "Dozen",
          img_type: PictureTypeEnum.URL,
          img_url: "https://thehomesteadingrd.com/wp-content/uploads/2023/12/How-to-store-fresh-eggs.jpg",
          category_id: 3,
          createdBy: "SEEDER"
        },
        {
          slug: "whole-wheat-bread",
          name: "Whole Wheat Bread",
          desc: "<h1 style=\"text-align: center;\">Whole Wheat Bread: Roti Gandum Utuh untuk Hidup Sehat</h1><p style=\"text-align: left;\">Roti gandum utuh yang dibuat dari <strong>tepung gandum alami</strong> tanpa tambahan gula dan pengawet. Kaya <u>serat alami</u> dan <em>karbohidrat kompleks</em> untuk energi yang tahan lama.</p><h2 style=\"text-align: left;\">Kelebihan:</h2><ul><li>Rasa gurih khas gandum</li><li><strong>Tekstur lembut</strong> dan padat</li><li>Membantu pencernaan dan kenyang lebih lama</li></ul><h3 style=\"text-align: left;\">Rekomendasi Penyajian:</h3><ol><li>Sandwich sehat</li><li>Toast sarapan</li><li>Roti lapis vegetarian</li></ol><p style=\"text-align: right;\"><em>“Roti gandum favorit saya karena tidak terlalu manis dan teksturnya enak!”</em> — <strong>Ani L., Tangerang</strong></p>",
          short_desc: "High-fiber whole grain bread.",
          brand: "Bread Co.",
          uom: "Slice",
          img_type: PictureTypeEnum.URL,
          img_url: "https://www.organicsbylee.com/wp-content/uploads/2019/03/wholewheatbread-copy.jpg",
          category_id: 4,
          createdBy: "SEEDER"
        },
        {
          slug: "chocolate-croissant",
          name: "Chocolate Croissant",
          desc: "<h1 style=\"text-align: center;\">Chocolate Croissant: Lezatnya Pastry Prancis Isi Cokelat</h1><p style=\"text-align: left;\">Croissant lembut dengan lapisan mentega dan isian <strong>cokelat premium</strong>. Teksturnya <u>renyah di luar, lembut di dalam</u>, cocok untuk <em>sarapan atau camilan sore</em>.</p><h2 style=\"text-align: left;\">Fitur Unggulan:</h2><ul><li>Adonan asli gaya Prancis</li><li>Isi cokelat dark yang meleleh</li><li>Dibuat segar setiap hari</li></ul><h3 style=\"text-align: left;\">Nikmati dengan:</h3><ol><li>Kopi espresso</li><li>Teh hangat</li><li>Buah segar sebagai pendamping</li></ol><p style=\"text-align: center;\"><em>“Croissant ini juara! Lembut dan cokelatnya lumer banget.”</em> — <strong>Lina M., Jakarta</strong></p>",
          short_desc: "Chocolate-filled croissant.",
          brand: "Pastry Delight",
          uom: "Pieces",
          img_type: PictureTypeEnum.URL,
          img_url: "https://pastriesbyrandolph.com/wp-content/uploads/2019/03/chocolate-croissant.jpg",
          category_id: 4,
          createdBy: "SEEDER"
        },
        {
          slug: "frozen-vegetable-mix",
          name: "Frozen Vegetable Mix",
          desc: "<h1 style=\"text-align: center;\">Frozen Vegetable Mix: Sayuran Sehat Siap Masak</h1><p style=\"text-align: left;\">Campuran sayuran beku <strong>bernutrisi lengkap</strong> terdiri dari wortel, buncis, jagung, dan kacang polong. Diproses dengan teknik <u>flash freeze</u> untuk mempertahankan kesegaran dan vitamin alami.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li>Mudah & cepat dimasak</li><li>Tanpa tambahan pengawet</li><li>Sumber serat dan vitamin A, C, K</li></ul><h3 style=\"text-align: left;\">Cocok Untuk:</h3><ol><li>Capcay dan tumisan</li><li>Sup sayur sehat</li><li>Menu diet rendah kalori</li></ol><p style=\"text-align: right;\"><em>“Solusi praktis untuk tetap makan sayur tiap hari.”</em> — <strong>Yulia N., Depok</strong></p>",
          short_desc: "Mixed frozen vegetables for quick meals.",
          brand: "Fresh Choice",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://www.laurafuentes.com/wp-content/uploads/2022/12/Roasted-frozen-vegetables_RC-SQ.jpg",
          category_id: 5,
          createdBy: "SEEDER"
        },
        {
          slug: "frozen-french-fries",
          name: "Frozen French Fries",
          desc: "<h1 style=\"text-align: center;\">Frozen French Fries: Kentang Goreng Renyah Siap Saji</h1><p style=\"text-align: left;\">Kentang goreng beku siap masak yang terbuat dari <strong>kentang berkualitas tinggi</strong>. Potongan seragam dengan tekstur <u>renyah di luar dan lembut di dalam</u>, cocok untuk camilan atau pelengkap hidangan.</p><h2 style=\"text-align: left;\">Fitur:</h2><ul><li>Tidak perlu dikupas atau dipotong</li><li>Bisa digoreng atau dipanggang</li><li>Cocok untuk anak-anak & keluarga</li></ul><h3 style=\"text-align: left;\">Saran Penyajian:</h3><ol><li>Dengan saus tomat atau mayonnaise</li><li>Side dish untuk steak</li><li>Snack movie night</li></ol><p style=\"text-align: center;\"><em>“Anak-anak suka banget! Tinggal goreng langsung jadi.”</em> — <strong>Randy F., Semarang</strong></p>",
          short_desc: "Crispy frozen French fries.",
          brand: "Golden Harvest",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://www.dadcooksdinner.com/wp-content/uploads/2022/11/Instant-Pot-Air-Fryer-Frozen-French-Fries-1280x-DSCF1341.jpg",
          category_id: 5,
          createdBy: "SEEDER"
        },
        {
          slug: "chocolate-chip-cookies",
          name: "Chocolate Chip Cookies",
          desc: "<h1 style=\"text-align: center;\">Chocolate Chip Cookies: Manis, Renyah, dan Cokelatnya Melimpah</h1><p style=\"text-align: left;\">Kue kering klasik dengan <strong>potongan cokelat chip premium</strong> yang lumer di mulut. Dibuat dengan resep istimewa dan <u>mentega pilihan</u>, cocok untuk <em>kudapan sore hari</em> atau teman minum kopi.</p><h2 style=\"text-align: left;\">Keistimewaan:</h2><ul><li>Renyaah dan chewy di tengah</li><li><strong>Tidak terlalu manis</strong>, cocok semua usia</li><li>Dikemas segar dan rapi</li></ul><h3 style=\"text-align: left;\">Cocok Disajikan dengan:</h3><ol><li>Susu dingin</li><li>Teh hangat</li><li>Kopi hitam</li></ol><p style=\"text-align: right;\"><em>“Cookie-nya bikin nostalgia! Cokelatnya berasa banget.”</em> — <strong>Melati H., Bandung</strong></p>",
          short_desc: "Soft chocolate chip cookies.",
          brand: "Sweet Treats",
          uom: "Pack",
          img_type: PictureTypeEnum.URL,
          img_url: "https://handletheheat.com/wp-content/uploads/2020/10/BAKERY-STYLE-CHOCOLATE-CHIP-COOKIES-9-637x637-1-500x500.jpg",
          category_id: 6,
          createdBy: "SEEDER"
        },
        {
          slug: "cola-soda",
          name: "Cola Soda",
          desc: "<h1 style=\"text-align: center;\">Cola Soda: Sensasi Segar & Berbuih Tiap Saat</h1><p style=\"text-align: left;\">Minuman soda berkarbonasi dengan <strong>rasa kola klasik</strong> yang menyegarkan. Disajikan dingin, <u>cocok untuk pesta, makan berat, atau sekadar menyegarkan hari</u>.</p><h2 style=\"text-align: left;\">Fitur:</h2><ul><li>Buih ringan menyegarkan</li><li>Rasa khas yang tidak berubah sejak dulu</li><li>Pas diminum dingin dengan es</li></ul><h3 style=\"text-align: left;\">Nikmati Saat:</h3><ol><li>Piknik atau BBQ</li><li>Nonton film</li><li>Bersantai bersama teman</li></ol><p style=\"text-align: center;\"><em>“Klasik dan segar, selalu jadi pilihan utama saat makan.”</em> — <strong>Doni K., Bekasi</strong></p>",
          short_desc: "Classic cola soda.",
          brand: "Fizzy Pop",
          uom: "Liter",
          img_type: PictureTypeEnum.URL,
          img_url: "https://s.alicdn.com/@sc04/kf/H75bc495024e143acab78b71f0414f72ck.jpg_720x720q50.jpg",
          category_id: 6,
          createdBy: "SEEDER"
        },
        {
          slug: "all-purpose-cleaner",
          name: "All-Purpose Cleaner",
          desc: "<h1 style=\"text-align: center;\">All-Purpose Cleaner: Bersih Tuntas untuk Semua Permukaan</h1><p style=\"text-align: left;\">Pembersih serbaguna dengan <strong>formula anti-bakteri</strong> yang efektif menghilangkan noda, debu, dan kuman. Aman digunakan di dapur, kamar mandi, dan ruang tamu.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li><u>Efektif membunuh 99.9% kuman</u></li><li>Tidak meninggalkan bekas lengket</li><li>Aroma segar tahan lama</li></ul><h3 style=\"text-align: left;\">Ideal Untuk:</h3><ol><li>Lantai keramik & kayu</li><li>Permukaan meja dapur</li><li>Kamar mandi & toilet</li></ol><p style=\"text-align: right;\"><em>“Bersihnya maksimal, wanginya juga enak!”</em> — <strong>Elisa M., Surabaya</strong></p>",
          short_desc: "Versatile all-purpose cleaner.",
          brand: "CleanMaster",
          uom: "Liter",
          img_type: PictureTypeEnum.URL,
          img_url: "https://berducdn.com/img/1200/bsob0d3ebsof2awrmp_2/h42tHszBCzh0LP1h42l4n2lgpxbGLER4iBkYvctKOwww.jpg",
          category_id: 7,
          createdBy: "SEEDER"
        },
        {
          slug: "paper-towels",
          name: "Paper Towels",
          desc: "<h1 style=\"text-align: center;\">Paper Towels: Handuk Kertas Praktis Serap Maksimal</h1><p style=\"text-align: left;\">Tisu gulung serbaguna dengan <strong>daya serap tinggi</strong> dan <u>struktur kuat</u>, tidak mudah robek saat basah. Ideal untuk dapur, meja makan, dan keperluan rumah tangga lainnya.</p><h2 style=\"text-align: left;\">Fitur Utama:</h2><ul><li>Lapisan ganda lebih tebal</li><li>Tidak mudah hancur saat basah</li><li>Praktis & ekonomis</li></ul><h3 style=\"text-align: left;\">Digunakan Untuk:</h3><ol><li>Menyerap minyak makanan</li><li>Membersihkan permukaan</li><li>Mengeringkan tangan atau buah</li></ol><p style=\"text-align: center;\"><em>“Selalu sedia ini di dapur. Multifungsi dan kuat.”</em> — <strong>Ratih Y., Denpasar</strong></p>",
          short_desc: "Strong and absorbent paper towels.",
          brand: "QuickWipe",
          uom: "Roll",
          img_type: PictureTypeEnum.URL,
          img_url: "https://assets.onegoodthingbyjillee.com/2023/06/best-paper-towels.jpg",
          category_id: 7,
          createdBy: "SEEDER"
        },
        {
          slug: "vitamin-c-supplement",
          name: "Vitamin C Supplement",
          desc: "<h1 style=\"text-align: center;\">Vitamin C Supplement: Jaga Daya Tahan Tubuh Setiap Hari</h1><p style=\"text-align: left;\">Suplemen harian dengan <strong>dosis Vitamin C 500mg</strong> untuk membantu memperkuat <u>sistem imun</u> dan menangkal radikal bebas. Aman dikonsumsi setiap hari untuk dewasa.</p><h2 style=\"text-align: left;\">Manfaat:</h2><ul><li>Meningkatkan daya tahan tubuh</li><li>Antioksidan kuat</li><li>Mendukung produksi kolagen</li></ul><h3 style=\"text-align: left;\">Dianjurkan Untuk:</h3><ol><li>Aktivitas tinggi & mudah lelah</li><li>Musim pancaroba</li><li>Pemulihan setelah sakit</li></ol><p style=\"text-align: right;\"><em>“Sejak rutin minum ini, saya jarang flu!”</em> — <strong>Bayu H., Medan</strong></p>",
          short_desc: "Daily Vitamin C supplement.",
          brand: "HealthPlus",
          uom: "Tablet",
          img_type: PictureTypeEnum.URL,
          img_url: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ndm/ndm01650/l/41.jpg",
          category_id: 8,
          createdBy: "SEEDER"
        },
        {
          slug: "aloe-vera-gel",
          name: "Aloe Vera Gel",
          desc: "<h1 style=\"text-align: center;\">Aloe Vera Gel: Perawatan Alami untuk Kulit Sehat</h1><p style=\"text-align: left;\">Gel lidah buaya murni yang <strong>menyegarkan dan melembapkan</strong>, cocok untuk semua jenis kulit. <u>Mengandung 99% ekstrak aloe vera alami</u>, membantu meredakan iritasi, <em>melembutkan kulit</em>, dan mempercepat regenerasi sel kulit.</p><h2 style=\"text-align: left;\">Manfaat Utama:</h2><ul><li>Meredakan kulit terbakar matahari</li><li>Melembapkan kulit kering & sensitif</li><li>Dipakai sebagai masker wajah atau pelembap harian</li></ul><h3 style=\"text-align: left;\">Cara Pakai:</h3><ol><li>Oleskan tipis ke wajah atau tubuh</li><li>Gunakan setelah mandi atau sebelum tidur</li><li>Simpan di kulkas untuk efek dingin maksimal</li></ol><p style=\"text-align: center;\"><em>“Gel aloe ini bikin kulit wajahku jadi adem dan glowing.”</em> — <strong>Dewi K., Solo</strong></p>",
          short_desc: "Natural aloe vera gel.",
          brand: "PureNature",
          uom: "Gram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://meihao.shopping/wp-content/uploads/2019/12/111007-1.jpg",
          category_id: 8,
          createdBy: "SEEDER"
        },
        {
          slug: "baby-diapers",
          name: "Baby Diapers",
          desc: "<h1 style=\"text-align: center;\">Baby Diapers: Popok Bayi Lembut & Tahan Lama</h1><p style=\"text-align: left;\">Popok bayi dengan <strong>daya serap tinggi</strong> dan <u>bahan super lembut</u> untuk kenyamanan kulit bayi yang sensitif. <em>Desain ergonomis</em> yang pas di tubuh dan tidak mudah bocor membuat si kecil tetap nyaman sepanjang hari.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li>Lapisan cepat serap dan anti bocor</li><li>Permukaan lembut dan bebas parfum</li><li>Desain slim-fit, tidak menggumpal</li></ul><h3 style=\"text-align: left;\">Cocok Digunakan:</h3><ol><li>Siang dan malam hari</li><li>Saat bepergian jauh</li><li>Untuk bayi aktif dan banyak bergerak</li></ol><p style=\"text-align: right;\"><em>“Anakku tidur nyenyak semalaman tanpa bocor.”</em> — <strong>Vina L., Malang</strong></p>",
          short_desc: "Comfortable baby diapers.",
          brand: "BabySoft",
          uom: "Pack",
          img_type: PictureTypeEnum.URL,
          img_url: "https://image.astronauts.cloud/product-images/2025/3/babyhappys56_0f920c9b-9f60-4873-8912-21a57f4e3410_900x900.jpg",
          category_id: 9,
          createdBy: "SEEDER"
        },
        {
          slug: "kids-toothbrush",
          name: "Kids Toothbrush",
          desc: "<h1 style=\"text-align: center;\">Kids Toothbrush: Sikat Gigi Anak Lembut & Menyenangkan</h1><p style=\"text-align: left;\">Sikat gigi khusus anak dengan <strong>bulu halus dan kepala kecil</strong>, dirancang untuk menjangkau gigi anak dengan sempurna. <u>Desain lucu & warna cerah</u> menjadikan waktu sikat gigi lebih menyenangkan dan menyemangati anak untuk rutin menjaga kebersihan mulut.</p><h2 style=\"text-align: left;\">Fitur Unggulan:</h2><ul><li>Bulu ultra-soft, tidak melukai gusi</li><li>Gagang ergonomis dan antiselip</li><li>Tersedia dalam berbagai karakter lucu</li></ul><h3 style=\"text-align: left;\">Direkomendasikan Untuk:</h3><ol><li>Anak usia 3–10 tahun</li><li>Gigi susu dan gusi sensitif</li><li>Kebiasaan menyikat gigi sejak dini</li></ol><p style=\"text-align: center;\"><em>“Anak saya sekarang semangat sikat gigi tiap pagi.”</em> — <strong>Maya S., Jakarta</strong></p>",
          short_desc: "Fun and gentle kids toothbrush.",
          brand: "BrightSmiles",
          uom: "Pieces",
          img_type: PictureTypeEnum.URL,
          img_url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//103/MTA-50319759/jordan_jordan-kids-toothbrush-hello-smile-soft_full01.jpg",
          category_id: 9,
          createdBy: "SEEDER"
        },
        {
          slug: "dog-food",
          name: "Dog Food",
          desc: "<h1 style=\"text-align: center;\">Dog Food: Nutrisi Seimbang untuk Anjing Anda</h1><p style=\"text-align: left;\">Makanan anjing berkualitas dengan <strong>kandungan protein tinggi</strong>, vitamin, dan mineral untuk <u>pertumbuhan sehat dan bulu berkilau</u>. Formulasi seimbang yang cocok untuk anjing aktif maupun anjing senior.</p><h2 style=\"text-align: left;\">Keunggulan:</h2><ul><li>Tinggi protein hewani</li><li>Diperkaya omega-3 dan omega-6</li><li>Bebas pewarna dan perasa buatan</li></ul><h3 style=\"text-align: left;\">Cocok Untuk:</h3><ol><li>Anjing ras kecil dan besar</li><li>Anjing dengan alergi kulit ringan</li><li>Penggunaan harian sebagai makanan utama</li></ol><p style=\"text-align: right;\"><em>“Bulu anjing saya jadi lebih halus dan tidak rontok.”</em> — <strong>Bayu R., Bekasi</strong></p>",
          short_desc: "Balanced nutrition for dogs.",
          brand: "PetCare",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://www.petsense.com/cdn/shop/files/1879992.jpg?v=1726670805",
          category_id: 10,
          createdBy: "SEEDER"
        },
        {
          slug: "cat-litter",
          name: "Cat Litter",
          desc: "<h1 style=\"text-align: center;\">Cat Litter: Pasir Kucing Wangi & Gumpal Cepat</h1><p style=\"text-align: left;\">Pasir kucing berkualitas dengan <strong>daya gumpal tinggi</strong> dan <u>aroma segar alami</u>. Membantu menjaga kebersihan kotak pasir dan meminimalisir bau tidak sedap di dalam rumah.</p><h2 style=\"text-align: left;\">Fitur:</h2><ul><li>Clumping cepat, mudah dibersihkan</li><li>Wangi lavender menyerap bau</li><li>Bebas debu, aman untuk kucing sensitif</li></ul><h3 style=\"text-align: left;\">Digunakan Untuk:</h3><ol><li>Kucing rumahan segala usia</li><li>Kotak pasir tertutup atau terbuka</li><li>Lingkungan rumah bersih dan bebas bau</li></ol><p style=\"text-align: center;\"><em>“Gak bau dan gampang banget dibersihin, recommended!”</em> — <strong>Intan L., Bandung</strong></p>",
          short_desc: "Odor-controlling cat litter.",
          brand: "KittyClean",
          uom: "Kilogram",
          img_type: PictureTypeEnum.URL,
          img_url: "https://id-test-11.slatic.net/p/b4b9f59d484849f480bbb48f05bf3fd3.jpg",
          category_id: 10,
          createdBy: "SEEDER"
        }
      ]
    });
  });
  console.log('Multiple Products Created!');
}