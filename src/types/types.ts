export interface ILanguageItem {
  name: string;
  logo: string;
}

export interface IOptionList {
  name: string;
  icon: string;
}

export interface IInput {
  label: string;
  type?: string;
  edit?: boolean;
  func?: string;
  state?: string;
  placeholder?: string;
  setState?: (val: string) => void;
  disabled?: boolean;
  onSave?: () => void | Promise<void>;
}


export interface BaseUser {
  _id: string;
  username: string;
  avatar: string;
  created_at?: Date;
  status?: string;
}

export interface IChatItem {
  _id: string;
  userId: BaseUser
  message: string;
  timestamp: Date;
}

export interface IPlayer {
  _id: string;
  user_id: BaseUser
  price: number;
}

export interface IProfileModal {
  _id: string;
  username: string;
  avatar: string;
  created_at: Date;
}

export interface IWaiting {
  _id: string;
  round: number;
  won: number;
  chance: number;
  user_id: BaseUser
  create_at: Date;
}

export interface IHistory {
  _id?: string;
  sig: string;
  price: number;
  type: string;
  status: string;
  create_at: Date;
  round: number;
  user_id: any;
}

export interface IUser {
  _id: string;
  username: string;
  address: string;
  avatar: string;
  email: string;
  referral: string;
  invite_link: string;
  deposit_state: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IWalletItem {
  title: string;
  icon: string;
  subtitle: string;
  content: string;
}

// Define the shape of a chat message
export interface ChatMessage {
  _id: string;
  userId: BaseUser;
  message: string;
  createdAt: string;
  type?: string;
  level?: number;
}

export interface Game {
  betAmount: number,
  crashAt: Date,
  createdAt: Date,
  feeRate: number,
  launchAt: Date,
  round: number,
  status: string,
  ticket: number,
  players: [
    {
      status: string,
      user: BaseUser
    }
  ]
}

export interface GameMessage {
  _id: string;
  user: BaseUser | BaseUser[];
  createdAt: string;
  type?: string;
  action: string;
  category?: string; // e.g., "crash"
  launchAt?: number; // For crash game, when the game will launch
  now?: number; // Current time for crash game
  game?: Game
}