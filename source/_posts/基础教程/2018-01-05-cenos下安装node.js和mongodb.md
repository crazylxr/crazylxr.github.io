---
layout: post
cid: 17
title: cenos下安装node.js和mongodb
slug: 17
date: 2018/01/05 19:20:00
updated: 2018/01/05 20:20:30
status: publish
author: 桃翁
categories: 
  - 基础教程
tags: 
  - node
  - centos
  - mongodb
---


## node.js安装
下载源码
```bash
cd /usr/local/src/
wget https://nodejs.org/dist/v8.6.0/node-v8.6.0.tar.gz
```


<!--more-->


解压源码

```bash
tar zxvf node-v8.6.0.tar.gz
```
编译安装
```bash
cd node-v8.6.0
./configure --prefix=/usr/local/node/8.6.0
make
make install
```
遇到错误

make[1]: g++：命令未找到
make[1]: *** [/usr/local/src/node-v8.6.0/out/Release/obj.target/icuucx/deps/icu-small/source/common/utrie2_builder.o] 错误 127
rm 8f388ce961ec8cc8196f595f16fdcc7694a5fb89.intermediate
make[1]: Leaving directory `/usr/local/src/node-v8.6.0/out'
make: *** [node] 错误 2
执行
```bash
yum install gcc-c++
```
配置NODE_HOME，进入profile编辑环境变量
```bash
vim /etc/profile
```
设置nodejs环境变量，在 export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE HISTCONTROL 一行的上面添加如下内容:
```bash
#set for nodejs
export NODE_HOME=/usr/local/node/0.10.24
export PATH=$NODE_HOME/bin:$PATH
```
:wq保存并退出，编译/etc/profile 使配置生效
```bash
source /etc/profile
```
验证是否安装配置成功
```bash
node -v
```
npm模块安装路径
/usr/local/node/8.6.0/lib/node_modules/

## mongodb安装

下载安装包
下载地址：https://www.mongodb.com/download-center#community
下载的时候自己根据自己的系统和版本下载
解压tgz安装包
```bash
tar -zxvf mongodb-linux-x86_64-3.4.9.tgz
```
将解压包拷贝到指定目录
```bash
mv mongodb-linux-x86_64-3.4.9.tgz/ /usr/local/mongodb
```
MongoDB 的可执行文件位于 bin 目录下，所以可以将其添加到 PATH 路径中


用vi打开profile
```bash
vi /etc/profile
```
classpath添加路径
export CLASSPATH=/usr/local/mongodb/bin;

使profile生效
```bash
source /etc/profile
```
关于linux详细更多的添加环境变量只是[点我](http://www.jianshu.com/p/ac2bc0ad3d74)