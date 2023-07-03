import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '', children: [
      {path:'', component: SupportComponent}
    ]
  }
];

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule
  ]
})
export class SupportModule { }





