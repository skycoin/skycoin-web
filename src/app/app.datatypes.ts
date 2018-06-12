export interface Wallet {
  label: string;
  addresses: Address[];
  seed?: string;
  balance?: number;
  hours?: number;
  hidden?: boolean;
  opened?: boolean;
  hideEmpty?: boolean;
}

export interface Address {
  address: string;
  next_seed?: string;
  secret_key?: string;
  public_key?: string;
  balance?: number;
  hours?: number;
  outputs?: GetOutputsRequestOutput[];
}

export class Transaction {
  balance?: number;
  inputs: any[];
  outputs: any[];
  hoursSent?: number;
  hoursBurned?: number;
}

export class NormalTransaction extends Transaction {
  txid: string;
  addresses: string[];
  timestamp: number;
  block: number;
  confirmed: boolean;
}

export class PreviewTransaction extends Transaction {
  from: string;
  to: string;
  encoded: string;
}

export interface Output {
  address: string;
  coins: number;
  hash: string;
  calculated_hours: number;
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
  calculated_hours: number;
}

export class TransactionInput {
  hash: string;
  secret: string;
  address?: string;
  coins?: number;
  calculated_hours?: number;
}

export class TransactionOutput {
  address: string;
  coins: number;
  hours: number;
}

export interface TotalBalance {
  coins: number;
  hours: number;
}

export interface Balance {
  confirmed: {
    coins: number;
    hours: number;
  };
  predicted: {
    coins: number;
    hours: number;
  };
  addresses: {
    [key: string]: AddressBalance
  };
}

export interface AddressBalance {
  confirmed: {
    coins: number;
    hours: number;
  };
  predicted: {
    coins: number;
    hours: number;
  };
}

export interface ConfirmationData {
  text: string;
  headerText: string;
  displayCheckbox: boolean;
  checkboxText: string;
  confirmButtonText: string;
  cancelButtonText: string;
}
