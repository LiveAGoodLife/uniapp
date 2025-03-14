if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$b = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _sfc_main$a = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
          },
          null,
          2
          /* CLASS */
        )) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode(
            "text",
            {
              style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
              class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
            },
            vue.toDisplayString($props.title),
            7
            /* TEXT, CLASS, STYLE */
          ),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
              class: "uni-section-header__content-sub"
            },
            vue.toDisplayString($props.subTitle),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "uni-section-content",
          style: vue.normalizeStyle({ padding: $options._padding })
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-637fd36b"], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const _sfc_main$9 = {
    name: "UniDrawer",
    components: {},
    emits: ["change"],
    props: {
      /**
       * 显示模式（左、右），只在初始化生效
       */
      mode: {
        type: String,
        default: ""
      },
      /**
       * 蒙层显示状态
       */
      mask: {
        type: Boolean,
        default: true
      },
      /**
       * 遮罩是否可点击关闭
       */
      maskClick: {
        type: Boolean,
        default: true
      },
      /**
       * 抽屉宽度
       */
      width: {
        type: Number,
        default: 220
      }
    },
    data() {
      return {
        visibleSync: false,
        showDrawer: false,
        rightMode: false,
        watchTimer: null,
        drawerWidth: 220
      };
    },
    created() {
      this.drawerWidth = this.width;
      this.rightMode = this.mode === "right";
    },
    methods: {
      clear() {
      },
      close(type) {
        if (type === "mask" && !this.maskClick || !this.visibleSync)
          return;
        this._change("showDrawer", "visibleSync", false);
      },
      open() {
        if (this.visibleSync)
          return;
        this._change("visibleSync", "showDrawer", true);
      },
      _change(param1, param2, status) {
        this[param1] = status;
        if (this.watchTimer) {
          clearTimeout(this.watchTimer);
        }
        this.watchTimer = setTimeout(() => {
          this[param2] = status;
          this.$emit("change", status);
        }, status ? 50 : 300);
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visibleSync ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass([{ "uni-drawer--visible": $data.showDrawer }, "uni-drawer"]),
        onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.clear && $options.clear(...args), ["stop", "prevent"]))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__mask", { "uni-drawer__mask--visible": $data.showDrawer && $props.mask }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.close("mask"))
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__content", { "uni-drawer--right": $data.rightMode, "uni-drawer--left": !$data.rightMode, "uni-drawer__content--visible": $data.showDrawer }]),
            style: vue.normalizeStyle({ width: $data.drawerWidth + "px" })
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      34
      /* CLASS, NEED_HYDRATION */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-f7c32d22"], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-drawer/components/uni-drawer/uni-drawer.vue"]]);
  const _sfc_main$8 = {
    __name: "StatsCard",
    props: {
      // 用户信息
      userInfo: {
        type: Object,
        default: () => ({
          name: "用户",
          avatar: "/static/default-avatar.png",
          greeting: "Hello",
          tagName: ""
        })
      },
      // 统计数据项
      statsItems: {
        type: Array,
        default: () => []
      },
      // 是否显示用户信息区域
      showUserInfo: {
        type: Boolean,
        default: true
      },
      // 卡片背景色
      backgroundColor: {
        type: String,
        default: "#1890ff"
      },
      // 是否使用渐变背景
      useGradient: {
        type: Boolean,
        default: true
      },
      // 渐变开始颜色
      gradientStartColor: {
        type: String,
        default: "#1890ff"
      },
      // 渐变结束颜色
      gradientEndColor: {
        type: String,
        default: "#0076e4"
      },
      // 卡片圆角大小
      borderRadius: {
        type: [String, Number],
        default: 16
      },
      // 卡片内边距
      padding: {
        type: [String, Number],
        default: 30
      }
    },
    emits: ["tag-click", "stats-item-click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const cardStyle = vue.computed(() => {
        const style = {
          padding: typeof props.padding === "number" ? props.padding + "rpx" : props.padding,
          borderRadius: typeof props.borderRadius === "number" ? props.borderRadius + "rpx" : props.borderRadius
        };
        if (props.useGradient) {
          style.background = `linear-gradient(135deg, ${props.gradientStartColor}, ${props.gradientEndColor})`;
        } else {
          style.backgroundColor = props.backgroundColor;
        }
        return style;
      });
      const onTagClick = () => {
        emit("tag-click", props.userInfo);
      };
      const onStatsItemClick = (item) => {
        emit("stats-item-click", item);
      };
      const __returned__ = { props, emit, cardStyle, onTagClick, onStatsItemClick, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "header-card" }, [
      vue.createElementVNode(
        "view",
        {
          class: "card",
          style: vue.normalizeStyle($setup.cardStyle)
        },
        [
          vue.createCommentVNode(" 用户信息区域 "),
          $props.showUserInfo ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "user-info"
          }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $props.userInfo.avatar,
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "greeting" }, [
              vue.createElementVNode(
                "text",
                { class: "hello" },
                vue.toDisplayString($props.userInfo.greeting || "Hello") + ", " + vue.toDisplayString($props.userInfo.name),
                1
                /* TEXT */
              ),
              $props.userInfo.tagName ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "tag",
                onClick: $setup.onTagClick
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "tag-text" },
                  vue.toDisplayString($props.userInfo.tagName),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 自定义头部插槽 "),
          vue.renderSlot(_ctx.$slots, "header", {}, void 0, true),
          vue.createCommentVNode(" 数据统计区域 "),
          $props.statsItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "stats-container"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.statsItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "stats-item",
                  key: index,
                  onClick: ($event) => $setup.onStatsItemClick(item),
                  style: vue.normalizeStyle({ width: 100 / $props.statsItems.length + "%" })
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "count" },
                    vue.toDisplayString(item.count) + vue.toDisplayString(item.unit || ""),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "label" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ], 12, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 自定义底部插槽 "),
          vue.renderSlot(_ctx.$slots, "footer", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const StatsCard = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-9c64b9e3"], ["__file", "D:/work/bai-mes-mobile-app/components/StatsCard/StatsCard.vue"]]);
  const _imports_0 = "/static/icons/daiban.png";
  const _sfc_main$7 = {
    __name: "TodoSection",
    props: {
      // 标题
      title: {
        type: String,
        default: "待办任务"
      },
      // 待办任务列表
      tasks: {
        type: Array,
        default: () => []
      },
      // 是否显示"查看全部"按钮
      showMore: {
        type: Boolean,
        default: true
      },
      // 指示器颜色
      indicatorColor: {
        type: String,
        default: "#2979ff"
      },
      // 模块ID（用于查看全部时的跳转）
      moduleId: {
        type: String,
        default: ""
      }
    },
    emits: ["view-more", "task-click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onViewMore = () => {
        emit("view-more", props.moduleId);
      };
      const onTaskClick = (task) => {
        emit("task-click", task);
      };
      const __returned__ = { props, emit, onViewMore, onTaskClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "todo-section" }, [
      vue.createElementVNode("view", { class: "section-header" }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "checkmark-icon" }, [
            vue.createElementVNode("image", {
              class: "name-icon",
              src: _imports_0,
              mode: ""
            })
          ]),
          vue.createElementVNode(
            "text",
            { class: "title-text" },
            vue.toDisplayString($props.title),
            1
            /* TEXT */
          )
        ]),
        $props.showMore ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "view-all",
          onClick: $setup.onViewMore
        }, [
          vue.createElementVNode("text", null, "查看全部"),
          vue.createVNode(_component_uni_icons, {
            type: "right",
            size: "14",
            color: "#999"
          })
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      $props.tasks.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "todo-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.tasks, (task) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "todo-item",
              key: task.id,
              onClick: ($event) => $setup.onTaskClick(task)
            }, [
              vue.createElementVNode("view", { class: "task-info" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "task-indicator",
                    style: vue.normalizeStyle({ backgroundColor: $props.indicatorColor })
                  },
                  null,
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "task-title" },
                  vue.toDisplayString(task.title),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "task-time" }, [
                vue.createTextVNode(
                  vue.toDisplayString(task.time) + " ",
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_uni_icons, {
                  type: "right",
                  size: "14",
                  color: "#ccc"
                })
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", null, "暂无待办任务")
      ]))
    ]);
  }
  const TodoSection = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-b10ef15b"], ["__file", "D:/work/bai-mes-mobile-app/components/TodoSection/TodoSection.vue"]]);
  const _sfc_main$6 = {
    __name: "FunctionGrid",
    props: {
      // 标题
      title: {
        type: String,
        default: "常用功能"
      },
      // 功能列表
      functions: {
        type: Array,
        default: () => []
      },
      // 每行显示的功能数量
      columnsPerRow: {
        type: Number,
        default: 4
      }
    },
    emits: ["function-click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const itemWidth = vue.computed(() => {
        return `${100 / props.columnsPerRow}%`;
      });
      const onFunctionClick = (func) => {
        emit("function-click", func);
      };
      const __returned__ = { props, emit, itemWidth, onFunctionClick, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "common-functions" }, [
      vue.createElementVNode("view", { class: "section-header" }, [
        vue.createElementVNode("view", { class: "checkmark-icon" }, [
          vue.createElementVNode("image", {
            class: "name-icon",
            src: _imports_0,
            mode: ""
          })
        ]),
        vue.createElementVNode(
          "text",
          { class: "section-title" },
          vue.toDisplayString($props.title),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "function-grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.functions, (func) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "function-item",
              key: func.id,
              onClick: ($event) => $setup.onFunctionClick(func),
              style: vue.normalizeStyle({ width: $setup.itemWidth })
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "function-icon",
                  style: vue.normalizeStyle({ backgroundColor: func.color })
                },
                [
                  vue.createElementVNode("image", {
                    src: func.icon,
                    mode: "aspectFit"
                  }, null, 8, ["src"])
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "text",
                { class: "function-name" },
                vue.toDisplayString(func.name),
                1
                /* TEXT */
              )
            ], 12, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const FunctionGrid = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-f15cda82"], ["__file", "D:/work/bai-mes-mobile-app/components/FunctionGrid/FunctionGrid.vue"]]);
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const user = vue.ref({
        name: "赵钱孙",
        avatar: "/static/avatar.png",
        greeting: "Hello",
        tagName: "连接员"
      });
      const statsData = vue.ref([
        { id: 1, count: 8, unit: "单", label: "待出库单" },
        { id: 2, count: 8, unit: "单", label: "待入库单" },
        { id: 3, count: 8, unit: "单", label: "待发运单" },
        { id: 4, count: 8, unit: "单", label: "今日接收" }
      ]);
      const customStats = vue.ref([
        { id: 1, count: 92, unit: "%", label: "完成率" },
        { id: 2, count: 157, label: "今日总量" }
      ]);
      const handleTagClick = (userInfo) => {
        uni.navigateTo({
          url: "/pages/connect/index"
        });
      };
      const handleStatsClick = (item) => {
        uni.navigateTo({
          url: `/pages/detail/index?type=${item.id}&label=${item.label}`
        });
      };
      const systemModules = vue.ref([
        {
          id: "device",
          name: "设备",
          icon: "/static/icons/device.png",
          description: "设备管理与维护"
        },
        {
          id: "quality",
          name: "技术质量",
          icon: "/static/icons/quality.png",
          description: "质量检测与标准管理"
        },
        {
          id: "warehouse",
          name: "仓库管理",
          icon: "/static/icons/warehouse.png",
          description: "库存与物料管理"
        }
      ]);
      const currentModule = vue.ref(systemModules.value[0]);
      const drawer = vue.ref(null);
      const moduleTasksData = {
        device: [
          { id: 1, title: "设备保修待审核", time: "06.29 10:30" },
          { id: 2, title: "设备保修待审核", time: "06.29 10:12" },
          { id: 3, title: "设备保修待审核", time: "06.29 08:30" }
        ],
        quality: [
          { id: 1, title: "质量检测待处理", time: "06.29 11:30" },
          { id: 2, title: "技术标准待审核", time: "06.29 09:45" }
        ],
        warehouse: [
          { id: 1, title: "物料入库待确认", time: "06.29 14:20" },
          { id: 2, title: "出库申请待审核", time: "06.29 13:10" },
          { id: 3, title: "库存盘点任务", time: "06.29 09:00" }
        ]
      };
      const moduleFunctionsData = {
        device: [
          { id: "d1", name: "基本信息", icon: "/static/icons/info.png", color: "#2979ff" },
          { id: "d2", name: "运维管理", icon: "/static/icons/operation.png", color: "#ff9500" },
          { id: "d3", name: "设备报修", icon: "/static/icons/repair.png", color: "#4cd964" },
          { id: "d4", name: "盘点", icon: "/static/icons/inventory.png", color: "#2979ff" },
          { id: "d5", name: "采购", icon: "/static/icons/purchase.png", color: "#4cd964" }
        ],
        quality: [
          { id: "q1", name: "质量检测", icon: "/static/icons/quality.png", color: "#2979ff" },
          { id: "q2", name: "标准管理", icon: "/static/icons/standard.png", color: "#ff9500" },
          { id: "q3", name: "质量报告", icon: "/static/icons/report.png", color: "#4cd964" },
          { id: "q4", name: "检测计划", icon: "/static/icons/plan.png", color: "#2979ff" }
        ],
        warehouse: [
          { id: "w1", name: "收货单", icon: "/static/icons/inbound.png", color: "#0096FF" },
          { id: "w2", name: "出库管理", icon: "/static/icons/outbound.png", color: "#0096FF" },
          { id: "w3", name: "入库管理", icon: "/static/icons/inventory.png", color: "#0096FF" },
          { id: "w4", name: "盘点单", icon: "/static/icons/material.png", color: "#0096FF" },
          { id: "w5", name: "签收单", icon: "/static/icons/check.png", color: "#0096FF" },
          { id: "w6", name: "移位单", icon: "/static/icons/check.png", color: "#0096FF" },
          { id: "w7", name: "装箱单", icon: "/static/icons/check.png", color: "#0096FF" },
          { id: "w8", name: "包装管理", icon: "/static/icons/check.png", color: "#0096FF" },
          { id: "w9", name: "承运单", icon: "/static/icons/check.png", color: "#0096FF" },
          { id: "w10", name: "审批消息", icon: "/static/icons/check.png", color: "#0096FF" }
        ]
      };
      const tabItems = vue.ref([
        {
          id: "workspace",
          name: "工作台",
          icon: "/static/icons/workspace.png",
          activeIcon: "/static/icons/workspace-active.png"
        },
        {
          id: "message",
          name: "消息",
          icon: "/static/icons/message.png",
          activeIcon: "/static/icons/message-active.png"
        },
        {
          id: "report",
          name: "报表",
          icon: "/static/icons/report.png",
          activeIcon: "/static/icons/report-active.png"
        },
        {
          id: "profile",
          name: "我的",
          icon: "/static/icons/profile.png",
          activeIcon: "/static/icons/profile-active.png"
        }
      ]);
      const activeTab = vue.ref("工作台");
      const switchTab = (tabName) => {
        activeTab.value = tabName;
      };
      const openScan = () => {
        uni.scanCode({
          success: (res) => {
            uni.showToast({
              title: "扫码成功: " + res.result,
              icon: "none"
            });
          }
        });
      };
      const openSettings = () => {
        uni.navigateTo({
          url: "/pages/settings/index"
        });
      };
      const viewAllTodos = (moduleId) => {
        uni.navigateTo({
          url: `/pages/todo/list?module=${moduleId || currentModule.value.id}`
        });
      };
      const handleTaskClick = (task) => {
        uni.navigateTo({
          url: `/pages/todo/detail?id=${task.id}&module=${currentModule.value.id}`
        });
      };
      const openFunction = (func) => {
        uni.navigateTo({
          url: `/pages/modules/${currentModule.value.id}/functions/${func.id}`
        });
      };
      const openDrawer = () => {
        drawer.value.open();
      };
      const closeDrawer = () => {
        drawer.value.close();
      };
      const selectDevice = () => {
        uni.navigateTo({
          url: "/pages/device/select"
        });
      };
      const currentTasks = vue.computed(() => {
        return moduleTasksData[currentModule.value.id] || [];
      });
      const currentFunctions = vue.computed(() => {
        return moduleFunctionsData[currentModule.value.id] || [];
      });
      const getIndicatorColor = (moduleId) => {
        switch (moduleId) {
          case "device":
            return "#2979ff";
          case "quality":
            return "#ff9500";
          case "warehouse":
            return "#4cd964";
          default:
            return "#2979ff";
        }
      };
      const selectModule = (module) => {
        if (currentModule.value.id === module.id) {
          return;
        }
        currentModule.value = module;
        uni.showToast({
          title: `已切换到${module.name}模块`,
          icon: "none",
          duration: 1500
        });
      };
      const getPageTitle = vue.computed(() => {
        switch (currentModule.value.id) {
          case "device":
            return "设备管理";
          case "quality":
            return "技术质量";
          case "warehouse":
            return "仓库管理";
          default:
            return "IMES智能制造";
        }
      });
      const __returned__ = { user, statsData, customStats, handleTagClick, handleStatsClick, systemModules, currentModule, drawer, moduleTasksData, moduleFunctionsData, tabItems, activeTab, switchTab, openScan, openSettings, viewAllTodos, handleTaskClick, openFunction, openDrawer, closeDrawer, selectDevice, currentTasks, currentFunctions, getIndicatorColor, selectModule, getPageTitle, StatsCard, TodoSection, FunctionGrid, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$2);
    const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_1$1);
    const _component_uni_drawer = resolveEasycom(vue.resolveDynamicComponent("uni-drawer"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 顶部设备选择和操作区 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "module-selector",
          onClick: $setup.openDrawer
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.currentModule.name),
            1
            /* TEXT */
          ),
          vue.createVNode(_component_uni_icons, {
            type: "arrowdown",
            size: "14",
            color: "#666"
          })
        ]),
        vue.createElementVNode("view", { class: "action-buttons" }, [
          vue.createElementVNode("view", {
            class: "scan-btn",
            onClick: $setup.openScan
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "scan",
              size: "24",
              color: "#2979ff"
            })
          ]),
          vue.createElementVNode("view", {
            class: "settings-btn",
            onClick: $setup.openSettings
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "gear",
              size: "24",
              color: "#666"
            })
          ])
        ])
      ]),
      vue.createCommentVNode(" 卡片 "),
      $setup.currentModule.id !== "device" ? (vue.openBlock(), vue.createBlock($setup["StatsCard"], {
        key: 0,
        "user-info": $setup.user,
        "stats-items": $setup.statsData,
        "fixed-top": true,
        onTagClick: $setup.handleTagClick,
        onStatsItemClick: $setup.handleStatsClick
      }, null, 8, ["user-info", "stats-items"])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 待办任务组件 "),
      vue.createVNode($setup["TodoSection"], {
        tasks: $setup.currentTasks,
        "module-id": $setup.currentModule.id,
        "indicator-color": $setup.getIndicatorColor($setup.currentModule.id),
        onViewMore: $setup.viewAllTodos,
        onTaskClick: $setup.handleTaskClick
      }, null, 8, ["tasks", "module-id", "indicator-color"]),
      vue.createCommentVNode(" 常用功能组件 "),
      vue.createVNode($setup["FunctionGrid"], {
        functions: $setup.currentFunctions,
        "columns-per-row": 4,
        onFunctionClick: $setup.openFunction
      }, null, 8, ["functions"]),
      vue.createCommentVNode(" 底部导航栏 "),
      vue.createElementVNode("view", { class: "tab-bar" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.tabItems, (tab) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["tab-item", { active: $setup.activeTab === tab.name }]),
              key: tab.id,
              onClick: ($event) => $setup.switchTab(tab.name)
            }, [
              vue.createElementVNode("image", {
                src: $setup.activeTab === tab.name ? tab.activeIcon : tab.icon,
                mode: "aspectFit",
                class: "tab-icon"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass({ "active-text": $setup.activeTab === tab.name })
                },
                vue.toDisplayString(tab.name),
                3
                /* TEXT, CLASS */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 系统模块选择抽屉 "),
      vue.createVNode(
        _component_uni_drawer,
        {
          ref: "drawer",
          mode: "left",
          "mask-click": true,
          width: 300
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "drawer-content" }, [
              vue.createElementVNode("view", { class: "drawer-header" }, [
                vue.createElementVNode("text", { class: "drawer-title" }, "选择模块")
              ]),
              vue.createVNode(_component_uni_section, {
                title: "系统模块",
                type: "line"
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "module-list" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.systemModules, (module) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: vue.normalizeClass(["module-list-item", { active: $setup.currentModule.id === module.id }]),
                          key: module.id,
                          onClick: ($event) => $setup.selectModule(module)
                        }, [
                          vue.createElementVNode("view", { class: "module-item-left" }, [
                            vue.createElementVNode("image", {
                              src: module.icon,
                              class: "module-icon"
                            }, null, 8, ["src"]),
                            vue.createElementVNode("view", { class: "module-info" }, [
                              vue.createElementVNode(
                                "text",
                                { class: "module-name" },
                                vue.toDisplayString(module.name),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode(
                                "text",
                                { class: "module-desc" },
                                vue.toDisplayString(module.description),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          $setup.currentModule.id === module.id ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                            key: 0,
                            type: "checkmarkempty",
                            size: "18",
                            color: "#2979ff"
                          })) : vue.createCommentVNode("v-if", true)
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createElementVNode("view", { class: "drawer-footer" }, [
                vue.createElementVNode("button", {
                  class: "close-btn",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.closeDrawer())
                }, "关闭")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/work/bai-mes-mobile-app/pages/index/index.vue"]]);
  const popup = {
    data() {
      return {};
    },
    created() {
      this.popup = this.getParent();
    },
    methods: {
      /**
       * 获取父元素实例
       */
      getParent(name = "uniPopup") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  const _sfc_main$4 = {
    name: "uniPopupMessage",
    mixins: [popup],
    props: {
      /**
       * 主题 success/warning/info/error	  默认 success
       */
      type: {
        type: String,
        default: "success"
      },
      /**
       * 消息文字
       */
      message: {
        type: String,
        default: ""
      },
      /**
       * 显示时间，设置为 0 则不会自动关闭
       */
      duration: {
        type: Number,
        default: 3e3
      },
      maskShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    created() {
      this.popup.maskShow = this.maskShow;
      this.popup.messageChild = this;
    },
    methods: {
      timerClose() {
        if (this.duration === 0)
          return;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.popup.close();
        }, this.duration);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-popup-message" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["uni-popup-message__box fixforpc-width", "uni-popup__" + $props.type])
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["uni-popup-message-text", "uni-popup__" + $props.type + "-text"])
              },
              vue.toDisplayString($props.message),
              3
              /* TEXT, CLASS */
            )
          ], true)
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-a4566996"], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.vue"]]);
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$3 = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = {
          ...this.styles,
          "transition-duration": this.duration / 1e3 + "s"
        };
        let transform = "";
        for (let i in styles) {
          let line = this.toLine(i);
          transform += line + ":" + styles[i] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])), [
      [vue.vShow, $data.isShow]
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$2 = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e) {
        e.stopPropagation();
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:310", "缺少类型：", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          this.showPoptrans();
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      showPoptrans() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.showTrans = true;
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0);
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]])
      },
      [
        vue.createElementVNode(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? (vue.openBlock(), vue.createBlock(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: vue.normalizeStyle($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* NEED_HYDRATION */
        )
      ],
      2
      /* CLASS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-4dd3c44b"], ["__file", "D:/work/bai-mes-mobile-app/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _sfc_main$1 = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const phone = vue.ref("");
      const verificationCode = vue.ref("");
      const isSending = vue.ref(false);
      const countdown = vue.ref(60);
      const verificationBtnText = vue.ref("获取验证码");
      const toastMessage = vue.ref("");
      const toastType = vue.ref("success");
      const popup2 = vue.ref(null);
      let timer = null;
      const getVerificationCode = () => {
        if (!/^1[3-9]\d{9}$/.test(phone.value)) {
          showToast("请输入正确的手机号", "error");
          return;
        }
        isSending.value = true;
        countdown.value = 60;
        verificationBtnText.value = `${countdown.value}s`;
        timer = setInterval(() => {
          if (countdown.value > 1) {
            countdown.value--;
            verificationBtnText.value = `${countdown.value}s`;
          } else {
            clearInterval(timer);
            isSending.value = false;
            verificationBtnText.value = "获取验证码";
          }
        }, 1e3);
        showToast("验证码已发送", "success");
      };
      const showToast = (message, type = "success") => {
        toastMessage.value = message;
        toastType.value = type;
        popup2.value.open();
      };
      const handleLogin = () => {
        if (!phone.value) {
          showToast("请输入手机号", "error");
          return;
        }
        if (!verificationCode.value) {
          showToast("请输入验证码", "error");
          return;
        }
        uni.showLoading({
          title: "登录中..."
        });
        setTimeout(() => {
          uni.setStorageSync("token", "111");
          uni.hideLoading();
          uni.reLaunch({
            url: "/pages/index/index"
          });
        }, 1500);
      };
      const switchToPasswordLogin = () => {
        uni.navigateTo({
          url: "/pages/login/password-login"
        });
      };
      vue.onUnmounted(() => {
        if (timer) {
          clearInterval(timer);
        }
      });
      const __returned__ = { phone, verificationCode, isSending, countdown, verificationBtnText, toastMessage, toastType, popup: popup2, get timer() {
        return timer;
      }, set timer(v) {
        timer = v;
      }, getVerificationCode, showToast, handleLogin, switchToPasswordLogin, ref: vue.ref, reactive: vue.reactive, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup_message = resolveEasycom(vue.resolveDynamicComponent("uni-popup-message"), __easycom_0$1);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createCommentVNode(" 顶部欢迎文字 "),
      vue.createElementVNode("view", { class: "welcome-section" }, [
        vue.createElementVNode("text", { class: "greeting" }, "您好！"),
        vue.createElementVNode("text", { class: "welcome-text" }, "欢迎来到IMES智能制造")
      ]),
      vue.createCommentVNode(" 登录表单 "),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createCommentVNode(" 手机号输入框 "),
        vue.createElementVNode("view", { class: "input-group" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.phone = $event),
              placeholder: "请输入手机号",
              clearable: "",
              maxlength: 11,
              type: "number",
              class: "phone-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.phone]
          ])
        ]),
        vue.createCommentVNode(" 验证码输入框和按钮 "),
        vue.createElementVNode("view", { class: "input-group verification-group" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.verificationCode = $event),
              placeholder: "请输入验证码",
              clearable: "",
              maxlength: 6,
              type: "number",
              class: "verification-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.verificationCode]
          ]),
          vue.createElementVNode("button", {
            class: "verification-button",
            type: "primary",
            disabled: $setup.isSending,
            onClick: $setup.getVerificationCode
          }, vue.toDisplayString($setup.verificationBtnText), 9, ["disabled"])
        ]),
        vue.createCommentVNode(" 登录按钮 "),
        vue.createElementVNode("button", {
          type: "primary",
          class: "login-button",
          onClick: $setup.handleLogin
        }, "登录"),
        vue.createCommentVNode(" 账号密码登录选项 "),
        vue.createElementVNode("view", { class: "alternative-login" }, [
          vue.createElementVNode("text", { onClick: $setup.switchToPasswordLogin }, "使用账号密码登录")
        ])
      ]),
      vue.createCommentVNode(" Toast 提示组件 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "popup",
          type: "center",
          "border-radius": "10px 10px 0 0"
        },
        {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_popup_message, {
              type: $setup.toastType,
              message: $setup.toastMessage,
              duration: 1e3
            }, null, 8, ["type", "message"])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/work/bai-mes-mobile-app/pages/login/login.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/login/login", PagesLoginLogin);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
      const token = uni.getStorageSync("token");
      if (!token) {
        uni.reLaunch({
          url: "/pages/login/login"
        });
      } else {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      }
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:21", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:24", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/work/bai-mes-mobile-app/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
