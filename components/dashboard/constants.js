import { colors } from "../../styles/base";

export const RECRUITMENT_BONUS_VALUE = 50000;
export const PPN_VALUE = 1.1 / 0.1;
export const SALES_COMMISSION = 0.1;
export const PV_CONSTANT = 50000;
export const MIN_MONTHLY_SALES = 2000000;
export const MAX_MONTHLY_SALES = 100000000;
export const MAX_MEMBERS_RECRUITED = 10;

export const LEVEL_A_COMMISSION = 0.05;
export const LEVEL_B_COMMISSION = 0.02;
export const LEVEL_C_COMMISSION = 0.03;
export const LEVEL_D_COMMISSION = 0.04;

export const LEVEL_LABELS = ["", "A", "B", "C", "D"];

export const SIMULATOR_DISCLAIMER = `- Simulasi ini berlaku jika semua jaringan melakukan penjualan dan rekrutmen yang sama.\n\n- Saldo sudah termasuk bonus rekrutmen.`;

export const dashboardbuttonsdefaultwidth = 160;
export const dashboardbuttonsdefaultheight = 72;
export const dashboardbuttonsdefaultpaddingvertical = 12;
export const dashboardbuttonsdefaultpaddinghorizontal = 10;
export const dashboardbuttonsdefaultmarginbottom = 12;
export const dashboardbuttonsdefaultfontsize = 14;
export const dashboardbuttonsdefaulticonsize = 24;
export const dashboardbuttonsdefaultborderwidth = 1;
export const dashboardbuttonsdefaultborderradius = 2;

export const dashboardbuttonsdefaultscreenwidth = 390;
export const dashboardbuttonsmaxratio = 1.25;

export const userroottitle = "USER ROOTS";

export const saldomasuktag = "Saldo Masuk";
export const saldokeluartag = "Saldo Keluar";

export const withdrawalhistorytab = "Penarikan";
export const withdrawalhistoryicon = "cash-refund";
export const saldohistorytab = "Riwayat Saldo";
export const saldohistoryicon = "account-cash";

export const dashboardbrowser = "Buka Dashboard Web";
export const userverified = "Terverifikasi";
export const notverified = "Belum Terverifikasi";
export const emailnotverified = "Email Belum Terverifikasi";
export const phonenotverified = "No Telp Belum Terverifikasi";

export const hpvtitle = "Home Point Value";
export const rpvtitle = "Root Point Value";
export const rpvshort = "RPV";
export const pvtitle = "Poin Penjualan Bulanan";
export const bonusfirstroot = "Bonus Keuntungan Root Pertama";
export const bonussecondroot = "Bonus Keuntungan Root Kedua";
export const personalwebsite = "Buka Toko Online";

export const bonusrootlevelcolors = [
  colors.daclen_green,
  colors.daclen_orange,
  colors.daclen_red,
  colors.daclen_reddishbrown,
];

export const WATERMARK_PHOTO = "Foto Promosi";
export const WATERMARK_VIDEO = "Video Promosi";
export const watermarkphotoicon = "image";
export const watermarkvideoicon = "video-box";

export const penjelasanbisnistag = "Penjelasan Bisnis";
export const kataloghadiahtag = "Katalog Hadiah";
export const kodeetiktag = "Kode Etik";

export const linkcopied = "Tersimpan ke Clipboard";
export const sharingdialogtitle = "Bagikan Link Referral";

export const dashboardonboardingtext1 = "Dengan membayar sejumlah";
export const dashboardonboardingtext2 = null;
export const dashboardonboardingtext3 =
  "Anda dapat menikmati semua fitur dan keuntungan setelah proses pembayaran selesai.";
export const dashboardonboardingbutton = "Bergabung Sekarang!";

export const withdrawalexplanation = `
- Minimal penarikan saldo Rp. 50.000,-. 
- Maksimal penarikan saldo adalah Rp. 25.000.000,- atau sesuai kebijakan tiap bank. 
- Metode transfer menggunakan sistem Real Time Online (RTO). 
- Transfer uang melalui RTO dilakukan secara internet banking. 
- Setiap penarikan saldo, dikenakan biaya admin sebesar Rp10.000,-. 
- Transfer uang akan diproses admin pada waktu kerja dari hari senin - jumat, pada pukul 8:00 WIB - 17:00 WIB
`;

export const countdowntitle = "COUNTDOWN";
export const countdowncompletedtitle = "MISSION COMPLETED";
export const countdowndays = "DAYS";
export const countdownhours = "HOURS";
export const countdownminutes = "MINUTES";
export const countdownseconds = "SECONDS";
export const countdownbottom = "Recruitment Target: ";
export const countdownbottomfrozen = "Total Recruitment for 90 Days: ";
export const countdownbottommessage =
  "Dapatkan bonus saldo sebesar Rp 50.000\nuntuk setiap seller yang Anda ajak untuk bergabung!";
