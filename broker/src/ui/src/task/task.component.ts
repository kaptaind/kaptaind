import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskStatus, TaskLog } from '../shared/task';
import { Cluster } from '../shared/cluster';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import 'moment-duration-format';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import swal from 'sweetalert2'

@Component({
  selector: 'app-home',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit, OnDestroy {
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  private interval: any
  public taskLoaded: boolean = false
  public task: Task = new Task()
  public taskDuration: string = ""

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')

    this.interval = setInterval(() => {
      this.getTaskState(id)
    }, 3000)
  }

  public deleteTask(): void {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(() => {
      this.http.delete("/tasks/" + this.task.id).subscribe(() => {
        this.ngOnDestroy()

        swal(
          'Deleted!',
          'Task has been deleted.',
          'success'
        ).then(() => {
          this.router.navigate(['/home'])
        })
      })
    })
  }
  
  public getLogTime(date: Date) {
    return moment(date).format("DD-MM-YYYY hh:mm:ss")
  }

  private getTaskState(id: string): void {
    this.http.get("/tasks/" + id + "/state").subscribe(res => {
      this.task = res['data'] as Task
      this.taskLoaded = true
      
      if (this.task.status.toString() == "Queued" || this.task.status.toString() == "InProgress") {
        this.taskDuration = moment.duration((Math.abs(moment().diff(moment(this.task.createdAt))))).format("h [hours], m [minutes], s [seconds]")
      }
      else {
        this.taskDuration = ""
      }
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }
}
