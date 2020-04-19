# server-ketang

### mongodb操作
* 启动服务
```shell
brew services start mongodb/brew/mongodb-community
mongod --config /usr/local/etc/mongod.conf
```
* 连续服务器
```shell
mongo
```
* 创建数据库
```sql
use 数据库名
```
* 查询数据库中表
```sql
show collections
```