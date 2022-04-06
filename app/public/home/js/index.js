const hostname = location.origin;
const req = axios.create({
  // baseURL: 'http://192.168.43.16:7001',
  baseURL: hostname,
});

var getData = async (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      req.get(url).then(res => {			// url:http://127.0.0.1:80/api
        resolve(res.data);
      }).catch(err => {
        console.error(err);
      });
    }, 0);
  });
};


function goAdd() {
  const name = $('input[type=search]')[0].value;
  if (name.length == 0) return false;
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.length != 0 && name == user[0].name) {
    goUpdate(name);
    return false;
  }
  $.alert({
    title: '  ',
    content: '  是否确认添加会员卡记录?',
    animation: 'scale',
    closeAnimation: 'bottom',
    backgroundDismiss: true,
    buttons: {
      ok: {
        text: '  ok  ',
        btnClass: 'btn-blue',
        action() {
          add(name);
        },
      },
    },
  });
}
async function add(name) {
  const row = await this.getData(`add/${name}`);
  if (row > 0) {
    find(name);
    tip('OK, 操作成功！');
  }
}

$('#focus').keypress(function(event) {
  if (event.which === 13) {
    // 点击回车要执行的事件
    find();
  }
});

async function find(name) {
  name = name || $('input[type=search]')[0].value;
  if (name.length == 0) {
    all();
  } else {
    const user = await this.getData(`find/${name}`);
    localStorage.setItem('user', JSON.stringify(user));
    $('.results').empty();
    if (user.length != 0) {
      render(user);
    } else {
      $('.results').append('<h3 id="inform">— 暂无记录 请点击+添加(10次/卡). —</h3>');
    }
  }
}

function goUpdate(name) {
  $.alert({
    title: '  ',
    content: '  确认续卡？剩余次数将会累加。',
    animation: 'scale',
    closeAnimation: 'bottom',
    backgroundDismiss: true,
    buttons: {
      ok: {
        text: '  ok  ',
        btnClass: 'btn-blue',
        action() {
          update(name);
        },
      },
    },
  });
}

async function update(name) {
  const row = await this.getData(`update/${name}`);
  if (row > 0) {
    find(name);
    tip('OK, 操作成功！');
  }
}

function goCost(name) {
  $.alert({
    title: '  ',
    content: '  确认消费？剩余次数将-1。',
    animation: 'scale',
    closeAnimation: 'bottom',
    backgroundDismiss: true,
    buttons: {
      ok: {
        text: '  ok  ',
        btnClass: 'btn-blue',
        action() {
          cost(name);
        },
      },
    },
  });
}

async function cost(name) {
  const row = await this.getData(`cost/${name}`);
  if (row > 0) {
    find(name);
    tip('OK, 操作成功！');
  }
}

function render(user) {
  $('.results').empty();
  let html = '';
  user.forEach(item => {
    let button = '';
    if (item.times > 0) {
      button = `<button  class="shinydarken enable" onclick="goCost('${item.name}')">消费</button>`;
    } else {
      button = '<button  disabled  class="shinydarken disabled">消费</button>';
    }
    html += `<div class="card">
              <div class="items" onclick="showItems('${item.name}')">${item.name}</div>
              <cite>剩余次数:  <span class="times">${item.times}</span></cite><br>
              <cite>办卡次数:  <span class="all_times">${item.all_times}</span></cite><br>
              <cite>上次消费时间:</cite><br>
              <cite><span class="record_time">${item.record_time}</span></cite><br>
              <cite>
                <button class="shiny" onclick="goUpdate('${item.name}',this)">续卡</button>
                ${button}
              </cite>
            </div>`;
    // <button  disabled class="shinydarken" onclick="cost(${item.id})">消费</button>
  });
  $('.results').append(html);
}

async function showItems(name) {
  $.dialog({
    title: '消费记录详情',
    content: `url:${hostname}/items/${name}`,
    animation: 'scale',
    columnClass: 'medium',
    closeAnimation: 'scale',
    backgroundDismiss: true,
  });
}

async function all() {
  const user = await this.getData('all');
  $('#inform').empty();
  render(user);
}

function tip(text) {
  $('.bounceInDown').html(text).fadeIn(500).delay(2000).slideUp(500);
}

all();

