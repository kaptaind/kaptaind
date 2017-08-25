import { Cluster, ClusterInfo } from "./models/cluster"
import { ApiResult } from "./models/apiResult"

export class ClusterOperation {
    constructor(public Success: Boolean = true, public Error: String = "") {}
}

const CLUSTER_INTERVAL_WAIT_TIME = 10000
const CLUSTER_REMOVAL_CHECK_INTERVAL = 5000

export class ClusterManager {
    private static instance: ClusterManager
    private clusters: Array<Cluster> = new Array<Cluster>()

    private constructor() {
        setInterval(this.removeUnresponsiveClusters.bind(this), CLUSTER_REMOVAL_CHECK_INTERVAL)
    }
    
    private removeUnresponsiveClusters(): void {
        let now = new Date().getTime()
        
        this.clusters.forEach(cluster => {
            let lastReportTime = cluster.lastPingTime.getTime()
            
            let diff = (now - lastReportTime)
            if (diff >= CLUSTER_INTERVAL_WAIT_TIME) {
                console.log("Cluster " + cluster.id + " removed due to failing healthcheck")
                this.removeCluster(cluster.id)
            }
        })
    }

    static getInstance(): ClusterManager {
        if (!ClusterManager.instance) {
            ClusterManager.instance = new ClusterManager()
        }

        return this.instance
    }
    
    public getInfo(id: String): ClusterInfo | undefined {
        return this.getClusters().find(c=> c.id == id)
    }

    public get(id: String): Cluster | undefined {
        return this.clusters.find(c => c.id == id)
    }

    public getClusters(): Array<ClusterInfo> {
        return this.clusters.map<ClusterInfo>(c => {
            let clusterInfo = new ClusterInfo()
            clusterInfo.kubeletVersion = c.kubeletVersion
            clusterInfo.configMapsCount = c.configMaps.length
            clusterInfo.depsCount = c.deployments.length
            clusterInfo.id = c.id
            clusterInfo.lastPingTime = c.lastPingTime
            clusterInfo.nodeCount = c.nodeCount
            clusterInfo.podCount = c.pods.length
            clusterInfo.rcCount = c.replicationControllers.length
            clusterInfo.rsCount = c.replicaSets.length
            clusterInfo.svcCount = c.services.length

            return clusterInfo
        })
    }

    public removeCluster(clusterId: String): ClusterOperation {
        let index = this.clusters.findIndex(c => c.id == clusterId)
        if (index == -1) {
            return new ClusterOperation(false, "Cluster with id " + clusterId + " not found")
        }

        this.clusters.splice(index, 1)
        console.log("Cluster " + clusterId + " removed")

        return new ClusterOperation()
    }

    public reportClusterState(cluster: Cluster): ClusterOperation {
        cluster.lastPingTime = new Date()

        let index = this.clusters.findIndex(p => p.id == cluster.id)
        if (index > -1) {
            this.clusters[index] = cluster
        }
        else {
            this.clusters.push(cluster)
        }

        console.log("Cluster " + cluster.id + " reported state")
        return new ClusterOperation()
    }
}