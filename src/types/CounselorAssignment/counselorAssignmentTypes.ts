export interface CounselorAssignmentGrade {
  id: string;
  name: string;
  level?: string | null;
}

export interface CounselorAssignmentClass {
  id: string;
  name: string;
  GradeId?: string;
  grade?: CounselorAssignmentGrade;
  Grade?: CounselorAssignmentGrade;
}

export interface CounselorAssignmentItem {
  id: string;
  UserId: string;
  ClassId: string;
  academicYear: string;
  createdAt?: string;
  updatedAt?: string;
  class?: CounselorAssignmentClass;
  Class?: CounselorAssignmentClass;
  counselor?: {
    id: string;
    fullname: string;
    email?: string | null;
  };
}

export interface CounselorAssignmentMeGroup {
  academicYear: string;
  ClassIds: string[];
  classes?: CounselorAssignmentClass[];
  assignments?: CounselorAssignmentItem[];
}
