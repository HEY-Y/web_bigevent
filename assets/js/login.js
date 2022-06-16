$(function () {
  //点击‘去注册账号’事件
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  //点击‘去登录’事件
  $("#link_login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  // 自定义规则
  //从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  //通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义一个叫做pwd校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //校验两次密码是否一致
    repwd: function (value) {
      //通过形参拿到的是确认密码框中的内容
      //还需要拿到密码框中的内容
      //然后进行一次等于的判断
      //如果判断失败则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });

  //监听注册表单的提交事件
  $("#form-reg").on("submit", function (e) {
    //阻止默认行为
    e.preventDefault();
    //发起ajax请求
    var data = {
      username: $("#form-reg [name=username]").val().trim(),
      password: $("#form-reg [name=password]").val().trim(),
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg(res.message);
      // 模拟点击行为
      $("#link_login").click();
    });
  });

  // 监听登录表单的提交事件
  $("#form-login").on("submit", function (e) {
    e.preventDefault();
    var data = {
      username: $("#form-login [name=username]").val().trim(),
      password: $("#form-login [name=password]").val().trim(),
    };
    $.post("/api/login", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg(res.message);
      //将登录成功得到的token字符串，保存到localStorage中
      localStorage.setItem("token", res.token);
      //跳转到后台主页
      location.href = "index.html";
    });
  });
});