export const countdownbottomplural = "Sellers";
export const countdownbottomsingular = "Seller";
export const countdowngreen = "green";
export const countdownorange = "orange";
export const countdownred = "red";
export const countdownfrozen = "frozen";

export const timereplanationtext = `
1. Tampilan dasar countdown terdiri atas 4 warna, yaitu Merah, Orange, Hijau dan Biru yang merupakan indikasi sisa waktu yang tersedia.

a. Tampilan berwarna Hijau akan tampil saat sisa waktu recruitment berada pada rentang 90 hingga 60 hari.
b. Tampilan berwarna Orange akan tampil saat sisa waktu recruitment berada pada rentang waktu 59 hingga 30 hari.
c. Tampilan berwarna Merah akan tampil saat sisa waktu recruitment berada pada rentang waktu 29 hingga 0 hari.
d. Tampilan berwarna biru akan tampil saat seller telah berhasil melakukan recruitment lebih dari atau sama dengan 3 orang dalam 3 bulan tersebut

2. Perhitungan waktu dalam format Hari : Jam : Menit : Detik.

3. Periode perhitungan waktu dimulai sejak seller tersebut terdaftar sebagai seller Daclen dibuktikan dengan transaksi pembayaran registrasi member yang berhasil dan divalidasi oleh sistem.

4. Jika setelah perhitungan waktu berakhir seller tersebut tidak mendapatkan 3 recruitment, maka akun seller tersebut akan dinon-aktifkan.

5. Khusus untuk tampilan countdown berwarna merah, block tampilan akan dibuat berkedip-kedip lambat sedangkan tulisannya / angkanya tetap tidak berkedip.

6. Khusus untuk tampilan countdown berwarna biru, waktu tampil akan “freeze” saat target tercapai, sedangkan total recruitment akan terus bertambah sampai rentang waktu periode tersebut berakhir.

7. Jika dalam 14 hari sebelum masa waktu berakhir belum mendapat 3 seller, maka akan dikirimkan pesan otomatis sebagai pengingat dari sistem Daclen kepada seller tersebut.

8. Periode perhitungan waktu akan otomatis diulang setiap 90 hari dari tanggal seller tersebut terdaftar di sistem Daclen.
`;

