export const presentAddress = (item) => {
    try {
        return `${item?.alamat}${
            item?.provinsi?.name ? `, ${item?.provinsi?.name}` : ""
          }${item?.kota?.name ? `, ${item?.kota?.name}` : ""}${
            item?.kecamatan?.name ? `, ${item?.kecamatan?.name}` : ""
          } ${item?.kode_pos}`;
    } catch (e) {
        console.error(e);
    }
    return "";
}