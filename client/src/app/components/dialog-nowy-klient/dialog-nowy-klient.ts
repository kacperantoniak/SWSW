import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Klient } from '../../models/models';

@Component({
  selector: 'app-dialog-nowy-klient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './dialog-nowy-klient.html',
  styleUrls: ['./dialog-nowy-klient.scss']
})
export class DialogNowyKlientComponent {
  klientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogNowyKlientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.klientForm = this.fb.group({
      imie: ['', [Validators.required, Validators.maxLength(50)]],
      nazwisko: ['', [Validators.required, Validators.maxLength(100)]],
      telefon: ['', [Validators.pattern(/^$|^[\d\s]{9,12}$/)]],
      email: ['', [Validators.email]],
      ulica: [''],
      miasto: [''],
      kodPocztowy: ['', [Validators.pattern(/^\d{2}-\d{3}$/)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.klientForm.invalid) {
      Object.keys(this.klientForm.controls).forEach(key => {
        this.klientForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.klientForm.value;
    const nowyKlient: Partial<Klient> = {
      imie: formValue.imie,
      nazwisko: formValue.nazwisko,
      telefon: formValue.telefon?.trim() || "",
      email: formValue.email?.trim() || "",
      adres: {
        ulica: formValue.ulica,
        miasto: formValue.miasto,
        kodPocztowy: formValue.kodPocztowy
      }
    };

    this.dialogRef.close(nowyKlient);
  }
}