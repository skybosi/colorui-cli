const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    Left: {
      type: [Boolean, String],
      default: false
    },
    Right: {
      type: [Boolean, String],
      default: false
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    isMarquee: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  lifetimes: {
    created: function () { },
    attached: function () { },
    ready: function () {
      this.handlerIcon(this.data.Left, 'LeftOpenType');
      this.handlerIcon(this.data.Right, 'RightOpenType');
    },
    moved: function () {
      console.log('moved')
    },
    detached: function () {
      console.log('detached')
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    StatusList: [
      '☹️', '👿', '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉',
      '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕',
      '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡',
      '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭',
      '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '🙁', '🙂',
      '🙃', '🙄', '🤐', '🤑', '🤒', '🤓', '🤔', '🤕', '🤗', '🤠', '🤢', '🤣',
      '🤤', '🤥', '🤧', '🤨', '🤩', '🤪', '🤫', '🤬', '🤭', '🤮', '🤯', '🥰',
      '🥱', '🥳', '🥴', '🥵', '🥶', '🥺', '🧐']
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage(e) {
      var options = {} // 触发事件的选项
      this.handlerEvent('back', e, options)
    },
    onLeft(e) {
      var options = {} // 触发事件的选项      
      this.handlerEvent('left', e, options);
    },
    onRight(e) {
      var options = {} // 触发事件的选项
      this.handlerEvent('right', e, options);
    },
    // 不同默认图标对应的open-type
    handlerIcon(icontype, iconkey) {
      switch (icontype) {
        case 'question':
        case 'questionfill':
          this.setData({ [iconkey]: 'feedback' })
          break;
        case 'service':
        case 'servicefill':
          this.setData({ [iconkey]: 'contact' })
          break;
        case 'share':
        case 'sharefill':
          this.setData({ [iconkey]: 'share' })
          break;
        case 'home':
        case 'homefill':
          this.setData({ [iconkey]: 'home' })
          break;
        case 'apps': // TODO
        case 'appsfill':
          this.setData({ [iconkey]: 'launchApp' })
          break;
        case 'phone':// TODO
        case 'phonefill':
          this.setData({ [iconkey]: 'getPhoneNumber' })
          break;
        default: break;
      }
    },
    // 不同默认图标的功能事件
    handlerEvent(eventType, e, options) {
      var id = e.currentTarget.id || e.target.id;
      switch (id) {
        case 'home':
        case 'homefill':
          wx.reLaunch({ url: '/pages/index/index' })
          break;
        case 'back':
          wx.navigateBack({ delta: 1 });
          break;
        default:
          this.triggerEvent(eventType, e, options)
          break;
      }
    }
  }
})