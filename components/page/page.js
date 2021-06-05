const app = getApp();
let originPage = Page

export default function (context = {}) {
  /**
   * merge 渲染层的功能到Page中
   */
  // Object.assign(context, list)
  /**
   * 页面加载函数重写
   */
  let originOnLoad = context.onLoad
  context.onLoad = function (options) {
    const that = this
    originOnLoad && originOnLoad.call(that, options)
  }
  /**
   * 触摸滑动事件后
   */
  let originonPageEvent = context.onPageEvent
  context.onPageEvent = function (e) {
    const that = this
    switch (e.direction) {
      case 'leftedge':
      case 'rightedge':
        wx.navigateBack({
          delta: -1
        })
        break
      case 'left':
      case 'right':
        break;
      case 'down':
        break
      default:
        break
    }
    originonPageEvent && originonPageEvent.call(that, e)
  }

  return Page({
    data: Object.assign(context.data, {
      pageStats: {
        maxScrollTop: 0,
        scrollTop: 0,
        reachBottom: false,
        Custom: app.globalData.Custom,
        CustomBar: app.globalData.CustomBar,
        StatusBar: app.globalData.StatusBar,
        ScreenWidth: app.globalData.SystemInfo.screenWidth,
        ScreenHeight: app.globalData.SystemInfo.screenHeight,
      },
      scrollTopArray: {},
      Custom: app.globalData.Custom,
      CustomBar: app.globalData.CustomBar,
      StatusBar: app.globalData.StatusBar,
      ScreenWidth: app.globalData.SystemInfo.screenWidth,
      ScreenHeight: app.globalData.SystemInfo.screenHeight,
    }),
    props: {
      pureDataPatten: /^_/
    },
    NavChange(e) {
      var that = this
      // 处理前一个页面的生命周期
      // this.getCurrComponent().onHide()
      // this.getCurrComponent().onUnload()
      var id = e.currentTarget.dataset.id
      var index = e.currentTarget.dataset.index
      var query = e.currentTarget.dataset.query
      this.setData({
        PageCur: e.currentTarget.dataset.cur,
        isNavChange: true,
        isShow: true
      }, () => {
        (this.tabbarChange && "function" == typeof (this.tabbarChange)) && this.tabbarChange(e);
      })
      // 处理现在一个页面的生命周期
      // this.getCurrComponent().onLoad()
      // this.getCurrComponent().onShow()
      // this.getCurrComponent().onReady()
      // wx.pageScrollTo 会导致触发 onPageScroll，出现屏幕scrollTop被改
      wx.pageScrollTo({
        duration: 0,
        scrollTop: this.data.scrollTopArray[e.currentTarget.dataset.cur] || 0,
        complete() {
          that.data.isNavChange = false
        }
      })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: "colorui-cli",
        imageUrl: '',
        path: '/pages/index/index'
      }
    },
    onShareTimeline() {
      return {
        title: "colorui-cli",
        imageUrl: '',
        query: '/pages/index/index'
      }
    },
    ...context
  });
}