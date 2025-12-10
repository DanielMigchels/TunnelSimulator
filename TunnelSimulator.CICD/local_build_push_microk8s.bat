cd ..
docker rmi 127.0.0.1:32000/tunnelsimulator:latest
docker build -f TunnelSimulator.Docker/dockerfile -t 127.0.0.1:32000/tunnelsimulator:latest .
docker push 127.0.0.1:32000/tunnelsimulator:latest
kubectl rollout restart deploy tunnelsimulator-deployment --kubeconfig "C:\Users\daniel\.kube\dev-tools" --namespace=tunnelsimulator
pause