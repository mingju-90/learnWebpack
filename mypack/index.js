
const path = require('path')
const fs = require('fs')

/** 默认配置 */
const defaultConfig = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    }
}

/** 合并后的配置对象 */
const config = {...defaultConfig, ...require('../webpack.config.js')}

class Compiler {
    constructor(config) {
        this.config = config
        this.entry = config.entry
        this.root = process.cwd()
        this.modules = {}
        this.tempalte = ''
    }
    
    /**
     * 
     * @param {string} modulePath 模块绝对路径
     * @param {boolean} isEntryModule 是否是入口模块
     */
    buildModul(modulePath, isEntryModule) {
        // 一定要使用utf8格式, 不然 @babel/parse 解析会报错
        const source = this.getSouuce(modulePath)

        /** 模块相对路径 */
        const moduleRelativePath = `./${path.relative(this.root, modulePath)}`

        // 设置入口文件的相对路径
        if(isEntryModule) this.entryId = moduleRelativePath

        const fatherPath = path.dirname(moduleRelativePath)
        console.log(source)
    }
    getSouuce() {
        return fs.readFileSync(modulePath, {encoding: 'utf-8'})
    }
    emitFile() {}
    /** 1 模块的依赖关系收集, 2 将文件打包到指定的文件夹 */
    run() {
        this.buildModul(path.resolve(__dirname, this.entry), true)
    }
}

class Compiltation {}

const c = new Compiler(config)
c.run()