## 约定的数据流

React 本身是单向数据流，框架层面提供的通信方式为 props、callback 与状态提升，还有一个特殊的 context。

常规项目 React 本身的通信方式完全可以满足，但是大型项目没有关联关系的组件无法直接通信，紧靠以上方式会严重拖慢开发效率，并且代码的可维护性会降低。

### 已知方案

社区目前已知的解决方案有 Flux、Redux、Mobx、Pubsub 等方式。

1.  团队没有 Flux 的实践，不在考虑范围
2.  Redux 学习曲线陡峭，各种库繁杂却没有最佳实践，写起来代码啰嗦，全局 state 会有刷新状态消失问题
3.  团队同样没有 Mobx 实践经验，社区大型项目的实践较少，适合中小型，小团队开发
4.  Pubsub 的方式需要项目有强力的开发规范约束，否则根本无法长期维护

### WigetComponent 存在的问题

1. componentWillUnmount、componentDidMount 周期失效
2. 引入 redux、react-redux、redux-thunk、history
3. onEventAction 不好用
4. instanceState 复杂，维护难度大，且目前业务没有使用该机制
5. 没有上下文信息
6. 搞这么复杂，就干了这么点事，想想就不爽

### 我想要这样的

1.  简单，简洁，易维护
2.  各业务模块彼此独立，通过路由拆分
3.  业务模块使用自己的本地 state，没有全局 state 的概念，掌握基本的 React 即可上手开发
4.  业务模块可以告诉框架做什么事情
5.  框架可切换上下文，切换后业务模块可根据上下文信息更新状态重新渲染页面

### 所以自己开发一个吧 :) react-ahax

不要问为什么叫 react-ahax？杰哥起的名字不需要怀疑。

#### react-ahax 有哪些 API？

Provider、@observer()、@inject()、dispatch、onEventAction

| 参数                  | 说明                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| Provider              | 注入 store,利用 context 与任意子组件通信                                        |
| @inject('store')      | 将组件连接到提供的 store，通过 this.props.store 拿到当前上下文                  |
| @observer([])         | 在 React 组件上监听事件，监听多个 actionType 时在 onEventAction 需要使用 switch |
| dispatch(action)      | 只有组件被 observer，this 中才有 dispatch 方法，触发事件                        |
| onEventAction(action) | 只有组件被 observer，当 dispatch 监听的事件时，onEventAction 被调用             |

#### (#‵′)靠，这么复杂，我已经开发完了，直接告诉我怎么改

1. 继承自 WidgetComponent 改为继承 React.Component，删除 registerComponent()
2. 在 class A extends React.Component 上方使用注解@observer([SCOPECHANGE])
3. 在 onEventAction 中不需要判断 actionType
4. 至此，你的模块就可以跑起来了
5. this.dispatch 调用方式与原来一致，不需要改
6. @inject('store')可作为优化手段，使用@inject('store')就不需要用 onEventAction 了，路由声明时也不需要 render 的形式，直接在需要上下文的子组件上@inject('store')即可，用法与@observer([])一致，支持无状态组件
