$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  //获取文章分类列表
  function initArtCateList() {
    $.ajax({
      type: "get",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  //给添加类别按钮绑定事件
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      title: "添加文章分类",
      content: $("#dialog-add").html(),
      type: 1,
      area: ["500px", "250px"],
    });

    //通过代理的方式 为form-add表单绑定事件
    $("body").on("submit", "#form-add", function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          initArtCateList();
          layer.msg(res.message);
          layer.close(indexAdd);
        },
      });
    });
  });

  //用代理的形式 为编辑按钮绑定事件
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
      type: 1,
      area: ["500px", "250px"],
    });
    var id = $(this).attr("data-id");
    $.ajax({
      type: "get",
      url: "/my/article/cates/" + id,

      success: function (res) {
        console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的方式 为form-edit表单绑定事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        initArtCateList();
        layer.msg(res.message);
        layer.close(indexEdit);
      },
    });
  });

  //用代理的形式 为删除按钮绑定事件
  $("tbody").on("click", ".btn-del", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除文章分类信息?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        type: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          initArtCateList();
          layer.msg(res.message);
        },
      });

      layer.close(index);
    });
  });
});
