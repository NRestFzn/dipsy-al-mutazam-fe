export const ROLE_ID = {
  SISWA: "b991760d-6086-4615-8240-439702b3086b",
  GURU_BK: "b40a9513-a2bc-447a-956c-9c4d1462a1f7",
  WALI_KELAS: "bdf1ffd5-8284-404b-9026-84157d536d5a",
  TU: "c8f5e210-4b3a-49d1-8e62-7a1b3c5d9e0f",
};

export const isTuRole = (role?: { id?: string; name?: string } | null): boolean => {
  if (!role) return false;
  const id = String(role.id || "").toLowerCase();
  const name = String(role.name || "").toLowerCase();
  return (
    id === ROLE_ID.TU.toLowerCase() ||
    id === "tu" ||
    name === "tu" ||
    name === "tatausaha" ||
    name === "tata_usaha" ||
    name === "tata usaha"
  );
};

export const isGuruBkRole = (role?: { id?: string; name?: string } | null): boolean => {
  if (!role) return false;
  const id = String(role.id || "").toLowerCase();
  const name = String(role.name || "").toLowerCase();
  return (
    id === ROLE_ID.GURU_BK.toLowerCase() ||
    name === "gurubk" ||
    name === "guru_bk" ||
    name === "guru bk"
  );
};

export const isWaliKelasRole = (role?: { id?: string; name?: string } | null): boolean => {
  if (!role) return false;
  const id = String(role.id || "").toLowerCase();
  const name = String(role.name || "").toLowerCase();
  return (
    id === ROLE_ID.WALI_KELAS.toLowerCase() ||
    name === "walikelas" ||
    name === "wali_kelas" ||
    name === "wali kelas"
  );
};

export const isSiswaRole = (role?: { id?: string; name?: string } | null): boolean => {
  if (!role) return false;
  const id = String(role.id || "").toLowerCase();
  const name = String(role.name || "").toLowerCase();
  return id === ROLE_ID.SISWA.toLowerCase() || name === "siswa";
};

export const getRoleName = (roleIdOrName: string) => {
  const norm = String(roleIdOrName || "").toLowerCase();
  if (norm === ROLE_ID.SISWA.toLowerCase() || norm === "siswa") {
    return "Siswa";
  }
  if (
    norm === ROLE_ID.GURU_BK.toLowerCase() ||
    norm === "gurubk" ||
    norm === "guru_bk" ||
    norm === "guru bk"
  ) {
    return "Guru BK";
  }
  if (
    norm === ROLE_ID.WALI_KELAS.toLowerCase() ||
    norm === "walikelas" ||
    norm === "wali_kelas" ||
    norm === "wali kelas"
  ) {
    return "Wali Kelas";
  }
  if (
    norm === ROLE_ID.TU.toLowerCase() ||
    norm === "tu" ||
    norm === "tatausaha" ||
    norm === "tata_usaha" ||
    norm === "tata usaha"
  ) {
    return "Tata Usaha";
  }
  return "Unknown Role";
};
