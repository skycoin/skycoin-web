export interface Wallet {
  label: string;
  seed: string;
  addresses: Address[];
  balance?: number;
  hours?: number;
  hidden?: boolean;
}

export interface Address {
  next_seed: string;
  secret_key: string;
  public_key: string;
  address: string;
  balance?: number;
  hours?: number;
}
