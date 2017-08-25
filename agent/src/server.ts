import config = require('@kubernetes/typescript-node')
import * as client from '@kubernetes/typescript-node/auth-wrapper'
import fs = require('fs')
import request = require('request')
import { Task } from "./models/task"
import { Plan } from "./models/plan"
import { Importer } from "./importer"

for (let key of ["BROKER_URL", "CLUSTER_ID"]) {
    if (!process.env[key]) {
        console.log(key + " env variable is required")
        process.exit(1)
    }
}

const SERVICEACCOUNT_ROOT = '/var/run/secrets/kubernetes.io/serviceaccount'
const SERVICEACCOUNT_CA_PATH = SERVICEACCOUNT_ROOT + '/ca.crt'
const SERVICEACCOUNT_TOKEN_PATH = SERVICEACCOUNT_ROOT + '/token';

const BROKER_URL: string = process.env.BROKER_URL || ""
const CLUSTER_ID: string = process.env.CLUSTER_ID || ""
const CLUSTER_URL: string = process.env.CLUSTER_URL || ""

const INTERVAL_TIME: number = 3000
const EXCLUDED_NAMESPACES: string[] = ["kube-system", "tectonic-system"]

class ClusterState {
    id: String = CLUSTER_ID
    kubeletVersion: String
    nodeCount: Number
    namespaces: config.V1Namespace[] = []
    pods: config.V1Pod[] = []
    services: config.V1Service[] = []
    replicationControllers: config.V1ReplicationController[] = []
    configMaps: config.V1ConfigMap[] = []
    deployments: config.ExtensionsV1beta1Deployment[] = []
    replicaSets: config.V1beta1ReplicaSet[] = []
}

class Server {
    private k8sApi: config.Core_v1Api
    private betaApi: client.Extensions_v1beta1Api
    private clusterState: ClusterState = new ClusterState()
    private importer = new Importer()
    
    constructor() {
        if (CLUSTER_URL) {
            this.k8sApi = new config.Core_v1Api(CLUSTER_URL)
            this.betaApi = new client.Extensions_v1beta1Api(CLUSTER_URL)
        }
        else {
            this.k8sApi = config.Config.defaultClient()
            
            let host = process.env.KUBERNETES_SERVICE_HOST
            let port = process.env.KUBERNETES_SERVICE_PORT

            let caCert = fs.readFileSync(SERVICEACCOUNT_CA_PATH);
            let token = fs.readFileSync(SERVICEACCOUNT_TOKEN_PATH);

            this.betaApi = new client.Extensions_v1beta1Api('https://' + host + ':' + port)
            this.betaApi.setDefaultAuthentication({
                'applyToRequest': (opts) => {
                    opts.ca = caCert;
                    opts.headers['Authorization'] = 'Bearer ' + token;
                }
            })
        }
    }
    
    public run(): void {
        setInterval(() => {
            this.reportState()
            this.getWaitingTasks()
        }, INTERVAL_TIME)
    }

    private async reportState() {
        this.clusterState = new ClusterState()

        await this.k8sApi.listNode().then((res) => {
            let nodes = res.body as config.V1NodeList
            
            this.clusterState.nodeCount = nodes.items.length
            this.clusterState.kubeletVersion = nodes.items[0].status.nodeInfo.kubeletVersion
        })

        this.k8sApi.listNamespace().then((res) => {
            let namespaces = res.body as config.V1NamespaceList

            this.clusterState.namespaces = namespaces.items.filter(n => EXCLUDED_NAMESPACES.indexOf(n.metadata.name) == -1)

            let promises = this.clusterState.namespaces.map(async (ns) => {
                await this.k8sApi.listNamespacedPod(ns.metadata.name.toString()).then((res) => {
                    let pods = res.body as config.V1PodList
                    this.clusterState.pods = this.clusterState.pods.concat(pods.items)
                })

                await this.k8sApi.listNamespacedService(ns.metadata.name.toString()).then((res) => {
                    let svcs = res.body as config.V1ServiceList
                    this.clusterState.services = this.clusterState.services.concat(svcs.items)
                })

                await this.k8sApi.listNamespacedReplicationController(ns.metadata.name.toString()).then((res) => {
                    let rcs = res.body as config.V1ReplicationControllerList
                    this.clusterState.replicationControllers = this.clusterState.replicationControllers.concat(rcs.items)
                })

                await this.k8sApi.listNamespacedConfigMap(ns.metadata.name.toString()).then((res) => {
                    let configMaps = res.body as config.V1ConfigMapList
                    this.clusterState.configMaps = this.clusterState.configMaps.concat(configMaps.items)
                })

                await this.betaApi.listNamespacedDeployment(ns.metadata.name.toString()).then((res) => {
                    let deployments = res.body as config.ExtensionsV1beta1DeploymentList
                    this.clusterState.deployments = this.clusterState.deployments.concat(deployments.items)
                }).catch((err) => {
                    console.log(err)
                })

                await this.betaApi.listNamespacedReplicaSet(ns.metadata.name.toString()).then((res) => {
                    let replicaSets = res.body as config.V1beta1ReplicaSetList
                    this.clusterState.replicaSets = this.clusterState.replicaSets.concat(replicaSets.items)
                })
            })

            Promise.all(promises).then(() => {
                request.post(BROKER_URL + "/clusters", {
                    json: this.clusterState
                }, function (error, response, body) {
                    if (error) {
                        console.log("Failed sending state to broker at " + BROKER_URL)
                    }
                    else {
                        console.log("Sent state to broker at " + BROKER_URL)
                    }
                })
            })
        })
    }

    private getWaitingTasks(): void {
        request.get(BROKER_URL + "/tasks/import?clusterId=" + CLUSTER_ID, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let task = JSON.parse(body).data as Task
                if (task && !this.importer.isBusy()) {
                    console.log("task found, trying to get import plan")

                    request.get(BROKER_URL + "/clusters/" + task.sourceClusterId + "/plan", (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            console.log("import plan found, starting work")

                            request.post(BROKER_URL + "/tasks/" + task.id + "/status", { json: { status: "InProgress" } }, (error, response, body) => { })

                            this.importer.import(JSON.parse(body).data as Plan, this.k8sApi, this.betaApi, (description) => {
                                request.post(BROKER_URL + "/tasks/" + task.id + "/status", { json: { status: "InProgress", log: description } }, (error, response, body) => { })
                            }, () => {
                                request.post(BROKER_URL + "/tasks/" + task.id + "/status", { json: { status: "Finished" } }, (error, response, body) => { })
                            })
                        }
                        else {
                            console.log("failed to get import plan")
                        }
                    })
                }
            }
        })
    }
}

new Server().run()

console.log("Kaptaind Agent is running")