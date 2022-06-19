$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在1-6个字符之间";
      }
    },
  });
  initUserInfo();
  //初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: "get",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        form.val("formUserInfo", res.data);
      },
    });
  }

  //重置表单数据
  $("#btnReset").on("click", function (e) {
    // 阻止表单默认事件
    e.preventDefault();
    initUserInfo();
  });
  //提交表单数据
  $(".layui-form").on("submit", function (e) {
    // 阻止默认行为
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/userinfo",
      data: data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新失败");
        }
        layer.msg(res.message);
        console.log(res);
        //调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      },
    });
  });
});
