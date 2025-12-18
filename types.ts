
export type AppStep = 'landing' | 'initial_check' | 'phone_entry' | 'data_processing' | 'share' | 'verify';

export interface Comment {
  id: number;
  name: string;
  text: string;
  avatar: string;
  time: string;
  likes: number;
}
