import { lottery } from 'lucky-numbers'
import actions from './actions.js'
import net from 'net'

const emulateChanges = (connection) => {
  const id = lottery(100, 30, 1, 8)[0]
  console.log(id);
  const timeout = lottery(100, 100, 1, 8)[0] * 100
  const action = actions[id - 1]

  action.value1 = lottery(100, 100, 0, 8)[0]
  connection.write(JSON.stringify({
    event: 'listactions',
    data: [action]
  }))
  connection.write('\r')

  setTimeout(() => {
    emulateChanges(connection)
  }, timeout)
}

net.createServer(function (connection) {
  connection.on('data', function (buffer) {
    let data = buffer.toString();
        try {
          data = JSON.parse(data)
          console.log(data);
          if (data.cmd) {
            if (data.cmd === 'listactions') {
              connection.write(JSON.stringify({data: actions}))
              connection.write('\r')
            } else if (data.cmd === 'startevents')  {
              emulateChanges(connection)
            } else {
              const action = actions[data.id - 1]
console.log({action});
              action.value1 = data.value1
              if (Number(action.id) === 4) {
                const startvalue = Number(action.value1)
                const targetValue = Number(data.value1 > 100 ? 100 : data.value)
                let position
                let up = true
                if (startvalue > targetValue) {
                  up = false
                  position = startvalue - targetValue
                } else {
                  position = targetValue - startvalue
                }
                let current = startvalue - position
                const emulateCover = () => {
                  if (up) {
                    action.value1 = startvalue + position
                  } else {
                    action.value1 = startvalue - position
                  }
                  connection.write(JSON.stringify({
                    event: 'listactions',
                    data: [action]
                  }))
                  setTimeout(() => {
                    position -= 1
                    if (up) {
                      action.value1 += 1
                    } else {
                      action.value1 -= 1
                    }
                    if (position !== 0) emulateCover()
                    
                  }, 100)
                }
                emulateCover()
              }
              else {
                connection.write(JSON.stringify({
                  event: 'listactions',
                  data: [action]
                }))
              }
              // action.value1 = Math.round(data.data.value1)
              // console.log(JSON.stringify({
              //   event: 'listactions',
              //   data: [action]
              // }));
             
              connection.write('\r')
              
            }
          }
        } catch (error) {
          console.log(error);
        }
    // }
  });
}).listen(8000);