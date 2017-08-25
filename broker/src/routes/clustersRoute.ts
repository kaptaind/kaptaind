import { NextFunction, Request, Response, Router } from "express";
import { ClusterManager } from "../clusterManager"
import { ApiResultBase, ApiResult, OperationStatus } from "../models/apiResult"
import { Cluster, ClusterInfo } from "../models/cluster"
import { Planner } from "../importPlanner"
import { Plan } from "../models/plan";

export class ClustersRoute {
    private static clusterManager = ClusterManager.getInstance()
    
    public static create(router: Router) {
        router.get("/clusters", (req: Request, res: Response, next: NextFunction) => {
            let clusters = this.clusterManager.getClusters()
            let result = new ApiResult<Array<ClusterInfo>>(OperationStatus.OK, "", clusters)
            
            res.json(result)
        })
        
        router.get("/clusters/:clusterId", (req: Request, res: Response, next: NextFunction) => {
            let cluster = this.clusterManager.getInfo(req.params.id)
            let result = new ApiResult<ClusterInfo>(OperationStatus.OK, "", cluster)
            
            res.json(result)
        })

        router.get("/clusters/:clusterId/plan", (req: Request, res: Response, next: NextFunction) => {
            let cluster = this.clusterManager.get(req.params.clusterId) as Cluster
            let plan = new Planner().getPlan(cluster)
            let result = new ApiResult<Plan>(OperationStatus.OK, "", plan)
            
            res.json(result)
        })

        router.post("/clusters", (req: Request, res: Response, next: NextFunction) => {
            let updateStateResult = this.clusterManager.reportClusterState(req.body)
            let result = new ApiResultBase(updateStateResult.Success ? OperationStatus.OK : OperationStatus.Error, updateStateResult.Error)

            res.json(result)
        })
        
        router.delete("/clusters/:id", (req: Request, res: Response, next: NextFunction) => {
            let deleteResult = this.clusterManager.removeCluster(req.params.id)
            let result = new ApiResultBase(deleteResult.Success ? OperationStatus.OK : OperationStatus.Error, deleteResult.Error)

            res.json(result)
        })
    }
}