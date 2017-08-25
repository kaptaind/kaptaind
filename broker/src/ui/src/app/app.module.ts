import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from '../home/home.component';
import { NewTaskComponent } from '../newtask/newtask.component';
import { TaskComponent } from '../task/task.component'
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'newtask', component: NewTaskComponent },
  { path: 'task/:id', component: TaskComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewTaskComponent,
    TaskComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
