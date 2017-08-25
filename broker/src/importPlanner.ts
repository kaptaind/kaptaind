import { Cluster } from "./models/cluster"
import { Plan, NamespacePlan } from "./models/plan"
import config = require('@kubernetes/typescript-node')

export class Planner {
    public getPlan(cluster: Cluster): Plan | undefined {
        if (!cluster) {
            return
        }
        
        cluster = this.cleanClusterResources(cluster)
        let plan = new Plan()

        for (let ns of cluster.namespaces) {
            let nsPlan = this.getNamespacePlan(ns, cluster)
            plan.namespacePlans.push(nsPlan)
        }

        return plan
    }

    private getNamespacePlan(namespace: config.V1Namespace, cluster: Cluster): NamespacePlan {
        let nsPlan = new NamespacePlan()
        nsPlan.namespace = namespace
        nsPlan.deployments = cluster.deployments.filter(d => d.metadata.namespace == namespace.metadata.name)

        return nsPlan
    }

    private cleanClusterResources(cluster: Cluster): Cluster {
        cluster.pods.forEach((pod, index) => {
            delete cluster.pods[index].status
            delete cluster.pods[index].metadata.uid
            delete cluster.pods[index].metadata.selfLink
            delete cluster.pods[index].metadata.resourceVersion
            delete cluster.pods[index].metadata.creationTimestamp
            delete cluster.pods[index].metadata.generation
        })

        cluster.namespaces.forEach((ns, index) => {
            delete cluster.namespaces[index].status
            delete cluster.namespaces[index].metadata.uid
            delete cluster.namespaces[index].metadata.selfLink
            delete cluster.namespaces[index].metadata.resourceVersion
            delete cluster.namespaces[index].metadata.creationTimestamp
            delete cluster.namespaces[index].metadata.generation
        })

        cluster.deployments.forEach((dep, index) => {
            delete cluster.deployments[index].status
            delete cluster.deployments[index].metadata.uid
            delete cluster.deployments[index].metadata.selfLink
            delete cluster.deployments[index].metadata.resourceVersion
            delete cluster.deployments[index].metadata.creationTimestamp
            delete cluster.deployments[index].metadata.generation
            delete cluster.deployments[index].spec.template.spec.securityContext
            delete cluster.deployments[index].spec.template.spec.dnsPolicy
            delete cluster.deployments[index].spec.template.spec.terminationGracePeriodSeconds
            delete cluster.deployments[index].spec.template.spec.restartPolicy
        })

        cluster.replicaSets.forEach((rs, index) => {
            delete cluster.replicaSets[index].status
            delete cluster.replicaSets[index].metadata.uid
            delete cluster.replicaSets[index].metadata.selfLink
            delete cluster.replicaSets[index].metadata.resourceVersion
            delete cluster.replicaSets[index].metadata.creationTimestamp
            delete cluster.replicaSets[index].metadata.generation
            delete cluster.replicaSets[index].spec.template.spec.securityContext
            delete cluster.replicaSets[index].spec.template.spec.dnsPolicy
            delete cluster.replicaSets[index].spec.template.spec.terminationGracePeriodSeconds
            delete cluster.replicaSets[index].spec.template.spec.restartPolicy
        })

        cluster.replicationControllers.forEach((rc, index) => {
            delete cluster.replicationControllers[index].status
            delete cluster.replicationControllers[index].metadata.uid
            delete cluster.replicationControllers[index].metadata.selfLink
            delete cluster.replicationControllers[index].metadata.resourceVersion
            delete cluster.replicationControllers[index].metadata.creationTimestamp
            delete cluster.replicationControllers[index].metadata.generation
            delete cluster.replicationControllers[index].spec.template.spec.securityContext
            delete cluster.replicationControllers[index].spec.template.spec.dnsPolicy
            delete cluster.replicationControllers[index].spec.template.spec.terminationGracePeriodSeconds
            delete cluster.replicationControllers[index].spec.template.spec.restartPolicy
        })

        cluster.configMaps.forEach((cm, index) => {
            delete cluster.configMaps[index].metadata.uid
            delete cluster.configMaps[index].metadata.selfLink
            delete cluster.configMaps[index].metadata.resourceVersion
            delete cluster.configMaps[index].metadata.creationTimestamp
            delete cluster.configMaps[index].metadata.generation
        })

        cluster.services.forEach((svc, index) => {
            delete cluster.services[index].status
            delete cluster.services[index].metadata.uid
            delete cluster.services[index].metadata.selfLink
            delete cluster.services[index].metadata.resourceVersion
            delete cluster.services[index].metadata.creationTimestamp
            delete cluster.services[index].metadata.generation
        })

        return cluster
    }
}

