const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const babelTypes = require("@babel/types");
const babelGenerator = require("@babel/generator").default;

const getModuleRelativePath = (root, modulePath) =>
    `./${path.relative(root, modulePath)}`;

/** 默认配置 */
const defaultConfig = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
    },
};

/** 合并后的配置对象 */
const config = { ...defaultConfig, ...require("../webpack.config.js") };

class Compiler {
    constructor(config) {
        this.config = config;
        this.entry = config.entry;
        this.root = process.cwd();
        this.modules = {};
        this.tempalte = "";
    }

    /**
     *
     * @param {string} modulePath 模块绝对路径
     * @param {boolean} isEntryModule 是否是入口模块
     */
    buildModule(modulePath, isEntryModule) {
        /** 模块相对路径 */
        const moduleRelativePath = getModuleRelativePath(this.root, modulePath);
        //
        if (this.modules[moduleRelativePath]) return;
        // 一定要使用utf8格式, 不然 @babel/parse 解析会报错
        const source = this.getSouuce(modulePath);

        // 设置入口文件的相对路径
        if (isEntryModule) this.entryId = moduleRelativePath;

        const fatherPath = path.dirname(moduleRelativePath);

        const { sourceCode, dependecies } = this.parse(source, fatherPath);

        this.modules[moduleRelativePath] = sourceCode;

        dependecies.forEach((dep) =>
            this.buildModule(path.join(this.root, dep), false)
        );
    }
    parse(source, parentPath) {
        const dependecies = [];
        const AST = babelParser.parse(source, {
            sourceType: "module",
        });
        const getModuleRelativePath = (modulePath) =>
            `./${path.join(parentPath, modulePath)}`;

        //TODO: import() 异步加载如何处理, es module 怎么处理
        babelTraverse(AST, {
            // ImportDeclaration: ({node}) => {
            //     const modulePath = getModuleRelativePath(node.source.value)
            //     dependecies.push(modulePath)

            //     node.source.value = modulePath
            // },
            CallExpression: ({ node }) => {
                if (node.callee.name !== "require") return;
                const modulePath = getModuleRelativePath(node.arguments[0].value);
                dependecies.push(modulePath);
                node.arguments = [babelTypes.stringLiteral(modulePath)];
            },
        });

        const sourceCode = `function(require, module, exports) {${babelGenerator(AST).code}}`;
        return {
            sourceCode,
            dependecies,
        };
    }
    /** 根据路径获取文件内容 */
    getSouuce(modulePath) {
        return fs.readFileSync(modulePath, "utf8");
    }
    emitFile() {
        const { path: p, filename } = this.config.output;
        // 打包后的路径
        const main = path.join(p, filename);

        const result = `(function(modules) {
            const moduleCaches = {}
            function require(id) {
                const cacheModule = moduleCaches[id]
                if(cacheModule) return cacheModule.exports
                
                const module = moduleCaches[id] = {
                    exports: {},
                    moduleId: id
                }
                modules[id](require, module, module.exports)
                return module.exports
            }
            require('${getModuleRelativePath(this.root, this.config.entry)}')
        })({${Object.keys(this.modules).map(module => `'${module}': ${this.modules[module]}`)}})`;

        fs.writeFileSync(main, result);
    }
    /** 1 模块的依赖关系收集, 2 将文件打包到指定的文件夹 */
    run() {
        this.buildModule(path.resolve(__dirname, this.entry), true);
        this.emitFile();
    }
}

class Compiltation { }

const c = new Compiler(config);
c.run();
