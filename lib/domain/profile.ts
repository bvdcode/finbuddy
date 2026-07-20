export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface ProfileSessionResponse {
  profile: Profile;
}
