## 介绍(typescript)
antd-doddle是源于日常中后台系统开发不断的积累，如其名一样，让antd使用更加得心应手，实现业务的快速迭代。其中包含一部分的对antd组件深度封装，一些高频次自定义业务组件，和一些常用方法库的封装，支持按需打包。

## 使用文档

[文档地址](http://doc.closertb.site): http://doc.closertb.site, 首次加载较慢，请耐心等候。

## 安装

antd-doddle是一个多包的项目，组件与方法分离，依赖于react环境与antd组件库，支持treeShaking。

安装包
```sh
npm i antd-doddle --save
```

## 使用  

使用包中的组件  
```javascript
import { formRender } from 'antd-doddle';
```

使用包中的方法 
```javascript
import { getEnumObject } from 'antd-doddle/utils';
```


## Change Log

### 2019-05-13

 - feat: 新增dynamicParams，配合field设置isDynamic属性，用于获取从异步接口获取回来的动态枚举，具体使用请参见Demo

### 2019-06-28
 - feat: 新增FormRender, RenderDetail, EnhanceTable三个组件的扩展方法
 - feat: 新增extendFieldTypes使用说明文档

### 2019-08-25

 - feat: ts重写组件库
 - feat: 新增model， throtle装饰器

### 2019-10-07
 - 组件库文档打包构建优化，将打包体积由3M缩小到2M

### 2019-10-13
 - 增加ImageLoad组件  

### 2019-11-03
 - 增加文档库自动化构建部署更新

### 2019-11-03
 - 修改依赖# ehome-rcm-pc
