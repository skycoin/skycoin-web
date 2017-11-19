export interface Wallet {
  label: string;
  addresses: Address[];
  seed?: string;
  balance?: number;
  hours?: number;
  hidden?: boolean;
}

export interface Address {
  address: string;
  next_seed?: string;
  secret_key?: string;
  public_key?: string;
  balance?: number;
  hours?: number;
}

export interface Output {
  address: string;
  coins: number;
  hours: number;
}

export interface GetOutputsRequest {
  head_outputs: GetOutputsRequestOutput[];
  outgoing_outputs: any[];
  incoming_outputs: any[];
}

export interface GetOutputsRequestOutput {
  hash: string;
  src_tx: string;
  address: string;
  coins: string;
  hours: number;
}
