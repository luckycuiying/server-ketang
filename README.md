# server-ketang

### mongodb操作
* 启动服务
```shell
brew services start mongodb/brew/mongodb-community
#或
mongod --config /usr/local/etc/mongod.conf
```
* 连接服务器
```shell
mongo
```
* 查询表
```sql
show collections
```
* 创建数据库
```sql
use 数据库名
```
* 查询
```sql
 db.users.find(ObjectId("5e9bf9550a9d1650e8ce64ed")).pretty()
```