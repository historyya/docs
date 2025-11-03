---
title: Prometheus
description: Prometheus
sidebar:
  order: 101
---

## Prometheus 架构图

## 部署

### k8s 部署

#### 采用 prometheus-operator 部署

```yaml
1. 解压下载的代码包
wget https://github.com/prometheus-operator/kube-prometheus/archive/refs/tags/v0.16.0.tar.gz
tar -zxvf kube-prometheus-0.16.0.tar.gz
rm -f kube-prometheus-0.16.0.tar.gz && cd kube-prometheus-0.16.0

2. 查看当前目录下所有文件中包含镜像image:信息
# find . -type f |xargs grep 'image: [a-z].*/'|sort|uniq|awk -F"image: " '{print $NF}'|sort|uniq

收集如下：
docker.io/cloudnativelabs/kube-router
gcr.io/google_containers/metrics-server-amd64:v0.2.0
ghcr.io/jimmidyson/configmap-reload:v0.15.0
gitpod/workspace-full
grafana/grafana:12.1.0
quay.io/brancz/kube-rbac-proxy:v0.19.1
quay.io/prometheus/alertmanager:v0.28.1
quay.io/prometheus/blackbox-exporter:v0.27.0
quay.io/prometheus/node-exporter:v1.9.1
quay.io/prometheus-operator/prometheus-operator:v0.85.0
quay.io/prometheus/prometheus:v3.5.0
registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.16.0
registry.k8s.io/prometheus-adapter/prometheus-adapter:v0.12.0
quay.io/prometheus-operator/prometheus-config-reloader:v0.85.0  # 注意：这个镜像配置比较特殊，上面命令过滤不出来
quay.io/fabxc/prometheus_demo_service  # 这个需要手动拉上传，github自动化会报错中断

# 由于上面的镜像，国内网络无法正常拉取，所以转存至阿里云镜像仓库，用下面命令批量替换下镜像地址即可

find ./ -type f |xargs  sed -ri 's+gcr.io/.*/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+quay.io/.*/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+docker.io/cloudnativelabs/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+grafana/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+registry.k8s.io/.*/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+gitpod/+registry.cn-beijing.aliyuncs.com/bogeit/+g'
find ./ -type f |xargs  sed -ri 's+ghcr.io/.*/+registry.cn-beijing.aliyuncs.com/bogeit/+g'

3. 开始创建所有服务
kubectl create -f manifests/setup
kubectl create -f manifests/

过一会查看创建结果：
kubectl -n monitoring get all
kubectl -n monitoring get pod -w
                                                                       
                                                                       





```