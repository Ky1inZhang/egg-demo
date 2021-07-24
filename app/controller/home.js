'use strict';

const Controller = require('egg').Controller;

const fs = require('fs'); // node.js 的文件模块 fs
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '<script >location.href= \'/public/home/index.html#\'</script >';
  }
  async all() {
    const { ctx } = this;
    // const userId = ctx.params.id;
    const userInfo = await ctx.service.user.all();
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/json');
    ctx.body = userInfo;
  }

  async find() {
    const { ctx } = this;
    const name = ctx.params.name;
    const userInfo = await ctx.service.user.find(name);
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/json');
    ctx.body = userInfo;
  }
  async add() {
    const { ctx } = this;
    const name = ctx.params.name;
    const row = await ctx.service.user.add(name);
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/json');
    ctx.body = row;
  }
  async update() {
    const { ctx } = this;
    const name = ctx.params.name;
    const row = await ctx.service.user.update(name);
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/json');
    ctx.body = row;
  }
  async cost() {
    const { ctx } = this;
    const name = ctx.params.name;
    const row = await ctx.service.user.cost(name);
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/json');
    ctx.body = row;
  }

  async items() {
    const { ctx } = this;
    const name = ctx.params.name;
    const userInfo = await ctx.service.user.items(name);
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
    ctx.set('Content-Type', 'application/html');
    let html = '';
    const users = JSON.parse(userInfo);
    users.forEach(item => {
      html += `<tr>
                  <td>${item.name}</td>
                  <td>${item.times}</td>
                  <td>${item.all_times}</td>
                  <td>${item.record_time}</td>
                </tr>`;
    });
    ctx.body = `<table class="table table-bordered table-condensed table-striped">
                  <tr>
                    <th>姓名</th>
                    <th>剩余次数</th>
                    <th>办卡次数</th>
                    <th>消费时间</th>
                  </tr>
                  ${html}
                </table>`;
  }
}

module.exports = HomeController;
