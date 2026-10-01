---
title: EC2 Browser
description: Browse EC2 instances, security group rules, VPCs, subnets and Auto Scaling groups, and start, stop, reboot or terminate instances from a web UI.
---

The EC2 view gives you instances, networking and Auto Scaling in one place, refreshed every few seconds.

A summary row at the top counts instances, how many are running and stopped, and security groups.

## Instances

The instance list shows ID, name, state, type, public IP and launch time, with a filter and sorting. Opening an instance shows:

- **Details**: state, type, AMI, key pair, launch time, and user data decoded from base64.
- **Networking**: VPC, subnet, and public and private IPs.
- **Security**: attached security groups.
- **Tags**, with an editor.
- **Raw** JSON.

From the instance you can **Start** a stopped instance, and **Stop** or **Reboot** a running one. **Terminate** asks for confirmation first.

## Security groups

The security group list shows ID, name, VPC and how many inbound and outbound rules each has. Opening one lists every rule with protocol, port range, IPv4 or IPv6 source or destination, and description.

## VPCs and subnets

Each VPC shows its CIDR block and whether it is the default, with a table of its subnets: ID, CIDR, availability zone and available IPs.

## Auto Scaling groups

Each group shows its desired, minimum and maximum capacity and its instances with lifecycle state, health and availability zone. The details include the ARN, health check grace period, availability zones and load balancers.

## Links and export

- Deep link with `?instance=i-0123456789abcdef0` or `?securityGroup=sg-0123456789abcdef0`.
- Export instances, security groups, VPCs and Auto Scaling groups to JSON or CSV.
