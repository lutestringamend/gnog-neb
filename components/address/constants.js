import {
  defaultlatitude,
  defaultlatitudedelta,
  defaultlongitude,
  defaultlongitudedelta,
} from "../../axios/constants";

export const defaultRegion = {
  latitude: defaultlatitude,
  longitude: defaultlongitude,
  latitudeDelta: defaultlatitudedelta,
  longitudeDelta: defaultlongitudedelta,
};

export const selectprovinsi = "Pilih Provinsi";
export const selectkota = "Pilih Kota / Kabupaten";
export const selectkecamatan = "Pilih Kecamatan";
export const mapplacesplaceholder = "Lokasi di Indonesia";

export const locationpermissionnotgranted = "Layanan GPS tidak diizinkan";
export const locationnull = "Lokasi tidak terdeteksi";
export const locationstillfinding = "Mencari lokasi...";
export const locationlocaleundefined = "Layanan GPS aktif";
export const locationundefined = "Layanan GPS tidak aktif";
export const locationunselected = "Belum dipilih";
export const locationgpsheader = "Posisi GPS";

const examplePlacesData = {
  description:
    "Hotel Borobudur Jakarta, Jalan Lapangan Banteng Selatan, Pasar Baru, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia",
  matched_substrings: [{ length: 10, offset: 0 }],
  place_id: "ChIJ2zV-Ccz1aS4RWwlaMym3AnM",
  reference: "ChIJ2zV-Ccz1aS4RWwlaMym3AnM",
  structured_formatting: {
    main_text: "Hotel Borobudur Jakarta",
    main_text_matched_substrings: [[Object]],
    secondary_text:
      "Jalan Lapangan Banteng Selatan, Pasar Baru, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia",
  },
  terms: [
    { offset: 0, value: "Hotel Borobudur Jakarta" },
    { offset: 25, value: "Jalan Lapangan Banteng Selatan" },
    { offset: 57, value: "Pasar Baru" },
    { offset: 69, value: "Kota Jakarta Pusat" },
    { offset: 89, value: "Daerah Khusus Ibukota Jakarta" },
    { offset: 120, value: "Indonesia" },
  ],
  types: ["lodging", "point_of_interest", "establishment"],
};

const placesdatasample2 = {
  description:
    "GreenVille, Jalan Tanjung Duren Barat, RT.2/RW.9, Duri Kepa, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia",
  matched_substrings: [{ length: 10, offset: 0 }],
  place_id: "ChIJv2JVtlb2aS4RK688h8VHHwE",
  reference: "ChIJv2JVtlb2aS4RK688h8VHHwE",
  structured_formatting: {
    main_text: "GreenVille",
    main_text_matched_substrings: [[Object]],
    secondary_text:
      "Jalan Tanjung Duren Barat, RT.2/RW.9, Duri Kepa, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia",
  },
  terms: [
    { offset: 0, value: "GreenVille" },
    { offset: 12, value: "Jalan Tanjung Duren Barat" },
    { offset: 39, value: "RT.2" },
    { offset: 44, value: "RW.9" },
    { offset: 50, value: "Duri Kepa" },
    { offset: 61, value: "Kota Jakarta Barat" },
    { offset: 81, value: "Daerah Khusus Ibukota Jakarta" },
    { offset: 112, value: "Indonesia" },
  ],
  types: ["premise", "geocode"],
};

