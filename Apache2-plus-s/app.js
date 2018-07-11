

// 开启http服务 引入http模块 
let http = require('http') ;
// 生成路径
let path = require('path') ;
// 引入fs文件系统
let fs = require('fs') ;
// 引入mime文件解析格式模块 
let mime = require('mime') ;
// 引入querystring url编码模块 
let querystring = require('querystring')
// 配置网站根目录 
let rootpath = path.join(__dirname,"www") ;
// console.log('根目录',rootpath);

// 开启http服务 
http.createServer((request,response)=>{
    console.log('请求来了');
    // 查看请求的文件(/) 所以需要字符串拼接
    // console.log(request.url);
    // 生成文件的绝对路径
    let filepath = path.join(rootpath,querystring.unescape(request.url)) ;
    // console.log(filepath);
    // 判断访问的文件是否存在 
    let isfile = fs.existsSync(filepath) ;
    // console.log(isfile);
    if(isfile){
        //只有文件存在才继续
        // 读取文件夹 
        fs.readdir(filepath,(err,files)=>{
            if(err){
                console.log(err);
                // readdir 读取文件夹 err错误 表示当前读取的不是文件夹而是文件 
                // console.log('不是文件夹');
                // 如果进到了这里说明不是文件夹是文件 是文件就读取文件 并返回文件
                fs.readFile(filepath,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        // 判断文件类型 设置相应的编码格式
                    //    if(filepath.indexOf('jpg')!=-1){
                    //        response.writeHead(200,{
                    //            'content-type':'image/jpeg'
                    //        })
                    //    }else if(filepath.indexOf('js')!=-1){
                    //        response.writeHead(200,{'content-type':'application/x-javascript'})
                    //    }
                    // 引入的文件模块自动解析1当前文件类型并生成对应的文件解析格式
                    // console.log(mime.getType(filepath));
                        response.writeHead(200, {
                            'content-type': mime.getType(filepath) 
                        })
                    }
                    
                    response.end(data)
                })
            }else{
                // console.log(files); 
                if(files.indexOf("index.html")!=-1){
                    console.log('有首页');
                    // 有首页直接读取首页
                    fs.readFile(path.join(filepath,"index.html"),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.end(data) ;
                        }
                    })
                }else{
                    // let 声明的变量会分割作用域 (作用域在当前的大括号内)
                    let fileArr ="" ;
                    // for循环遍历文件列表 
                    for (let i = 0; i < files.length; i++) {
                        // 访问二级目录中的文件
                        fileArr+=`<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`;
                        // 模板使用的引号与普通引号不同
                        
                    }
                    response.writeHead(200,{'content-type':'text/html;charset=utf-8'})
                    response.end(fileArr);
                }

                // 设置编码格式 
                
            }
        })

    }else{
        // 不存在 返回状态码 并结束响应 
        response.writeHead(404,{'content-type':'text/html;charset:utf-8'}) ;
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.hththt was not found on this server.</p>
        </body></html>
        `)
    }
    // response.end('you come') ;
}).listen(88,'127.0.0.1',()=>{
    console.log('开启服务');
})