const checkoutdatatemp = {
  id: 101,
  total: 1250000,
  total_currency: "1.250.000",
  metode_pembayaran: "bank_transfer",
  kode_kupon: null,
  bukti_refund: "",
  status: "diproses",
  invoice: "INV/170047411620231120/00017",
  tipe_kemasan: null,
  kurir: {
    id: 103,
    nama: "ANTERAJA REG",
    harga: 11200,
    harga_currency: "11.200",
    slug: "anteraja",
    deskripsi: "Layanan Reguler",
    estimasi: "1",
    link: "#",
    gratis_ongkir: 30000,
  },
  keranjang: {
    id: 186,
    user_id: 66,
    user: {
      id: 66,
      name: "tester",
      level: "pengguna",
      status_member: "premium",
      email: "daclenmobile@gmail.com",
      email_verified_at: null,
      nomor_telp_formated: "6281806546745",
      nomor_telp: "081806546745",
      nomor_telp_verified_at: "2023-11-20T11:43:58+07:00",
      diverifikasi: true,
      detail_user: {
        nama_depan: "tester",
        nama_belakang: null,
        jenis_kelamin: "l",
        tanggal_lahir: null,
        nama_lengkap: "tester ",
        alamat: "jl daclen",
        alamat_lengkap:
          "jl daclen, Jawa Barat, Kota Bandung, Astana Anyar. 40235",
        kode_pos: "40235",
        nomor_telp: "081806546745",
        nomor_rekening: "123456789",
        bank: {
          id: 1,
          nama: "Bank Something",
          biaya_admin: 6500,
          status: "dipakai",
          isDipakai: true,
        },
        cabang_bank: "bandung",
        foto: null,
        instagram: null,
        facebook: null,
        tiktok: null,
        wm_nama: null,
        wm_nomor_telepon: null,
        foto_url: "https://dev.daclen.id/",
        user_id: 66,
        provinsi: { id: "9", name: "Jawa Barat" },
        kota: { provinsi_id: "9", id: "23", name: "Kota Bandung" },
        kecamatan: { kota_id: "23", id: "341", name: "Astana Anyar" },
        desa: null,
      },
      poin_user: { user_id: 66, hpv: 220, poin: 22, total: 220 },
      komisi_user: {
        id: 382,
        user_id: 66,
        komisi: -605000,
        total: 0,
        komisi_currency: "-605.000",
        total_currency: "0",
      },
      bonus_level_user: {
        id: 126,
        bonus_level: 0,
        total: 0,
        bonus_level_currency: "0",
        total_currency: "0",
        setting_bonus_level: null,
      },
      poin_user_this_month: "220",
      is_lifetime_sales: 0,
      isDetailUserLengkap: true,
      referral: "user2",
    },
    produk: [
      {
        id: 1,
        nama: "quia quo vitae",
        prefix_kode_produk: "XF",
        slug: "test",
        foto: "img/sample-img.jpg",
        thumbnail: "img/sample-img.jpg",
        thumbnail_url:
          "https://dummyimage.com/600x600/fefefe/000000.png&text=quia+quo+vitae",
        foto_url:
          "https://dummyimage.com/600x600/fefefe/000000.png&text=quia+quo+vitae",
        harga: "1.250.000",
        harga_value: 1250000,
        harga_poin: "89",
        tag_produk: [{ id: 1, nama: "dolor", icon: "https://dev.daclen.id/" }],
        popularitas: 78,
        deskripsi:
          "Necessitatibus et veritatis consequatur. Similique nesciunt ipsam similique eligendi quibusdam. Ut excepturi voluptas sed inventore. Nostrum unde nihil exercitationem quas velit excepturi est.\n\nUt quod libero ut rerum. Ratione illo quas ea veniam debitis. Incidunt autem nobis non.\n\nEum ut enim nihil laboriosam officiis. Alias quo alias laboriosam error quos dicta quisquam. Voluptate consequatur voluptate aliquid et.",
        stok: 1000,
        dimensi: "50x33x36",
        dimensi_box: null,
        berat: "961",
        berat_dari_volume: 0.01,
        kode_produk: "939626",
        poin_produk: { id: 1, ppn: 10, komisi: 10, bv: 1125000, poin: 22 },
        foto_produk: [
          {
            id: 1,
            foto_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
            thumbnail_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
          },
          {
            id: 2,
            foto_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
            thumbnail_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
          },
          {
            id: 3,
            foto_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
            thumbnail_url: "https://dev.daclen.id/img/undraw_posting_photo.svg",
          },
        ],
        link_video: null,
        created_at: "2023-12-11T03:23:55.000000Z",
        updated_at: "2023-12-11T03:23:56.000000Z",
        jumlah: 1,
        subtotal: 1250000,
        subtotal_currency: "1.250.000",
      },
    ],
    subtotal: 1250000,
    berat: 961,
    berat_dari_volume: 0.01,
    berat_formated: "0,96",
    berat_dari_volume_formated: "0,00",
    berat_fix: 961.01,
    berat_fix_formated: "0,96",
    subtotal_currency: "1.250.000",
    jumlah_produk: 1,
    cashback: 125000,
    hasStok: 0,
  },
  detail_checkout: {
    id: 97,
    checkout_id: 101,
    nama_depan: "Tester",
    nama_belakang: null,
    nama_pengirim: null,
    nama_penerima: "Daclen Official",
    nama_perusahaan: null,
    alamat: "ruko R2 no 42 Jalan Pasadena Kopo",
    kode_pos: "40224",
    nomor_telp: "081806546745",
    email: "daclenmobile@gmail.com",
    catatan: null,
    alamat_lain: 1,
    provinsi: { id: "9", name: "Jawa Barat" },
    kota: { provinsi_id: "9", id: "23", name: "Kota Bandung" },
    kecamatan: { kota_id: "23", id: "342", name: "Babakan Ciparay" },
    desa: null,
    nama_lengkap: "Tester ",
    alamat_lengkap:
      "ruko R2 no 42 Jalan Pasadena Kopo, Babakan Ciparay, Kota Bandung, Jawa Barat. 40224",
    long: null,
    lat: null,
    alasan: null,
  },
  created_at: "20-11-2023",
  updated_at: "20-11-2023",
  pembayaran_dengan_saldo: [
    {
      id: 382,
      user_id: 66,
      checkout_id: 101,
      komisi: -605000,
      total: 0,
      created_at: "2023-11-20T09:55:16.000000Z",
      updated_at: "2023-11-20T09:55:16.000000Z",
      referral_id: null,
      penarikan_komisi_id: null,
      user: {
        id: 66,
        name: "tester",
        level: "pengguna",
        status_member: "premium",
        status: "reseller",
        email: "daclenmobile@gmail.com",
        nomor_telp_verified_at: "2023-11-20 11:43:58",
        nomor_telp: "081806546745",
        email_verified_at: null,
        created_at: "2023-11-20T04:24:34.000000Z",
        updated_at: "2023-11-20T09:42:58.000000Z",
        parent_id: 2,
        last_online: "2023-11-20 16:42:58",
        last_login: "2023-11-20 16:42:57",
        is_kortim: 0,
        is_lifetime_sales: 0,
        detail_user: {
          id: 66,
          user_id: 66,
          nik: null,
          nama_depan: "tester",
          nama_belakang: null,
          tanggal_lahir: null,
          jenis_kelamin: "l",
          nama_perusahaan: null,
          alamat: "jl daclen",
          provinsi: '{"id":"9","name":"Jawa Barat"}',
          kota: '{"provinsi_id":"9","id":"23","name":"Kota Bandung"}',
          kecamatan: '{"kota_id":"23","id":"341","name":"Astana Anyar"}',
          desa: null,
          kode_pos: "40235",
          foto: null,
          created_at: "2023-11-20T04:24:34.000000Z",
          updated_at: "2023-11-20T09:12:10.000000Z",
          nomor_rekening: "123456789",
          bank_id: 1,
          cabang_bank: "bandung",
          long: null,
          lat: null,
          instagram: null,
          facebook: null,
          tiktok: null,
          wm_nama: null,
          wm_nomor_telp: null,
          bank: {
            id: 1,
            nama: "Bank Something",
            biaya_admin: 6500,
            status: "dipakai",
            created_at: "2023-12-11T03:23:55.000000Z",
            updated_at: "2023-11-20T04:46:46.000000Z",
          },
        },
      },
    },
  ],
  has_used_saldo: true,
};

