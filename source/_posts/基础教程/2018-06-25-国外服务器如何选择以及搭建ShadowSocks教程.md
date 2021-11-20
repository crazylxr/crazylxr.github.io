---
layout: post
cid: 99
title: 国外服务器如何选择以及搭建ShadowSocks教程
slug: 99
date: 2018/06/25 21:41:00
updated: 2019/11/08 08:31:07
status: hidden
author: 桃翁
categories: 
  - 基础教程
tags: 
  - VPS
---


## 背景

就在前几天，阿里云给我发了短信，还给我打了电话，告诉我我的学生认证已经过期，请尽快续费，要是停了意味着我的博客就不能用了，运营了这么久的博客还是舍不得丢。我是用的阿里云的学生机，1 核 2G的内存 40 个 G 的 SSD，去续费的时候发现一个月 120 多，对于我来说还是太贵了，所以准备买个便宜的国外的服务器，国内的相对比较贵，而且国外的还可以用来搭 SS。

下面就记录我选择服务器商家，以及怎么使用 vultr，然后再服务器上搭建基础服务和 搭建 SS 的过程。


## VPS 商家如何选择
在国内比较畅销的海外 VPS 就是搬瓦工和 Vultr了，基本占据中低端VPS的半壁江山了。

但是对于新手不知道该如何选择，今天在这里给大家做个介绍和推荐

### 搬瓦工
  **搬瓦工**，因其官网网站标识是 BandwagonHost，有点类似 BanWaGong 的拼写，所以我们国内的站长喜欢称作为搬瓦工 VPS。搬瓦工 VPS 是一款性价比较高（据我所知是最高的）的便宜 VPS 主机，且适合入门级网友学习Linux和建站用途。

下面是一些搬瓦工的选择方案。

