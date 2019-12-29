import React from "react";
import Loadable from "react-loadable";

const Spin = () => <div />;

/**
 * reactLoadable
 *  对 react-loadable 的封装
 *  @param {func} loader 加载组件的函数
 *  @param {func} loading 加载loading组件的函数
 *  @param {object} config react-loadable所支持的配置项
 * */
const reactLoadable = (loader, loading = Spin, config = {}) => {
  const _config = Object.assign(
    {
      loader,
      loading,
      delay: 300
    },
    config
  );
  return Loadable(_config);
};

export default reactLoadable;
