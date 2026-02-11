# TunnelSimulator

[![Build](https://github.com/DanielMigchels/TunnelSimulator/actions/workflows/dotnet-build.yml/badge.svg)](https://github.com/DanielMigchels/TunnelSimulator/actions/workflows/dotnet-build.yml) [![Docker Hub](https://img.shields.io/docker/v/danielmigchels/tunnelsimulator?label=docker%20hub&logo=docker)](https://hub.docker.com/r/danielmigchels/tunnelsimulator)

A real-time tunnel traffic simulation application with 3D visualization built with Angular 19, Three.js, and .NET 9, featuring WebSocket-based live updates for dynamic car movement tracking.

<img style="width: 600px;" src="TunnelSimulator.Docs/tunnelsimulator.gif">

## How to Run

Instructions on how to run the application.

### Docker Run
Pulls image from public container registry and runs it on your docker instance.
```bash
docker run -p 8080:8080 -p 8443:8443 danielmigchels/tunnelsimulator:latest
```
App becomes available on port 8080 and should be reachable through HTTP (http://localhost:8080)

### Docker Compose
Compiles source code, builds docker image, and runs it along with its dependencies on your docker instance.
```bash
docker-compose up
```
App becomes available on port 8080 and should be reachable through HTTP. (http://localhost:8080)

### Helm Chart
Installs the app on your Kubernetes cluster.
```bash
helm install tunnelsimulator .\TunnelSimulator.Helm\ --namespace tunnelsimulator --create-namespace
```
App becomes available on port 32400 and should be reachable through HTTP. (http://localhost:32400)