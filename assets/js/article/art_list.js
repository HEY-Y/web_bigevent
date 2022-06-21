$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  //定义美化事件的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //定义一个查询的参数对象 将来请求数据的时候 需要将请求参数对象提交到服务器
  var q = {
    // 页码值，默认请求第一页的数据
    pagenum: 1,
    // 煤业显示几条数据，默认每页显示2条
    pagesize: 2,
    // 文章分类的id
    cate_id: "",
    // 文章的发布状态
    state: "",
  };

  initTable();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      type: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

  initCate();

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      type: "get",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate-id]").html(htmlStr);
        // 通知layui重新渲染表单区域的ui结构
        form.render();
      },
    });
  }
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $("[name=cate-id").val();
    var state = $("[name=state").val();
    // 为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    //根据最新的筛选条件重新渲染表格数据
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render()方法来渲染分页结构
    laypage.render({
      // 分页容器的id
      elem: "pageBox",
      // 总数据的条数
      count: total,
      // 每页显示几条数据
      limit: q.pagesize,
      // 指定默认显示分页
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候 触发jump回调
      // 触发jump回调的方式有两种
      // 1.点击页码的时候，会触发jump回调
      // 2.调用laypage.render()方法，就会触发jump回调
      // 可以通过first的值来判断通过那种方式触发的jump回调
      // 如果first的值为true 证明是方式2触发的
      // 否则就是方式1触发的
      jump: function (obj, first) {
        // 把最新的页码值 赋值到q这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数 赋值到q这个查询参数对象中
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 删除
  $("tbody").on("click", ".btn-del", function () {
    var len = $(".btn-del").length;
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message);
          // 当数据删除完成后 需要判断当前这一页中 是否还有剩余
          // 如果没有剩余的数据了  则让页码值-1之后 再重新调用initTable()方法
          if (len === 1) {
            //如果len的值等于1  证明删除完毕之后 页面行就没有数据了
            //页码值最小为1
            q.pagenum === 1 ? q.pagenum : q.pagenum--;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
