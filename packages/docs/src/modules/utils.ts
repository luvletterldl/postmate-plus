export function markMsg(msg: string) {
  return msg.replace('business', () => '<font color="red">business</font>').replace('game', () => '<font color="blue">game</font>').replace('server', () => '<font color="green">server</font>')
}
