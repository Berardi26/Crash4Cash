interface ILanguageItem {
    name: string;
    logo: string;
  }
  
  interface IOptionList {
    name: string;
    icon: string;
  }
  
  interface IInput {
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
  
  interface IChatItem {
    _id: string;
    userId: {
      _id: string;
      username: string;
      avatar: string;
      created_at: Date;
    };
    message: string;
    timestamp: Date;
  }
  
  interface IPlayer {
    _id: string;
    user_id: {
      _id: string;
      username: string;
      avatar: string;
      created_at: Date;
    };
    price: number;
  }
  
  interface IProfileModal {
    _id: string;
    username: string;
    avatar: string;
    created_at: Date;
  }
  
  interface IWaiting {
    _id: string;
    round: number;
    won: number;
    chance: number;
    user_id: {
      _id: string;
      username: string;
      avatar: string;
      created_at: Date;
    };
    create_at: Date;
  }
  
  interface IHistory {
    _id?: string;
    sig: string;
    price: number;
    type: string;
    status: string;
    create_at: Date;
    round: number;
    user_id: any;
  }
  
  interface IUser {
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
  
  interface IWalletItem {
    title: string;
    icon: string;
    subtitle: string;
    content: string;
  }