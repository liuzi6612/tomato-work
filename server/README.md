<p align="center">
  <img src="https://raw.githubusercontent.com/liuzi6612/tomato-work/main/public/logo.svg" width="150" />
  <br />
  <b>Tomato Work 个人事务管理系统</b>
  <p align="center">
    <a href="https://github.com/liuzi6612/tomato-work"><img alt="Server" src="https://img.shields.io/static/v1.svg?label=&message=Client&style=flat-square&color=e8883a"></a>
    <img src="https://img.shields.io/github/license/liuzi6612/tomato-work-server" />
  </p>
</p>

## MySQL Setup

MySQL >= 8.0

- 创建数据库 `tomato_work`
- 运行根目录 `sql.sql`

## 环境变量

项目不自带 `.env.local` 和 `.env.production`, 需要自己 Copy `.env.development`

- `.env.development` 开发环境 `npm run start:dev`
- `.env.local` 开发环境 `npm run start`
- `.env.production` 生产环境 `npm run start:prod`

可以不使用文件环境变量，使用系统环境变量，已做兼容处理。

## Build Setup

启动项目之前请配置数据库信息 `.env.development`

```bash
# Download
git clone --depth=1 https://github.com/liuzi6612/tomato-work.git

cd server

# Install
pnpm i

# Port: 7003
npm run start:dev

# Build start
npm run start
```

## 部署

```bash
npm run build # 编译
npm run pm2 # 启动
```

## SQL迁移

```bash
$ npm run migration:generate -- migrations/sql

$ npm run migration:run
```

## License

[MIT](https://opensource.org/licenses/MIT)
