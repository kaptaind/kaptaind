export class Cluster {
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