const placesdetailsample = {
  address_components: [
    { long_name: "GreenVille", short_name: "GreenVille", types: [Array] },
    {
      long_name: "Jalan Tanjung Duren Barat",
      short_name: "Jl. Tj. Duren Barat",
      types: [Array],
    },
    { long_name: "2", short_name: "2", types: [Array] },
    { long_name: "9", short_name: "9", types: [Array] },
    { long_name: "Duri Kepa", short_name: "Duri Kepa", types: [Array] },
    {
      long_name: "Kecamatan Kebon Jeruk",
      short_name: "Kec. Kb. Jeruk",
      types: [Array],
    },
    {
      long_name: "Kota Jakarta Barat",
      short_name: "Kota Jakarta Barat",
      types: [Array],
    },
    {
      long_name: "Daerah Khusus Ibukota Jakarta",
      short_name: "Daerah Khusus Ibukota Jakarta",
      types: [Array],
    },
    { long_name: "Indonesia", short_name: "ID", types: [Array] },
    { long_name: "11510", short_name: "11510", types: [Array] },
  ],
  adr_address:
    '<span class="extended-address">GreenVille</span>, <span class="street-address">Jl. Tj. Duren Barat, RT.2/RW.9</span>, <span class="extended-address">Duri Kepa, Kec. Kb. Jeruk</span>, <span class="locality">Kota Jakarta Barat</span>, <span class="region">Daerah Khusus Ibukota Jakarta</span> <span class="postal-code">11510</span>, <span class="country-name">Indonesia</span>',
  formatted_address:
    "GreenVille, Jl. Tj. Duren Barat, RT.2/RW.9, Duri Kepa, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11510, Indonesia",
  geometry: {
    location: { lat: -6.1732613, lng: 106.7778806 },
    viewport: { northeast: [Object], southwest: [Object] },
  },
  icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
  icon_background_color: "#7B9EB0",
  icon_mask_base_uri:
    "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
  name: "GreenVille",
  photos: [
    {
      height: 2592,
      html_attributions: [Array],
      photo_reference:
        "AUacShg76koy66lfssRka1VnsmQ0jeXw0Ct9pjCpTe6U6SgaVfENOWqjcj_d8BvK54SoJmy1-vOodBuKoeO_oqMXXhWRiezQcwV5sKESDqLMCQ80xdkU0-zz_sSJVc67ie-kA3_gOtyCeaXiTKDotQy2DW_Xhd7UjCh387ZqtAdrotGlsbia",
      width: 1944,
    },
    {
      height: 3145,
      html_attributions: [Array],
      photo_reference:
        "AUacShhqBg1OwxBRJx0YVAiyPt7M8LPLSnxHIyqrRvpBoaIvdO9CliZ38wxjg_RdZwVtEGDNroQzKBl7yAH1Ng-e2D3CYfiSBxtUvmT_QAbPMpw0zJIaGlnDVeZ-zFer5BW3erE3Lwi0h-J_ki5Xp4bXNhnuRh0LiTpVjEBM9bwI8J2Ripjq",
      width: 4193,
    },
    {
      height: 2592,
      html_attributions: [Array],
      photo_reference:
        "AUacShjXhiAYLipQUZHVSQQRNPCGHSXsxUlCsStREZ-lCX9EOGBO0wGYiY7V18m4h_iLiO-Mjk3zyp7Jor0ioX7v-IeQ9tji2nDnxxhB3YmSmdKfUs0b2wvcAd5ciNrrWDSpgskmtX6V947iKD7l-J7y-Rn-arZapCmz8cTzMHpI3IbsOJk2",
      width: 1944,
    },
    {
      height: 3096,
      html_attributions: [Array],
      photo_reference:
        "AUacShiuqTwxK1XQty6nGS97yjaxd0Ad4BZ_6VqSgzd09-snpmSZEzw78W4RaIDPk74DG1OFLoMhXNQ7G2M0D1QlEkq78nbTlFXDEju1TwS8PTSUh1dxOvsKaRTlYgXDzg5ZluRY8aDtaCuSiOgDv4utm6uk9ssD568ATfoxeibbyqPwXES1",
      width: 4128,
    },
    {
      height: 3264,
      html_attributions: [Array],
      photo_reference:
        "AUacShgwfHsENGxdyyvUJiHZ-ZOK068YHarfvQFBk76_eMHI-toUYjDYQz9tBupcGIepWhZHEYgz3n8vD4oqVL_qlqLX9kITo19Amg_XcV2olfI1ijAw0YtGrwZiIPTWcooPpPH6A96XHhXyIaJdUeNvTdR1372A8qaUo-d31wEmOLPWDtbc",
      width: 2448,
    },
    {
      height: 4128,
      html_attributions: [Array],
      photo_reference:
        "AUacShgPOewSO9QxQBWQUzulEhCBJ9srdMjMYwfG2J-kYzmer-CWhvITSINcNUogIaxqtelHqsiVKTnIkEYVS6Jx8zqAXJT_sFwH-16egCwnpW0svBl2CunWL9DWsJwB8WNnYJ4KzuX77YwignVSpJPVdrN-EBfuGS6XRUIy7tyPTzeOPKIH",
      width: 3096,
    },
    {
      height: 3072,
      html_attributions: [Array],
      photo_reference:
        "AUacShh29rwjao5C5QlvgWfuIU1oQoYsZmN2--gvRuyHP1xgiZbxTkckV0wNCei_6TRyLm5G8nHLDtALmqgSihgfK5FtVD5cRI83W5ZsZo8jw6Y_10uSNVoowfFtfR_tzICPKpradnw4eg60xZdBr6S3tEwlr3Qx2c0hogMo8RsrnCPc3v5K",
      width: 1728,
    },
    {
      height: 807,
      html_attributions: [Array],
      photo_reference:
        "AUacShhpinVbd5f3cV6EAC7TpaJL4wHzCEb6vuwGAT0wiqEriyOPT52-ZQUZZlLnObYhKCedx6sR6yJdNvSJw5m7Q2biWVQrs2BM30VnLNJ0gACxGiBaEKmhwqtNUz6iFkEm_mZ3DiNBDuJLkPmJazUAaCC2-Uc_3YbvR_y6vwMcVd1gsIxW",
      width: 1080,
    },
    {
      height: 3264,
      html_attributions: [Array],
      photo_reference:
        "AUacShjHn8ik1zGCYhZb83DVmYfa6SzKGilBQZYaEk1XmnTBAyr0bcbBbxi5HcHQaMAm_3SjC7YukNNxXkYg01LTtjEvhzkkggKmF9pqBsYbpRE93kKrAXQaL3lmx-btBX6USPzXWVXFmxvdZWIv4Wyj446dmtUNHByWbVj-1UmRD8hUE7Yw",
      width: 2448,
    },
    {
      height: 2592,
      html_attributions: [Array],
      photo_reference:
        "AUacShgcAVt4HHLPEE_WHQjz5HeKyC22-gVGmqtyJeRCqkP7s9Yj4ZWSZBbKKituWL4fbXW05fcLKz9oIBM7D6VOzOm4WCupBj45qE_P2ZXR2WMeFXF_THm4DoovTzO1c_kuQx9lbJKP-BQc3tIgAEn3a0M7mA3cwZviu_enanlLWLRpIF4V",
      width: 1944,
    },
  ],
  place_id: "ChIJv2JVtlb2aS4RK688h8VHHwE",
  reference: "ChIJv2JVtlb2aS4RK688h8VHHwE",
  types: ["premise"],
  url: "https://maps.google.com/?q=GreenVille&ftid=0x2e69f656b65562bf:0x11f47c5873caf2b",
  utc_offset: 420,
};

