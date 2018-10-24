import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { BigNumber } from 'bignumber.js';

import { ApiService } from '../api.service';
import { CipherProvider } from '../cipher.provider';
import { Output, TransactionInput, TransactionOutput,
  Wallet, GetOutputsRequestOutput, Transaction, GetOutputsRequest } from '../../app.datatypes';
import { BaseCoin } from '../../coins/basecoin';
import { CoinService } from '../coin.service';
import { WalletService } from './wallet.service';

@Injectable()
export class SpendingService {
  isInjectingTx = false;

  private currentCoin: BaseCoin;

  private readonly allocationRatio = 0.25;
  private readonly unburnedHoursRatio = 0.5;
  private readonly coinsMultiplier = 1000000;

  constructor(
    private apiService: ApiService,
    private cipherProvider: CipherProvider,
    private translate: TranslateService,
    private walletService: WalletService,
    coinService: CoinService,
  ) {
    coinService.currentCoin.subscribe((coin) => this.currentCoin = coin);
  }

  createTransaction(wallet: Wallet, address: string, amount: BigNumber): Observable<Transaction> {
    const addresses = wallet.addresses.map(a => a.address).join(',');

    return this.getOutputs(addresses)
      .flatMap((outputs: Output[]) => {
        const minRequiredOutputs =  this.getMinRequiredOutputs(amount, outputs);
        let totalCoins = new BigNumber('0');
        minRequiredOutputs.map(output => totalCoins = totalCoins.plus(output.coins));

        if (totalCoins.isLessThan(amount)) {
          throw new Error(
            `${this.translate.instant('service.wallet.not-enough-hours1')} ${ this.currentCoin.hoursName } ${ this.translate.instant('service.wallet.not-enough-hours2') }`
          );
        }

        let totalHours = new BigNumber('0');
        minRequiredOutputs.map(output => totalHours = totalHours.plus(output.calculated_hours));
        let hoursToSend = totalHours.multipliedBy(this.allocationRatio).decimalPlaces(0, BigNumber.ROUND_FLOOR);

        const txOutputs: TransactionOutput[] = [];
        const txInputs: TransactionInput[] = [];
        const calculatedHours = totalHours.multipliedBy(this.unburnedHoursRatio).decimalPlaces(0, BigNumber.ROUND_FLOOR);

        const changeCoins = totalCoins.minus(amount).decimalPlaces(6);

        if (changeCoins.isGreaterThan(0)) {
          txOutputs.push({
            address: wallet.addresses[0].address,
            coins: changeCoins.toNumber(),
            hours: calculatedHours.minus(hoursToSend).toNumber()
          });
        } else {
          hoursToSend = calculatedHours;
        }

        txOutputs.push({ address: address, coins: amount.toNumber(), hours: hoursToSend.toNumber() });

        minRequiredOutputs.forEach(input => {
          txInputs.push({
            hash: input.hash,
            secret: wallet.addresses.find(a => a.address === input.address).secret_key,
            address: input.address,
            calculated_hours: input.calculated_hours.toNumber(),
            coins: input.coins.toNumber()
          });
        });

        return this.generateRawTransaction(txInputs, txOutputs)
          .flatMap((rawTransaction: string) => {
            return Observable.of({
              inputs: txInputs,
              outputs: txOutputs,
              hoursSent: hoursToSend,
              hoursBurned: totalHours.minus(calculatedHours),
              encoded: rawTransaction
            });
          });
      });
  }

  injectTransaction(encodedTransaction: string): Observable<string> {
    this.isInjectingTx = true;
    return this.postTransaction(encodedTransaction)
      .map(response => {
        this.isInjectingTx = false;
        return response;
      }).catch(err => {
        this.isInjectingTx = false;
        return Observable.throw(err);
      });
  }

  outputsWithWallets(): Observable<Wallet[]> {
    return Observable.forkJoin(
      this.walletService.currentWallets.first(),
      this.getAddressesAsString().flatMap(addresses => addresses ? this.getRequestOutputs(addresses) : Observable.of([])).first(),
      (wallets: Wallet[], outputs: GetOutputsRequestOutput[]) => {
        return wallets.map(wallet => {
          wallet.addresses = wallet.addresses.map(address => {
            address.outputs = outputs.filter(output => output.address === address.address);

            return address;
          });
          return wallet;
        });
      });
  }

  private getAddressesAsString(): Observable<string> {
    return this.walletService.currentWallets.map(wallets => wallets.map(wallet => {
      return wallet.addresses.map(address => address.address).join(',');
    }).join(','));
  }

  private getOutputs(addresses): Observable<Output[]> {
    return addresses ? this.apiService.get('outputs', { addrs: addresses }).map((response: GetOutputsRequest) => {
      const outputs: Output[] = [];
      response.head_outputs.forEach(output => outputs.push({
        address: output.address,
        coins: new BigNumber(output.coins),
        hash: output.hash,
        calculated_hours: new BigNumber(output.calculated_hours)
      }));
      return outputs;
    }) : Observable.of([]);
  }

  private getRequestOutputs(addresses): Observable<GetOutputsRequestOutput[]> {
    return addresses
      ? this.apiService.get('outputs', { addrs: addresses }).map(response => response.head_outputs)
      : Observable.of([]);
  }

  private postTransaction(rawTransaction: string): Observable<string> {
    return this.apiService.post('injectTransaction', { rawtx: rawTransaction });
  }

  private generateRawTransaction(txInputs: TransactionInput[], txOutputs: TransactionOutput[]): Observable<string> {
    const convertedOutputs: TransactionOutput[] = txOutputs.map(output => {
      return {
        ...output,
        coins: parseInt((output.coins * this.coinsMultiplier) + '', 10)
      };
    });

    return this.cipherProvider.prepareTransaction(txInputs, convertedOutputs);
  }

  private getMinRequiredOutputs(transactionAmount: BigNumber, outputs: Output[]): Output[] {
    outputs.sort( function(a, b) {
      return b.coins.minus(a.coins).toNumber();
    });

    const minRequiredOutputs: Output[] = [];
    let sumCoins: BigNumber = new BigNumber('0');

    outputs.forEach(output => {
      if (sumCoins.isLessThan(transactionAmount) && output.calculated_hours.isGreaterThan(0)) {
        minRequiredOutputs.push(output);
        sumCoins = sumCoins.plus(output.coins);
      }
    });

    return minRequiredOutputs;
  }
}
