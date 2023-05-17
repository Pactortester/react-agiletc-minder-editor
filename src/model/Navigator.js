import config from "../constant/config.minder";

class Navigator {
  // 构造函数
  constructor(props) {
    this.props = props;
    // 字段
    this.zoom = 100; // 初始缩放比例
    this.triggerActive = true;
    this.paper; // 承载缩略图的画布
    this.pathHandler;
    this.nodeThumb;
    this.connectionThumb;
    this.visibleRect;
    this.contentView;
    this.visibleView;
    this.isMove = false; // 判断是否在导航盘的拖拽状态
    this.fullScreen = false; // 记录浏览器全屏模式，以供其他editor下的类使用
    window.minder.setDefaultOptions({ zoom: config.zoom }); // 自定义缩放的比例
    window.minder.on("zoom", (e) => {
      this.zoom = e.zoom;
      this.setZoom();
    });
    // document.getElementById('project-component-container').addEventListener('mousemove', (e) => {  // 阻止鼠标拖拽的默认事件
    //     if (this.isMove) e.preventDefault();
    // }, false)
    window.minder.on("themechange", (e) => {
      // 主题切换事件
      this.pathHandler = this.getPathHandler(e.theme);
    });
    this.pathHandler = this.getPathHandler(window.minder.getTheme());
    this.setPaper();
  }

  setPaper = () => {
    this.paper = new window.window.kity.Paper("nav-previewer");
    // 用两个路径绘制节点和连线的缩略图
    this.nodeThumb = this.paper.put(new window.kity.Path());
    this.connectionThumb = this.paper.put(new window.kity.Path());

    // 表示可视区域的矩形
    this.visibleRect = this.paper.put(
      new window.kity.Rect(100, 100).stroke("red", "1%")
    );

    this.contentView = new window.kity.Box();
    this.visibleView = new window.kity.Box();

    if (this.triggerActive) {
      this.bind();
      this.updateContentView();
      this.updateVisibleView();
    } else {
      this.unbind();
    }

    this.navigate();
  };

  navigate = () => {
    var dragging = false;

    this.paper.on("mousedown", (e) => {
      this.isMove = true;
      dragging = true;
      this.moveView(e.getPosition("top"), 200);
      document.getElementById("nav-previewer").className = "nav-previewer grab";
    });

    this.paper.on("mousemove", (e) => {
      if (dragging) {
        this.moveView(e.getPosition("top"), 0);
      }
    });

    this.paper.on("mouseup", (e) => {
      this.isMove = false;
      dragging = false;
      document.getElementById("nav-previewer").className = "nav-previewer";
    });

    // document.getElementById('kityminder-core').addEventListener('mouseup', () => {
    //     this.isMove = false;
    //     dragging = false;
    //     document.getElementById('nav-previewer').className = 'nav-previewer';
    // }, false)
  };

  handleTriggerClick = () => {
    // 点击导航栏的trigger时
    this.triggerActive = !this.triggerActive;
    this.setTriggerActive();
    if (this.triggerActive) {
      this.bind();
      this.updateContentView();
      this.updateVisibleView();
    } else {
      this.unbind();
    }
  };

  bind = () => {
    window.minder.on("layout layoutallfinish", this.updateContentView);
    window.minder.on("viewchange", this.updateVisibleView);
  };

  unbind = () => {
    window.minder.off("layout layoutallfinish", this.updateContentView);
    window.minder.off("viewchange", this.updateVisibleView);
  };

  moveView = (center, duration) => {
    var box = this.visibleView;
    center.x = -center.x;
    center.y = -center.y;

    var viewMatrix = window.minder.getPaper().getViewPortMatrix();
    box = viewMatrix.transformBox(box);

    var targetPosition = center.offset(box.width / 2, box.height / 2);

    window.minder.getViewDragger().moveTo(targetPosition, duration);
  };

  getPathHandler = (theme) => {
    switch (theme) {
      case "tianpan":
      case "tianpan-compact":
        return function (nodePathData, x, y, width, height) {
          var r = width >> 1;
          nodePathData.push("M", x, y + r, "a", r, r, 0, 1, 1, 0, 0.01, "z");
        };
      default: {
        return function (nodePathData, x, y, width, height) {
          nodePathData.push(
            "M",
            x,
            y,
            "h",
            width,
            "v",
            height,
            "h",
            -width,
            "z"
          );
        };
      }
    }
  };

  updateContentView = () => {
    var view = window.minder.getRenderContainer().getBoundaryBox();

    this.contentView = view;

    var padding = 30;

    this.paper.setViewBox(
      view.x - padding - 0.5,
      view.y - padding - 0.5,
      view.width + padding * 2 + 1,
      view.height + padding * 2 + 1
    );

    var nodePathData = [];
    var connectionThumbData = [];

    window.minder.getRoot().traverse((node) => {
      var box = node.getLayoutBox();
      this.pathHandler(nodePathData, box.x, box.y, box.width, box.height);
      if (node.getConnection() && node.parent && node.parent.isExpanded()) {
        connectionThumbData.push(node.getConnection().getPathData());
      }
    });

    this.paper.setStyle("background", window.minder.getStyle("background"));

    if (nodePathData.length) {
      this.nodeThumb
        .fill(window.minder.getStyle("root-background"))
        .setPathData(nodePathData);
    } else {
      this.nodeThumb.setPathData(null);
    }

    if (connectionThumbData.length) {
      this.connectionThumb
        .stroke(window.minder.getStyle("connect-color"), "0.5%")
        .setPathData(connectionThumbData);
    } else {
      this.connectionThumb.setPathData(null);
    }

    this.updateVisibleView();
  };

  updateVisibleView = () => {
    this.visibleView = window.minder.getViewDragger().getView();
    this.visibleRect.setBox(this.visibleView.intersect(this.contentView));
  };

  setZoom = () => {
    this.props.handleState("zoom", this.zoom);
  };

  setTriggerActive = () => {
    this.props.handleState("triggerActive", this.triggerActive);
  };
}

export default Navigator;
