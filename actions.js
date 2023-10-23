import lucky from 'lucky-numbers'

const actions = []

for (let i = 1; i <= 28; i++) {
  actions.push({
    name: 'test',
    type: 2,
    id: i,
    value1: lucky.lottery(100, 101, 0, 8)[0]
  })
}

actions.push({
  name: 'test',
  type: 1,
  id: 29,
  value1: 0
})

actions.push({
  name: 'test',
  type: 4,
  id: 30,
  value1: 0
})
export default actions