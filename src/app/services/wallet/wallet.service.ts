import { Injectable, EventEmitter, Injector } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { CipherProvider } from '../cipher.provider';
import { Address, Wallet } from '../../app.datatypes';
import { convertAsciiToHexa } from '../../utils/converters';
import { defaultCoinId } from '../../constants/coins-id.const';
import { BaseCoin } from '../../coins/basecoin';
import { CoinService } from '../coin.service';

@Injectable()
export class WalletService {
  wallets: BehaviorSubject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);

  private currentCoin: BaseCoin;

  constructor(
    private cipherProvider: CipherProvider,
    private translate: TranslateService,
    private coinService: CoinService,
  ) {
    this.loadWallets();
    this.coinService.currentCoin.subscribe((coin) => this.currentCoin = coin);
  }

  get haveWallets(): Observable<boolean> {
    return this.wallets.map(wallets => wallets ? wallets.length > 0 : false);
  }

  get currentWallets(): Observable<Wallet[]> {
    return this.wallets
      .flatMap(wallets => this.coinService.currentCoin
        .map((coin: BaseCoin) => wallets.filter(wallet => wallet.coinId === coin.id))
      ).map(wallets => wallets ? wallets : []);
  }

  get addresses(): Observable<Address[]> {
    return this.currentWallets.map(wallets => wallets.reduce((array, wallet) => array.concat(wallet.addresses), []));
  }

  addAddress(wallet: Wallet): Observable<void> {
    if (!wallet.seed || !wallet.addresses[wallet.addresses.length - 1].next_seed) {
      throw new Error(this.translate.instant('service.wallet.address-without-seed'));
    }

    const lastSeed = wallet.addresses[wallet.addresses.length - 1].next_seed;

    return this.cipherProvider.generateAddress(lastSeed)
      .map((addr: Address) => {
        wallet.addresses.push(addr);
        this.saveWallets();
      });
  }

  create(label: string, seed: string, coinId: number): Observable<void> {
    seed = this.getCleanSeed(seed);

    return this.cipherProvider.generateAddress(convertAsciiToHexa(seed))
      .map((fullAddress: Address) => {
        const wallet = {
          label: label,
          seed: seed,
          balance: 0,
          hours: 0,
          addresses: [fullAddress],
          coinId: coinId
        };

        if (this.wallets.value.some((wlt: Wallet) =>
            wlt.addresses[0].address === wallet.addresses[0].address &&
            wlt.coinId === wallet.coinId)) {
          throw new Error(this.translate.instant('service.wallet.wallet-exists'));
        }

        this.wallets.value.push(wallet);
        this.saveWallets();
      });
  }

  delete(wallet: Wallet) {
    const index = this.wallets.value.indexOf(wallet);
    if (index !== -1) {
      this.wallets.value.splice(index, 1);

      this.saveWallets();
    }
  }

  unlockWallet(wallet: Wallet, seed: string, onProgressChanged: EventEmitter<number>): Observable<void> {
    seed = this.getCleanSeed(seed);
    const currentSeed = convertAsciiToHexa(seed);

    return this.unlockWalletAddresses(currentSeed, wallet, 0, onProgressChanged)
      .map((res: boolean) => {
        if (!res) {
          throw new Error(this.translate.instant('service.wallet.wrong-seed'));
        }

        wallet.seed = seed;
      });
  }

  saveWallets() {
    const strippedWallets: Wallet[] = [];
    this.wallets.value.forEach(wallet => {
      const strippedAddresses: Address[] = [];
      wallet.addresses.forEach(address => strippedAddresses.push({ address: address.address }));
      strippedWallets.push({ coinId: wallet.coinId, label: wallet.label, addresses: strippedAddresses });
    });
    localStorage.setItem('wallets', JSON.stringify(strippedWallets));
    this.wallets.next(this.wallets.value);
  }

  private loadWallets() {
    const storedWallets: string = localStorage.getItem('wallets');
    if (storedWallets) {
      const wallets: Wallet[] = JSON.parse(storedWallets);

      wallets.filter(wallet => !wallet.coinId).forEach((wallet) => {
        wallet.coinId = defaultCoinId;
      });

      this.wallets.next(wallets);
    }
  }

  private getCleanSeed(seed: string): string {
    return seed.replace(/(\n|\r\n)$/, '');
  }

  private unlockWalletAddresses(currentSeed: string, wallet: Wallet, index: number, onProgressChanged: EventEmitter<number>): Observable<boolean> {
    return this.cipherProvider.generateAddress(currentSeed)
      .flatMap((fullAddress: Address) => {
        if (fullAddress.address !== wallet.addresses[index].address) {
          onProgressChanged.emit(0);
          return Observable.of(false);
        }

        onProgressChanged.emit((index + 1) / wallet.addresses.length * 100);
        wallet.addresses[index].next_seed = fullAddress.next_seed;
        wallet.addresses[index].public_key = fullAddress.public_key;
        wallet.addresses[index].secret_key = fullAddress.secret_key;
        index++;

        if (index === wallet.addresses.length) {
          return Observable.of(true);
        }

        return this.unlockWalletAddresses(fullAddress.next_seed, wallet, index, onProgressChanged);
      });
  }
}
