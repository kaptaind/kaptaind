import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskStatus } from '../shared/task';
import { Cluster } from '../shared/cluster';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './newtask.component.html'
})
export class NewTaskComponent implements OnInit {
  public tasks: Task[] = []
  public clusters: Cluster[] = []
  public sourceClusterId: String = "Source Cluster"
  public targetClusterId: String = "Target Cluster"

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getClusters()
  }
  
  public valid() {
     return ((this.sourceClusterId != "Source Cluster" && this.targetClusterId != "Target Cluster") && (this.sourceClusterId != this.targetClusterId))
  }
  
  private getClusters(): void {
    this.http.get("/clusters").subscribe(res => {
      this.clusters = res['data']
    })
  }

  public startExportTask() {
    this.http.post("/tasks", {
      sourceClusterId: this.sourceClusterId,
      targetClusterId: this.targetClusterId
    }).subscribe((res) => {
      this.router.navigate(['/task', res['data']])
    })
  }
}
