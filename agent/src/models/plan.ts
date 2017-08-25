import config = require('@kubernetes/typescript-node')

export class Plan {
    namespacePlans: NamespacePlan[] = []
}

export class NamespacePlan {
    namespace: config.V1Namespace
    pods: config.V1Pod[] = []
    services: config.V1Service[] = []
    replicationControllers: config.V1ReplicationController[] = []
    configMaps: config.V1ConfigMap[] = []
    deployments: config.ExtensionsV1beta1Deployment[] = []
    replicaSets: config.V1beta1ReplicaSet[] = []
}