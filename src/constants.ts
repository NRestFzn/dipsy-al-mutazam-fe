export const ROLE_ID = {
  SISWA: "b991760d-6086-4615-8240-439702b3086b",
  GURU_BK: "b40a9513-a2bc-447a-956c-9c4d1462a1f7",
  WALI_KELAS: "bdf1ffd5-8284-404b-9026-84157d536d5a",
};

export const getRoleName = (roleId: string) => {
  switch (roleId) {
    case ROLE_ID.SISWA:
      return "Siswa";
    case ROLE_ID.GURU_BK:
      return "Guru BK";
    case ROLE_ID.WALI_KELAS:
      return "Wali Kelas";
    default:
      return "Unknown Role";
  }
};
