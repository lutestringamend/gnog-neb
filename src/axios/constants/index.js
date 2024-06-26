export const appname = "Daclen"
export const mainhttp = "https://daclen.com/"
//export const mainhttp = "https://dev.daclen.id/"
export const devhttp = "https://dev.daclen.id/"
//export const mainhttpcookie = "https://dev.daclen.id"
export const localisationID = "id-ID";
export const defaultcurrency = "IDR";
export const defaultcountry = "Indonesia";

export const googleAPIkey = "AIzaSyAyT3F_f80zLWHNHSiG2oZMjW5G_Z9jhy4"
//export const placesAPIkey = "AIzaSyAyT3F_f80zLWHNHSiG2oZMjW5G_Z9jhy4";
//export const googleAPIdevkey = "AIzaSyDK1LZOoEtLWkcunXe40MKc-VO7oZjXQ7A";

export const MIDTRANS_PROD_DOMAIN = "https://app.midtrans.com/"
export const MIDTRANS_SB_DOMAIN = "https://app.sandbox.midtrans.com/"
export const MIDTRANS_CLIENT_KEY = "Mid-client-BqXWNDpvPhUU7fB1"
export const SB_MIDTRANS_CLIENT_KEY = "SB-Mid-client-xamInlBsiMBuJSWC"

export const GCMSenderID = "1095241178397";
export const FCM_SERVER_KEY = "";

export const defaultlatitude = -6.921697335392908;
export const defaultlongitude = 107.60708919873582;
export const defaultlatitudedelta = 0.01214273;
export const defaultlongitudedelta = 0.00759031;
/*export const defaultbottomleftlat = -7.115984080856939;
export const defaultbottomleftlong = 107.41366415523095;
export const defaulttoprightlat = -6.776729021061178;
export const defaulttoprightlong = 107.86793313814107;*/
export const defaultlatitudelongbits = "-4603892706931430400";
export const defaultlongitudelongbits = "4637272587357913000";

export const phone_regex = RegExp(/^[\s()+-]*([0-9][\s()+-]*){6,20}$/);
export const email_regex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
export const username_regex = RegExp(
  /^(?=.*[0-9])(?=.*[0-9])[a-z0-9]{16}$/
);
export const uppercase_regex = RegExp(
  /[A-Z]/
);

export const testerusercode = "devdcn";
export const tempdeadlineintervalinmiliseconds = 7776000000;
export const TEMP_DEV_DEVICE_TOKEN = "TEMP_DEV_DEVICE_TOKEN";
export const godlevelusername = "daclen";
export const recruitmenttarget = 3;

export const finalblognumber = 9999
export const productpaginationnumber = 100
export const PROFILE_LOCK_TIMEOUT_IN_MILISECONDS = 6000000
export const SALDO_WITHDRAWAL_MINIMUM = 50000
export const SALDO_ADMIN_FEE = 10000

export const registergetsnaptoken = "api/mobile/auth/member/bayar"
export const productfetchlink = "api/mobile/produk"
export const showproduct = "api/mobile/produk/show"
export const userlogincheck = "api/mobile/auth/cek-login"
export const loginlink = "api/mobile/auth/login"
export const userregister = "api/mobile/auth/register"
export const userchangepassword = "api/mobile/user/update/password"
export const userdelete = "api/mobile/auth/login"
export const userlogout = "api/mobile/auth/logout"
export const userregisterrequestotp = "api/mobile/auth/request-otp"
export const getcurrentuser = "api/mobile/user/current"
export const updateuserdata = "api/mobile/user/update"
export const updateuserphoto = "api/mobile/user/upload-img"
export const updatealamat = "api/mobile/user/update-alamat"
export const deletealamat = "api/mobile/user/delete-alamat"
export const gethpv = "api/mobile/user-root/hpv"
export const showhpv = "api/mobile/user-root/hpv/show"
export const laporanpoinuser = "api/mobile/laporan-poin-user"
export const laporansaldo = "api/mobile/laporan-saldo"
export const riwayatpenarikansaldo = "api/mobile/penarikan/komisi/show"
export const penarikansaldo = "api/mobile/penarikan/komisi/store"
export const getsyaratroot = "api/mobile/user-root/syarat"
export const rajaongkirAPI = "api/mobile/rajaongkir"
export const masterkurirAPI = "api/mobile/masterkurir"
export const getkurirdata = "api/mobile/kurir/biaya"
export const printcheckoutinvoice = "api/mobile/checkout/invoice/"
export const getpengiriman = "api/mobile/pengiriman"
export const statuspengiriman = "api/mobile/pengiriman/status"
export const statusidpengiriman = "api/mobile/pengiriman/status-id"
export const getkeranjang = "api/mobile/keranjang"
export const postkeranjang = "api/mobile/keranjang/post"
export const deletekeranjang = "api/mobile/keranjang/delete"
export const clearkeranjang = "api/mobile/keranjang/clear"
export const getbank = "api/mobile/bank"
export const getcheckout = "api/mobile/checkout"
export const storecheckout = "api/mobile/checkout/store"
export const postpembayaran = "api/mobile/checkout/bayar"
export const confirmcheckout = "api/mobile/checkout/#ID#/confirm"
export const cancelcheckout = "api/mobile/checkout/#ID#/cancel"
export const deletecheckout = "api/mobile/checkout/delete"
export const getblog = "api/mobile/blog"
export const showblog = "api/mobile/blog/show"

