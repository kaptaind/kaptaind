import config = require('@kubernetes/typescript-node')

export class ClusterInfo {
    id: String
    kubeletVersion: String
    nodeCount: Number
    podCount: Number
    rcCount: Number
    svcCount: Number
    depsCount: Number
    rsCount: Number
    configMapsCount: Number
    lastPingTime: Date
}

export class Cluster {
    id: String
    kubeletVersion: String
    namespaces: config.V1Namespace[]
    nodeCount: Number
    pods: config.V1Pod[]
    services: config.V1Service[]
    replicationControllers: config.V1ReplicationController[]
    configMaps: config.V1ConfigMap[]
    deployments: config.ExtensionsV1beta1Deployment[]
    replicaSets: config.V1beta1ReplicaSet[]
    lastPingTime: Date
}