export const devuserroottree = {
  data: {
    id: 1,
    name: "Admin",
    title: "HPV 9216",
    foto: "https://devdcn.com/img/user.svg",
    children: [
      {
        id: 2,
        name: "user2",
        title: "HPV 1233",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 78,
            name: "user78",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 3,
        name: "user3",
        title: "HPV 2304",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 9,
            name: "user9",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 10,
            name: "user10",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 11,
            name: "user11",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 21,
            name: "user21",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 22,
            name: "user22",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 23,
            name: "user23",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 69,
            name: "user69",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 70,
            name: "user70",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 71,
            name: "user71",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 4,
        name: "user4",
        title: "HPV 2304",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 12,
            name: "user12",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 13,
            name: "user13",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 14,
            name: "user14",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 24,
            name: "user24",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 25,
            name: "user25",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 26,
            name: "user26",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 72,
            name: "user72",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 73,
            name: "user73",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 74,
            name: "user74",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 5,
        name: "user5",
        title: "HPV 2304",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 15,
            name: "user15",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 16,
            name: "user16",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 17,
            name: "user17",
            title: "HPV 576",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 27,
            name: "user27",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 28,
            name: "user28",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 29,
            name: "user29",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 75,
            name: "user75",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 76,
            name: "user76",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 77,
            name: "user77",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 6,
        name: "user6",
        title: "HPV 576",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 30,
            name: "user30",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 31,
            name: "user31",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 32,
            name: "user32",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 78,
            name: "user78",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 79,
            name: "user79",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 80,
            name: "user80",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 7,
        name: "user7",
        title: "HPV 576",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 33,
            name: "user33",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 34,
            name: "user34",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 35,
            name: "user35",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 81,
            name: "user81",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 82,
            name: "user82",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 83,
            name: "user83",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 8,
        name: "user8",
        title: "HPV 576",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 36,
            name: "user36",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 37,
            name: "user37",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 38,
            name: "user38",
            title: "HPV 144",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 84,
            name: "user84",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 85,
            name: "user85",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 86,
            name: "user86",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 18,
        name: "user18",
        title: "HPV 144",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 114,
            name: "user114",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 115,
            name: "user115",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 116,
            name: "user116",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 19,
        name: "user19",
        title: "HPV 144",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 117,
            name: "user117",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 118,
            name: "user118",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 119,
            name: "user119",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 20,
        name: "user20",
        title: "HPV 144",
        foto: "https://devdcn.com/img/user.svg",
        children: [
          {
            id: 120,
            name: "user120",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 121,
            name: "user121",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
          {
            id: 122,
            name: "user122",
            title: "HPV 36",
            foto: "https://devdcn.com/img/user.svg",
          },
        ],
      },
      {
        id: 66,
        name: "user66",
        title: "HPV 36",
        foto: "https://devdcn.com/img/user.svg",
      },
      {
        id: 67,
        name: "user67",
        title: "HPV 36",
        foto: "https://devdcn.com/img/user.svg",
      },
      {
        id: 68,
        name: "user68",
        title: "HPV 36",
        foto: "https://devdcn.com/img/user.svg",
      },
    ],
  },
};