export const getotp = "api/mobile/otp"
export const validateotp = "/verifikasi"
export const postauthrequestotp = "api/mobile/auth/request-otp"
export const postauthverifikasiotp = "api/mobile/auth/verifikasi-otp"
export const getauthshowotp = "api/mobile/auth/show-otp"

export const getfaq = "api/mobile/faq"
export const mediakithtml = "api/mobile/media-kit"
export const syaratketentuanhtml = "api/mobile/syarat-ketentuan"
export const dashboardhtml = "api/mobile/dashboard/webview"
export const contentslider = "api/mobile/content/slider"
export const contentbannertiga = "api/mobile/content/tiga-banner"
export const mediakitphoto = "api/mobile/media-kit/foto"
export const mediakitvideo = "api/admin/media-kit/video"
export const mediakitkategori = "api/mobile/media-kit/kategori"
export const tutorialvideo = "api/mobile/video-tutorial"
export const getpdffiles = "api/mobile/file-pdf/index-pdf"
export const mediakitkategorithumbnail = "api/mobile/media-kit/kategori/thumbnail"
export const penjelasanbisnis = "api/mobile/video-penjelasan-bisnis"

export const getpenukaranpoindates = "api/mobile/setting/penukaran-poin"
export const getpenukaranpoinindexproduk = "api/mobile/penukaran-poin/index-produk"
export const getpenukaranpoin = "api/mobile/penukaran-poin"
export const getpenukaranpoinkeranjang = "api/mobile/penukaran-poin/keranjang"
export const postpenukaranpoinkeranjang = "api/mobile/penukaran-poin/keranjang/update"
export const postpenukaranpoinstore = "api/mobile/penukaran-poin/store"

export const personalwebsiteurl = "https://daclen.com/web/"
export const personalwebsiteurlshort = "daclen.com/web/"
export const tokoonlineurl = "https://daclen.com/toko/"
export const tokoonlineurlshort = "daclen.com/toko/"
export const resetpassword = "https://daclen.com/password/reset"
export const websyaratketentuan = "https://daclen.com/home/syarat-ketentuan";
export const webreferral = "https://daclen.com/register/"
export const webreferralshort = "daclen.com/register/"
export const webregister = "https://daclen.com/register"
export const webshop = "https://daclen.com/shop"
export const webcatalog = "https://daclen.com/home/katalog"
export const webdashboard = "https://daclen.com/admin/dashboard"
export const webmediakit = "https://daclen.com/home/media-kit"
export const webfotowatermark = "https://daclen.com/admin/media-kit/flyer-produk"
export const webvideowatermark = "https://daclen.com/admin/media-kit/video-promosi"
export const webcheckout = "https://daclen.com/admin/checkout"
export const websaldo = "https://daclen.com/admin/penarikan/komisi/riwayat-penarikan"
export const weblaporanpoin = "https://daclen.com/admin/laporan/poin-user/pengguna"
export const websyaratbonus = "https://daclen.com/admin/setting/bonus-root/syarat"
export const webpenukaranpoin = "https://daclen.com/admin/penukaran-poin"

//DASHBOARD PDF
export const commissionpointpdf = "https://daclen.com/asset/HADIAH.pdf"
export const dashboardhadiahpdf = "https://daclen.com/asset/HADIAH.pdf"
export const dashboardkodeetikpdf = "https://daclen.com/asset/KE.pdf"
export const dashboardpenjelasanbisnispdf = "https://daclen.com/asset/PB.pdf"

//EXPO UPDATES
export const expoupdateschecking = "Sedang mengecek update terbaru..."
export const expoupdatesinstalling = "Mengunduh update terbaru..."
export const expoupdateserror = "Gagal mengecek update"
export const expoupdatesinstalled = "Update terbaru terpasang"

export const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  export const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  export const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  export const dayNamesShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];