const placesdetailsample2 = {
  address_components: [
    { long_name: "ruko R2", short_name: "ruko R2", types: [Array] },
    { long_name: "no 42", short_name: "no 42", types: [Array] },
    { long_name: "Jalan Pasadena", short_name: "Jl. Pasadena", types: [Array] },
    { long_name: "Kopo", short_name: "Kopo", types: [Array] },
    {
      long_name: "Kecamatan Babakan Ciparay",
      short_name: "Kec. Babakan Ciparay",
      types: [Array],
    },
    { long_name: "Kota Bandung", short_name: "Kota Bandung", types: [Array] },
    { long_name: "Jawa Barat", short_name: "Jawa Barat", types: [Array] },
    { long_name: "Indonesia", short_name: "ID", types: [Array] },
    { long_name: "40223", short_name: "40223", types: [Array] },
  ],
  adr_address:
    'ruko R2, <span class="street-address">Jl. Pasadena No.42</span>, <span class="extended-address">Kopo, Kec. Babakan Ciparay</span>, <span class="locality">Kota Bandung</span>, <span class="region">Jawa Barat</span> <span class="postal-code">40223</span>, <span class="country-name">Indonesia</span>',
  business_status: "OPERATIONAL",
  current_opening_hours: {
    open_now: true,
    periods: [[Object], [Object], [Object], [Object], [Object], [Object]],
    weekday_text: [
      "Senin: 08.00–17.00",
      "Selasa: 08.00–17.00",
      "Rabu: 08.00–17.00",
      "Kamis: 08.00–17.00",
      "Jumat: 08.00–17.00",
      "Sabtu: 08.00–17.00",
      "Minggu: Tutup",
    ],
  },
  formatted_address:
    "ruko R2, Jl. Pasadena No.42, Kopo, Kec. Babakan Ciparay, Kota Bandung, Jawa Barat 40223, Indonesia",
  geometry: {
    location: { lat: -6.9464184, lng: 107.5783344 },
    viewport: { northeast: [Object], southwest: [Object] },
  },
  icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
  icon_background_color: "#7B9EB0",
  icon_mask_base_uri:
    "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
  name: "Daclen",
  opening_hours: {
    open_now: true,
    periods: [[Object], [Object], [Object], [Object], [Object], [Object]],
    weekday_text: [
      "Senin: 08.00–17.00",
      "Selasa: 08.00–17.00",
      "Rabu: 08.00–17.00",
      "Kamis: 08.00–17.00",
      "Jumat: 08.00–17.00",
      "Sabtu: 08.00–17.00",
      "Minggu: Tutup",
    ],
  },
  photos: [
    {
      height: 4219,
      html_attributions: [Array],
      photo_reference:
        "AUacShjKq8UJ5UkGGtNL-ZJg_uweiaRx57j4FXxqEPZX23_g5FueGv4_vIHaq3WR_yXQbGWmgNlRp0g4KWO92WKHw6b2C8GsC7GZ3HK4bIYl6NlvnarVSJTrczG6yn0bmeanB4oAtIdyZhlyawMLsTJFAhFhRHK_AWivBqNl8kq9ocoz5iir",
      width: 3375,
    },
    {
      height: 4219,
      html_attributions: [Array],
      photo_reference:
        "AUacShj46BuqBEiSdPZizN8gUFN4JnAJ_cBXSQ0K_LHwicRXaVk-RQ3HBEcYN9kUL6acib7CeArRTxduNiM7tpKRkSO-3TlYeQqjE2EtbBbu6caA0bloghm6qEwCXXSvN-Xz7_dF7Ozu9xOSHX5tx0dP7BgMsJ8ePEn-8bc8RsaMlHvFGOo2",
      width: 3375,
    },
  ],
  place_id: "ChIJs7TZ7hbpaC4RaH1NMXum6tk",
  plus_code: {
    compound_code:
      "3H3H+C8 Margahayu Utara, Kota Bandung, Jawa Barat, Indonesia",
    global_code: "6P593H3H+C8",
  },
  rating: 5,
  reference: "ChIJs7TZ7hbpaC4RaH1NMXum6tk",
  reviews: [
    {
      author_name: "kinskykharisma putri",
      author_url:
        "https://www.google.com/maps/contrib/114132254989924291549/reviews",
      language: "id",
      original_language: "id",
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/AD_cMMTMry6kTh5a77DTX7TfDVMsxN5Mx_0eDgH-N5DOictVE5Y=s128-c0x00000000-cc-rp-mo",
      rating: 5,
      relative_time_description: "3 bulan lalu",
      text: "Dateng ke kantornya buat ngelamar, Dibawah tempat bikin koper tapi Daclen di lantai atas jadi harus naik tangga dulu. Bersih, enak ada ruang meeting buat interview, karyawannya baik mau kasih arah",
      time: 1683594589,
      translated: false,
    },
    {
      author_name: "ALZI CLIPS",
      author_url:
        "https://www.google.com/maps/contrib/114854320724312687709/reviews",
      language: "id",
      original_language: "id",
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/AD_cMMR_avfP0ba7X41RGA5yoxMksPXv2cU7CJOgIeQORGNELVE=s128-c0x00000000-cc-rp-mo",
      rating: 5,
      relative_time_description: "3 bulan lalu",
      text: "Ruangannya sejuk, waktu masuk ke dalam ruangannya rapih, karyawannya sopan banget, suasana dan desain kantor yang terkesan modern. Good work Daclen",
      time: 1683866425,
      translated: false,
    },
    {
      author_name: "Fitri",
      author_url:
        "https://www.google.com/maps/contrib/110994518465685243773/reviews",
      language: "id",
      original_language: "id",
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/AD_cMMSvbdC3c8cu4EBcVKQjRQhpwN5whj7vC-isru3DjvWsRwr9=s128-c0x00000000-cc-rp-mo-ba2",
      rating: 5,
      relative_time_description: "3 bulan lalu",
      text: "Good job Daclen! Karyawan nya ramah dan sopan. Ruang kerja nya nyaman ya bikin betah diem di kantor Daclen😍",
      time: 1684304870,
      translated: false,
    },
    {
      author_name: "byprojectarsitek Desain",
      author_url:
        "https://www.google.com/maps/contrib/106380731998028540025/reviews",
      language: "id",
      original_language: "id",
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/AAcHTtcS8YxdZ4Tt_5CerbCJ0v9yH5RsFWOn6OzfAQ2Z5_p4=s128-c0x00000000-cc-rp-mo",
      rating: 5,
      relative_time_description: "4 bulan lalu",
      text: "pernah dompet jatuh di jalan, di temui ma karyawan daclen. orangnya jujur2. d jagain gak ada yang hilang sepeserpun. makasih banyak",
      time: 1683169501,
      translated: false,
    },
    {
      author_name: "Cecep Arief Habibudin",
      author_url:
        "https://www.google.com/maps/contrib/113007639626506913172/reviews",
      language: "id",
      original_language: "id",
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/AD_cMMRgrQda9Xp5eNAg1-t9mTUOX74IuuQ0sowCcWw9vuitxzw=s128-c0x00000000-cc-rp-mo",
      rating: 5,
      relative_time_description: "4 bulan lalu",
      text: "Daclen ada di lantai 2, kantornya nyaman, bersih, rapih, karyawannya ramah-ramah, pokoknya keren banget..",
      time: 1683169417,
      translated: false,
    },
  ],
  types: ["point_of_interest", "establishment"],
  url: "https://maps.google.com/?cid=15702546098819005800",
  user_ratings_total: 8,
  utc_offset: 420,
  vicinity: "Jalan Pasadena No.42, Kopo",
  website: "http://daclen.com/",
};
