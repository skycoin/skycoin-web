import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';

export class CustomMatDialogService extends MatDialog {
  open<T, D>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>, ignoreAppStyle?: boolean): MatDialogRef<T, any> {
    if (!ignoreAppStyle) {
      if (!config) {
        config = new MatDialogConfig();
      }
      config.panelClass = 'default-dialog-style';
    }

    return super.open(componentOrTemplateRef, config);
  }
}
