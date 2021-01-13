

//统一配置  url headres complete 
var baseUrl = 'http://www.itcbc.com:8080';
$.ajaxPrefilter(function (option) {

    option.url = baseUrl + option.url;

    option.headers = {
        Authorization: localStorage.getItem('token')
    };

    
    option.complete = function (xhr) {
        var res = xhr.responseJSON;
        if (res && res.status === 1 && res.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }

  

});

// ------------------------------ 获取分类 ------------------------------
// 封装函数，获取所有的分类，并渲染到页面中
// 等后续的 删除、编辑、添加 操作之后，还要调用这个函数更新页面的数据
// - render -- 渲染
// - category -- 类别


 // 渲染
function renderCategory() {

    $.ajax({
        url: '/my/category/list',
        success: function (res) {      
            console.log(res);
            if (res.status === 0) {
                var str = template('tpl-list', res); //使用模板引擎渲染
                $('tbody').html(str);   // 数据渲染到tbody里面
                
            }
        }
            
    });
}


renderCategory();


// 删除 
$('tbody').on('click', '.del', function () {
    var id = $(this).data('id');
    layer.confirm('确定删除吗？',function(index){
        
        $.ajax({
            url: '/my/category/delete',
            data: { id: id },
            success: function (res) {
                // console.log(res);
                // 给出提示
                layer.msg(res.message);
                if (res.status === 0) {
                    renderCategory();
                }
            }
        });
        layer.close(index);
      });
})


// 增加
// 1. 点击添加类别，出现弹层
var addIndex;
$('button:contains("添加类别")').on('click', function () {
    addIndex = layer.open({
        type: 1,
        title: '添加类别',
        content: $('#tpl-add').html(),
        area: ['500px', '250px']
    });
})

// 2. 表单提交，完成添加
$('body').on('submit', '#add-form', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/category/add',
        data: $(this).serialize(),
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(addIndex);
            }
        }
    })
});

// 修改
var editIndex;

$('tbody').on('click', 'button:contains("编辑")', function () {
    var shuju = $(this).data(); // jQuery的data方法，不传递参数，表示获取全部的 data-xxx 属性值
    editIndex = layer.open({
        type: 1,
        title: '编辑类别',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px'],
        // 弹层后，调用下面的success函数
        success: function () {
            // 完成数据回填 （或者叫做为表单赋值）
            $('#edit-form input[name=name]').val(shuju.name);
            $('#edit-form input[name=alias]').val(shuju.alias);
            $('#edit-form input[name=id]').val(shuju.id);
        }
    });
})

// 3. 表单提交，完成修改
$('body').on('submit', '#edit-form', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/category/update',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(editIndex);
            }
        }
    });
})
