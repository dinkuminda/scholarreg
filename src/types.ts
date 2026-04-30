export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  phone: string;
  created_at: string;
}

export type NewStudent = Omit<Student, 'id' | 'created_at'>;
