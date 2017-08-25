import config = require('@kubernetes/typescript-node')
import { Plan, NamespacePlan } from "./models/plan"

export class Importer {
    private busy: Boolean = false

    public isBusy(): Boolean {
        return this.busy
    }

    public async import(plan: Plan, coreClient: config.Core_v1Api, betaApi: config.Extensions_v1beta1Api, onStatus, onDone) {
        if (!plan) {
            return
        }

        if (!this.isBusy()) {
            console.log("starting import")
            this.busy = true

            let promises = plan.namespacePlans.map(async (nsPlan) => {
                await coreClient.createNamespace(nsPlan.namespace).then((res) => {
                    let msg = "namespace " + nsPlan.namespace.metadata.name + " synced"
                    console.log(msg)
                    onStatus(msg)
                }).catch((err) => {
                    let msg = "namespace " + nsPlan.namespace.metadata.name + " already exists"
                    console.log(msg)
                    onStatus(msg)
                })
            })

            await Promise.all(promises).then(async () => {
                let nsPromises = plan.namespacePlans.map(async (nsPlan) => {
                    let namespace = nsPlan.namespace.metadata.name
                    let innerPromises: Promise<void>[] = []

                    if (nsPlan.deployments) {
                        innerPromises = innerPromises.concat(nsPlan.deployments.map(async (dep) => {
                            await betaApi.createNamespacedDeployment(namespace, dep).then((res) => {
                                let msg = "deployment " + dep.metadata.name + " synced"
                                console.log(msg)
                                onStatus(msg)
                            }).catch((err) => {
                                let msg = "deployment " + dep.metadata.name + " for namespace " + namespace + " already exists"
                                console.log(msg)
                                onStatus(msg)
                            })
                        }))
                    }

                    if (nsPlan.configMaps) {
                        innerPromises = innerPromises.concat(nsPlan.configMaps.map(async (map) => {
                            await coreClient.createNamespacedConfigMap(namespace, map).then((res) => {
                                let msg = "configmap " + map.metadata.name + " synced"
                                console.log(msg)
                                onStatus(msg)
                            }).catch((err) => {
                                let msg = "configmap " + map.metadata.name + " for namespace " + namespace + " already exists"
                                console.log(msg)
                                onStatus(msg)
                            })
                        }))
                    }

                    if (nsPlan.services) {
                        innerPromises = innerPromises.concat(nsPlan.services.map(async (svc) => {
                            await coreClient.createNamespacedService(namespace, svc).then((res) => {
                                let msg = "service " + svc.metadata.name + " synced"
                                console.log(msg)
                                onStatus(msg)
                            }).catch((err) => {
                                let msg = "service " + svc.metadata.name + " for namespace " + namespace + " already exists"
                                console.log(msg)
                                onStatus(msg)
                            })
                        }))
                    }

                    if (nsPlan.replicationControllers) {
                        innerPromises = innerPromises.concat(nsPlan.replicationControllers.map(async (rc) => {
                            await coreClient.createNamespacedReplicationController(namespace, rc).then((res) => {
                                let msg = "replication controller " + rc.metadata.name + " synced"
                                console.log(msg)
                                onStatus(msg)
                            }).catch((err) => {
                                let msg = "replication controller " + rc.metadata.name + " for namespace " + namespace + " already exists"
                                console.log(msg)
                                onStatus(msg)
                            })
                        }))
                    }

                    await Promise.all(innerPromises)
                })

                await Promise.all(nsPromises).then(() => {
                    this.done(onDone)
                }).catch(err => {
                    this.doneWithErrors(err, onStatus, onDone)
                })
            })
        }
    }

    private done(onDone): void {
        this.busy = false
        console.log("task done")
        onDone()
    }

    private doneWithErrors(error, onStatus, onDone): void {
        this.busy = false
        console.log(error)
        onStatus("Task failed")
        onDone()
    }
}