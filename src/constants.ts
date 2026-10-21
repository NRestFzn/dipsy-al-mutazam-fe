export const ROLE_ID = {
    SISWA: "b991760d-6086-4615-8240-439702b3086b",
    GURU_BK: "b74c04a0-9e0c-4760-8473-56107110b33",
    WALI_KELAS: "bdf1ffd5-8284-404b-9026-84157d536d5a",
}

export const getRoleName = (roleId: string) => {
    switch (roleId) {
        case ROLE_ID.SISWA: return "Siswa";
        case ROLE_ID.GURU_BK: return "Guru BK";
        case ROLE_ID.WALI_KELAS: return "Wali Kelas";
        default: return "Unknown Role";
    }
};
