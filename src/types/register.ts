export interface RegisterBody {
  user: {
    fullName: string;
    email: string;
    password: string;
  };
  company: {
    name: string;
    taxId: string;
  };
}
