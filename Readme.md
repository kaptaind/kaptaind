# Kaptaind

[![youtubevid](https://github.com/kaptaind/kaptaind/raw/master/images/videothumbnail.png)](https://www.youtube.com/watch?v=O1IYk8CN-l8)

kaptaind is a resource sync, backup and restore tool for Kubernetes.<br />

kaptaind can sync Kubernetes resources between clusters and across different cloud providers and on-premise installations.
Currently supported resources are: Deployments, Replica Sets, Replication Controllers, Services, Namespaces and Pods.

You can use kaptaind to create snapshots of your clusters and then restore them at any point to any cluster.

Supported Kubernetes platforms include:

1) Azure Container Service
2) Google Container Engine
3) AWS (kubeadm / kops / kargo)
4) Tectonic
5) Openshift Origin
6) Bare metal

The state of this project is alpha and is very much experimental.

## How it works
kaptaind is made out of two components: a Broker and an Agent.

The Broker is responsible for storing cluster state, task management and log management.
It exposes a RESTful API and can be accessed via a Web UI and the kaptaind [CLI].
The broker can be hosted anywhere and must be accessible to any cluster that wants to join.

The agent runs on the Kubernetes clusters and periodically reports the cluster state and gets any waiting import tasks.
Once an import task is found, the agent will intiate a sync job and report to the broker.

All communication between the broker and the agent is made via outgoing Restful API calls from the agent to the broker.

## Getting started
Build the Broker and Agent with docker build, or use a stable image from Docker Hub.

### run the broker with docker
```
docker run -d -p 80:3000 kaptaind/broker
```

To access the kaptaind UI, go to http://{ip-address} in your browser.

### run the broker on Kubernetes
```
kubectl create -f ./templates/broker.yaml
```

Expose the deployment and wait until you get an external IP:

```
kubectl expose deployment broker-deployment --type=LoadBalancer --target-port=3000
```

Once you get the external IP, go to http://{External-IP} to access the kaptaind UI

### run the agent
The kaptaind agent has 3 environment variables:

1) CLUSTER_ID - A name / unique id for the cluster
2) BROKER_URL - The address of the broker
3) CLUSTER_URL (OPTIONAL) - Allows connection to a remote cluster via url.

edit the environment variables in the templates/agent.yaml file with the correct values, and then deploy:

```
kubectl create -f ./templates/agent.yaml
```

In a few seconds the cluster should appear in the kaptaind UI.

## Development
### Broker
```
sudo ./build.sh
node build/server.js
```

### Agent
Make sure you have the correct env variables in place.

```
tsc
node build/server.js
```

[CLI]: https://github.com/kaptaind/cli
