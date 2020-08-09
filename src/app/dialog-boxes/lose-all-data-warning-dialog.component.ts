import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lose-all-data-warning-dialog',
  template: `
    <h1 mat-dialog-title>Warning</h1>
    <div mat-dialog-content>
      If you log off you will lose all your data. Please link your anonymous
      account to an account first. This can be done in the side menu.
    </div>
    <div class="buttons" mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        mat-dialog-close
        cdkFocusInitial
      >
        Cancel
      </button>
      <button mat-button (click)="onSignOut()">
        Sign out and lose all data
      </button>
    </div>
  `,
  styles: ['.mat-dialog-actions {flex-direction: row-reverse}'],
})
export class LoseAllDataWarningDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoseAllDataWarningDialogComponent>,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  onSignOut() {
    this.afAuth.signOut().then(() => {
      this.dialogRef.close();
      this.router.navigate(['login']);
    });
  }
}
