// template/render/render.js
import item from './item/item.js'
import form from './form/form.js'
import basic from './basic/basic.js'
import interactive from './interactive/interactive.js'

export default Object.assign({
  render(ctx) {
    console.log(this)
  },
  checkAuth() {
    return new Promise((resolver, reject) => {
      wx.getSetting({
        success: (res) => {
          /*
           * res.authSetting = {
           *   "scope.userInfo": true,
           *   "scope.userLocation": true
           * }
           */
          var hasUserInfo = wx.getStorageSync('hasUserInfo') || false
          var authConfig = wx.getStorageSync('layout').authConfig || {
            authStatus: 1,
            title: "微信授权",
            content: "请确是否授权？"
          }
          if (authConfig.authStatus == 2 || !res.authSetting['scope.userInfo'] || !hasUserInfo) {
            resolver({
              authConfig: authConfig
            })
          }
        },
        fail(e) {
          reject(e)
        }
      })
    }).catch((e) => {
      console.log(e)
    });
  },
  getEnv(e) {
    return e.currentTarget.dataset.env || e.target.dataset.env
  },
  /**
   * 渲染视图
   */
  renderData(e, data) {
    var env = this.getEnv(e)
    var tindex = env._index
    var route = env._route
    var list = {}
    for (var item in data) {
      list[route + '.' + item] = data[item]
    }
    this.setData(list)
  },
  /**
   * 依据可以获取数据
   */
  getData(e, key) {
    var env = this.getEnv(e)
    var tindex = env._index
    var route = env._route
    var data = this.parser.get(env._path, this.data)
    return key ? data[key] : data
  },
  /**
   * 事件开始触发视图view变化
   */
  createElement(e) {
    var env = this.getEnv(e)
    var _tindex = env._index
    var tindex_ = _tindex + (env._node ? 2 : 1)
    var list = this.data.list || []
    env._node && list.splice(_tindex, 0, env._node)
    env.node_ && list.splice(tindex_, 0, env.node_)
    for (let i = _tindex; i < list.length; ++i) {
      this.parser.parse(list[i], "list." + i, "list[" + i + "]")
      delete(list[i]['_']), delete(list[i]['$']), delete(list[i]['#'])
    }
    // 新增试图事件交互处理
    if (env._node) {
      let _eventId = env._id + ">" + this.data.list[_tindex]._env._id
      this.data.list[_tindex]._env._eventId = _eventId
      this.app.event.on(_eventId, this, function(e) {
        console.log(e)
      })
    }
    if (env.node_) {
      let eventId_ = env._id + ">" + this.data.list[tindex_]._env._id
      this.data.list[tindex_]._env._eventId = eventId_
      this.app.event.on(eventId_, this, function(e) {
        console.log(e)
      })
    }
    this.setData({
      list: list
    })
    // 更新lru cache
    this.lru.set(this.data.path, this.data)
  },
  /**
   * 事件结束触发视图view变化
   */
  removeElement(e, index) {
    var env = this.getEnv(e)
    var tindex = env._index
    var list = this.data.list || []
    env.value = this.data.list[tindex]
    e.target.dataset.env = e.currentTarget.dataset.env = env
    if (index) {
      list.splice(index, 1)
    } else {
      list.splice(tindex, 1)
    }
    for (let i = tindex; i < list.length; ++i) {
      this.parser.parse(list[i], "list." + i, "list[" + i + "]")
    }
    this.setData({
      list: list
    })
    // 更新lru cache
    this.lru.set(this.data.path, this.data)
    env._eventId && this.app.event.emit(env._eventId, e)
  },
  /**
   * 点击事件前期处理
   */
  beforeClick(e) {
    var env = this.getEnv(e)
    // 处理绑定数据
    for (let j = 0, len = (env._param || []).length; j < len; j++) {
      env._param[[env._param[j]]] = this.data._bind[env._param[j]]
      delete env._param[j]
    }
    // 处理页面路由事件
    (env._href || env._href2) && this.wxHandle(e);
    // 处理函数
    if (env._methodName && this.data._on[env._methodName]) {
      this.data._on[env._methodName](this, e)
    }
    // 处理节点视图
    (env._node || env.node_) && this.createElement(e)
  },
  /**
   * 点击事件发送处理函数
   */
  afterClick(e) {
    var env = this.getEnv(e)
    var tindex = env._index
  },
  /**
   * 封装wx的页面路由
   */
  wxHandle(e) {
    var status = false
    var env = this.getEnv(e)
    var path = env._href || env._href2
    switch (path) {
      case 'back':
        wx.navigateBack({
          delta: 1
        });
        status = true
        break;
      case 'home':
      case 'homefill':
        wx.reLaunch({
          url: '/pages/index/index',
        })
        status = true
        break;
      case 'previewImage':
        let url = e.currentTarget.dataset.url
        let urls = e.currentTarget.dataset.urls || [url]
        if (url) {
          wx.previewImage({
            urls: urls,
            current: urls
          });
        }
        status = true
      case 'tabbar':
        status = true
      default:
        break;
    }
    // 非wx系统处理且存在上下文id，处理跳转页面
    if (!status && env._id) {
      this.navigateToPath(env)
    }
    return status
  },
  /**
   * 打开新页面
   */
  navigateToPath(env) {
    var path = env._href
    var query = env.query
    var eventId = env._id + ">" + this.parser.hash(path + query)
    this.app.event.on(eventId, this, function(e) {
      console.log(e)
    })
    wx.navigateTo({
      url: '/pages/index/index?path=' + path + '&ctx=' + JSON.stringify(env)
    })
  }
}, interactive, basic, item, form)