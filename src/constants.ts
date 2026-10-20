export const ROLE_ID = {
    SISWA: "<UUID_ROLE_SISWA>",
    GURU_BK: "<UUID_ROLE_GURU_BK>",
    WALI_KELAS: "<UUID_ROLE_WALI_KELAS>",
}

export const getRoleName = (roleId: string) => {
    switch (roleId) {
        case ROLE_ID.SISWA: return "Siswa";
        case ROLE_ID.GURU_BK: return "Guru BK";
        case ROLE_ID.WALI_KELAS: return "Wali Kelas";
        default: return "Unknown Role";
    }
};
};