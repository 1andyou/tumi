
// 登录功能
// 找到表单，注册submit事件 --> 阻止默认行为 --> 收集表单数据（查询字符串格式） --> Ajax提交


$('.login form').on('submit', function (e) {
    e.preventDefault();   //阻止刷新
    var data = $(this).serializeArray();   // 获取Content-Type 参数   详见 接口文档     // 得到一个数组，jQuery会把数组转成查询字符串
    $.ajax({
        url: 'http://www.itcbc.com:8080/api/login',    // 链接
        type: 'POST',                               // 上传
        data: data,                                   // data  里面的变量上面刚声明
        success: function (res) {                      //   传参 res 接收返回的数据
            console.log(res);                            
            layer.msg(res.message);                      // 不论成功还是失败  都提示一下
            if (res.status === 0) {                            
                localStorage.setItem('token', res.token);            // 上传成功  立马保存  token   类似于身份证
                location.href='./category.html'                       // 跳转页面
            }
        },
        error: function (xhr) {
            console.log(xhr);
            var res = xhr.responseJSON();
            if (res && res === 1) {
                layer.msg(res.message);
            }
        }
    })
})

