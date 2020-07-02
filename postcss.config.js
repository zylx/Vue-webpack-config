module.exports = {
    plugins: [
        require('autoprefixer')({
            //必须设置支持的浏览器才会自动添加添加浏览器兼容
            browsers: [
                "last 2 versions",
                "> 1%"
            ]
        })
    ]
}