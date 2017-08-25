import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Task, TaskStatus } from '../shared/task';
import { Cluster } from '../shared/cluster';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
  public info: Info = new Info()
  public tasks: Task[] = []
  public clusters: Cluster[] = []
  private interval: any
  
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.getClusters()
      this.getTasks()
    }, 2000)
  }

  ngOnDestroy(): void {
      clearInterval(this.interval)
  }
  
  private getClusters(): void {
    this.http.get("/clusters").subscribe(res => {
      this.clusters = res['data']
      this.info.totalClusters = this.clusters.length
    })
  }
  
  private getTasks(): void {
    this.http.get("/tasks").subscribe(res => {
      let tasks = res['data'] as Task[]
      this.tasks = tasks

      if (tasks.length > 0) {
        this.info.tasksCompleted = tasks.filter(d => d.status == TaskStatus.Finished).length
        this.info.tasksFailed = tasks.filter(d => d.status == TaskStatus.Error).length
        this.info.tasksInProgress = tasks.filter(d => d.status == TaskStatus.InProgress).length
      }
    })
  }

  public openTask(taskId: string): void {
    this.router.navigate(['/task', taskId])
  }
}

class Info {
  constructor(public totalClusters: Number = 0, public tasksInProgress: Number = 0, public tasksFailed: Number = 0, public tasksCompleted: Number = 0) { }
}
