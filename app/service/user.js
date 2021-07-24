// app/service/user.js
const Service = require('egg').Service;

const Database = require('better-sqlite3');
const db = new Database('db.db', { verbose: console.log });

class UserService extends Service {

  async all() {
    let user = [];
    // let name = decodeURIComponent(ctx.query.name)
    // name = name==null ? '推荐' : name.replace(new RegExp("\'|\’|\‘|\“|\”|\"|;|>|<|%","gm"),"");
    const sql = `select id, t1.name  ,min(times) times,t1.all_times,record_time from card t1 LEFT JOIN 
                (select name ,max(all_times) all_times from card  GROUP BY name ) t2
                WHERE t1.name = t2.name and t1.all_times = t2.all_times  GROUP BY t1.name
                ORDER BY record_time desc LIMIT 20 OFFSET 0`;
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    user = JSON.stringify(rows);
    return user;
  }
  async items(name) {
    let user = [];
    const sql = 'SELECT id,name,times,all_times,record_time from card  where name = ? ORDER BY record_time DESC';
    const stmt = db.prepare(sql);
    const rows = stmt.all(name);
    user = JSON.stringify(rows);
    return user;
  }

  async find(name) {
    let user = [];
    const sql = `select id,name ,min(times) times,all_times,record_time from card 
                  where name = ?  and  all_times = (select max(all_times) from card  where name = ?)`;
    const stmt = db.prepare(sql);
    const rows = stmt.all(name, name);
    if (rows[0].name == null) return user;
    user = JSON.stringify(rows);
    return user;
  }

  async add(name) {
    const sql = 'INSERT INTO card ("name",  "times", "all_times") VALUES (?, 10, 1)';
    const stmt = db.prepare(sql);
    const row = stmt.run(name);
    return row.changes;
  }
  async update(name) {
    const sql = `insert into card  
                  select null,name, times+10 times ,all_times+1 all_times  ,datetime('now','localtime') record_time from card
                  where id = (select max(id) from card where name = ?)`;
    const stmt = db.prepare(sql);
    const row = stmt.run(name);
    return row.changes;
  }
  async cost(name) {
    const sql = `insert into card 
                  select null,name, times-1  times,all_times,datetime('now','localtime') record_time from card 
                  where id = (select max(id) from card where name = ?)`;
    const stmt = db.prepare(sql);
    const row = stmt.run(name);
    return row.changes;
  }
}

module.exports = UserService;