![](https://upload-images.jianshu.io/upload_images/2974893-c5d9df695a04567b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/2974893-075c1c3042b972d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/2974893-281d3cc5c03f9898.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/2974893-54a7bcda4cad9c0a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到搬瓦工的 VPS 是相当高的，最低的年付 ￥19.99，一年差不多才 130 多点，一个月十块多，如果是用来科学上网，或者用来学习 linux 操作，那是相当划算的。

### Vultr
Vultr 是美国知名云服务提供商 Choopa.com 旗下的 VPS 服务，Vultr 母公司 Choopa 一直在为游戏公司提供全球支撑服务，因此该公司在全球 14 个国家及地区部署数据中心，包括日本东京、新加坡、美国洛杉矶、西雅图、英国伦敦、德国等地。可谓公司资金雄厚，体验和服务一流，最重要的是价格亲民。当前最低仅需 $2.5/月，在这个价位的 VPS，单论性价比来说，基本没有对手。唯一能抗衡的也就只有[搬瓦工](https://banwagong.haokoucai.top/?f=vultr)了。

***配置价格表**

![pei](https://upload-images.jianshu.io/upload_images/2974893-4193f7257ac6d7e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 对比结论
根据自己的理解做出的简单结论
#### 1. 价格对比
[搬瓦工](http://buy.haokoucai.top/bwg/buy.html?f=vultr&k=sec)以年为付费单位，**最低 19.99 美元/年**(目前有新货)，**常以 29.99/年美元为主**。

**[Vultr](http://buy.haokoucai.top/vultr/?k=sec)以小时计费**，最低 2.5 美元每月(该方案已经长期缺货，**可以理解没有**)，通常是** 5 美元/月**，一年就 60 美元。

**价格结论搬瓦工比Vultr便宜一半的价格，并且国内连接速度比Vultr快。**

#### 2. 简单的使用 VPS
简单的使用指什么呢？就是不常在 VPS 上操作或者对 VPS 性能要求不是很高，比如用来科学上网（用来逛 youtube、fb、google 等）；在 linux 上学习基本操作。

如果使用场景是这样的话，就可以选择搬瓦工，因为搬瓦工最低的便宜，年付 ￥19.99，而且有 CN2线路（CN2线路为电信海外精品网络线路，ping下来在160ms~180ms左右，速度相对稳定）。Vultr 虽然有月付 $2.5 的，但是基本抢不到。

#### 3. 建站
面向中国用户的网站选择搬瓦工或 Vultr；面向海外用户的网站必选 Vultr。

搬瓦工在网络连接速度上有较大优势，中国用户访问速度较快且稳定，但 VPS 功能较弱，可以称之为 VPS 提供商。而 Vultr 是一个十足的云厂商，并且在海外用户上优势十分明显，在全球拥有 14 个机房，支持打快照镜像、防火墙策略、私有网络、多IP和IPV6、自定义镜像等诸多功能。

#### 4. 高性能计算(大数据、机器学习)
这方面毫无疑问，直接 Vultr。

#### 一句话总结
想国内访问速度快选[搬瓦工 CN2 服务器](http://buy.haokoucai.top/bwg/buy.html?f=vultr&k=sec)，想要 VPS 高品质服务就选 [Vultr](http://buy.haokoucai.top/vultr/?k=sec)！

## 如何使用 Vultr
我的需求是搭建博客，同时科学上网，说不定以后会部署其他服务，所以选择了 Vultr 的月付 $5 的方案。

### 优惠活动
目前新用户注册是有优惠的，充 10 美元送 25 美元，如果抢到了 $2.5 / 月的，可以用一年呢，如果你换算成人民币来算这笔账，发现送得挺多的。

> 注意：本次活动仅支持 Paypal 和信用卡付款，不支持支付宝付款！如果不享受这个活动是支付支付宝付款的。没有 Paypal 账户的去注册一个然后绑定下银行卡就行，10 分钟之内就能搞定。

### 具体使用方法
1. 进入这个网址：https://www.vultr.com/promo25b/?service=promo25b 注册用户。
![注册页面](https://upload-images.jianshu.io/upload_images/2974893-5f9b679a24a6e9e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 必须充值10刀，用于激活账户(如果没有右侧信息，则代表活动已经结束)
![image.png](https://upload-images.jianshu.io/upload_images/2974893-c5bdc2c2bd692123.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. 右上角加号创建VPS，14个地区可以选择，优先选择北美和日本地区。 Los Angeles/Seattle/Silicon Valley/ Tokyo。我选的是洛杉矶的，据说相对较好。
![](https://upload-images.jianshu.io/upload_images/2974893-b2ae58d942e55b03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Tips
1. 选选择服务器系统的时候尽量选择 linux
2. Vultr 计算费用的方式是按小时计费的，可以看到我产生的费用还有零点零几刀，所以你其实可以同时购买多台 VPS，只是费用会相应增加倍数。如果你选择错了地区也可以销毁了重新新建一个。我觉得这种方式比一次把费用全部扣完好多了，因为如果你一段时间不想用服务器了，你可以随时停掉，然后费用不会扣。
![](https://upload-images.jianshu.io/upload_images/2974893-04c3e53e93c9c68a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 快速安装宝塔面板
#### 1. 通过 SSH 登录链接到 VPS
#### 2. 执行命令安装宝塔面板
- CentOS安装命令：
```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install.sh && sh install.sh
```
- Ubuntu/Deepin安装命令：
```
wget -O install.sh http://download.bt.cn/install/install-ubuntu.sh && sudo bash install.sh
```
- Debian安装命令：
```
wget -O install.sh http://download.bt.cn/install/install-ubuntu.sh && bash install.sh
```
- Fedora安装命令:
```
wget -O install.sh http://download.bt.cn/install/install.sh && bash install.sh
```
根据提示输入 “y” 或者自定义目录，新手不了解的情况下最好不要动。

等待完成安装过程，出现“安装成功”字样则说明成功安装。

![](https://upload-images.jianshu.io/upload_images/2974893-24fed73bccb5f2fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 3. 登录面板后台

根据安装成功的提示信息，使用对应的用户名和密码访问面板后台。通常是 http://IP:8888/ ，成功登录后可以将用户名和密码进行修改，避免黑客进行攻击。

#### 4. 安装Web运行环境

这里我们以当前最为流程的Web架构进行演示，即LNMP(Linux + Nginx + MySQL + PHP)或LAMP(Linux + Apache + MySQL + PHP)，这里我们推荐使用LNMP，目前从各方面来看均优于Apache。稍等几分钟即可完成全部安装，建议使用极速安装，速度快，新手友好。

### 科学上网，搭建 Shadowsocks 服务
#### 安装组件
```
$ yum install m2crypto python-setuptools
$ easy_install pip
$ pip install shadowsocks
```
#### 安装完成后配置服务器参数
```
$ vi  /etc/shadowsocks.json
```
写入如下配置:
```shell
{
    "server":"0.0.0.0",
    "server_port":443,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"123456",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```
多端口配置
```
{
    "server":"0.0.0.0",
    "local_address": "127.0.0.1",
    "local_port":1080,
    "port_password": {
         "443": "443",
         "8888": "8888"
     },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```
其中server字段与local_address填写之前的IP Address。password是自己用于连接这个shadow socks的密码，自定义就好。
#### 配置防火墙
```
# 安装防火墙
$ yum install firewalld
# 启动防火墙
$ systemctl start firewalld
```
#### 开启防火墙相应的端口
```
# 开启端口号 443
$ firewall-cmd --permanent --zone=public --add-port=443/tcp
$ firewall-cmd --reload
```

#### 启动 Shadowsocks 服务
```
$ ssserver -c /etc/shadowsocks.json
```
后台运行应用
```
$ nohup ssserver -c /etc/shadowsocks.json &
```
完成服务端的搭建之后，客户端就很容易了。