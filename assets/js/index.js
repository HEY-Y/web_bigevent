$(function () {
  // 调用getUserInfo函数  获取用户基本信息
  getUserInfo();

  //点击按钮 实现推出功能
  $("#btnLogout").on("click", function () {
    //弹出提示消息框
    layui.layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (index) {
      //清空本地存储中的token
      localStorage.removeItem("token");
      //重新跳转到登录页面
      location.href = "login.html";
      //关闭confirm询问框
      layui.layer.close(index);
    });
  });
});

//获取用户基本信息
function getUserInfo() {
  $.ajax({
    type: "get",
    url: "/my/userinfo",
    //headers 就是请求头配置对象
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      renderAvatar(res.data);
    },
    // 无论成功还是失败，最终都会调用这个函数
    // complete: function (res) {
    //   //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     //强制清空token
    //     localStorage.removeItem("token");
    //     //强制跳转到登录页面
    //     location.href = "login.html";
    //   }
    // },
  });
}

//渲染用户头像
function renderAvatar(user) {
  //获取用户名称
  var name = user.nickname || user.username;
  $("#welcome").html("欢迎&nbsp&nbsp" + name);

  //按需渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
