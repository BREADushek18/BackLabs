export interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITeacher {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
