
/**
 * @summary:
 *   socket事件类： 处理游戏事件
 * @description:
 */

import utils from 'base_utils';
import gameEvents from './game';
import playerEvents from './player';
import brickEvents from './brick';
import bossEvents from './boss';


export default class SocketEvent {
  /**
   * @param gamers 其他玩家
   */
  constructor(room, socket) {
    const self = this;
    self.socket = socket;
    self.gamers = {};
    self.kills = {};  // 击杀统计
    self.room = room;
    self.roomEvents = {
      connect: gameEvents.onSocketConnected,
      reconnect_failed: gameEvents.onSocketDisconnect,
      'join room': gameEvents.onJoinRoom,
      'remove player': gameEvents.onLeaveRoom,
      'loading progress': gameEvents.onLoadingProgress,
      matching: gameEvents.onMatching,
      'start game': gameEvents.onStartGame,
    };
    self.gameEvents = {
      disconnect: gameEvents.onSocketDisconnect,
      connect_error: gameEvents.onSocketDisconnect,
      'new player': playerEvents.onNewPlayer,
      'move player': playerEvents.onMovePlayer,
      'remove player': playerEvents.onRemovePlayer,
      'kill player': playerEvents.onKillPlayer,
      'kill brick': brickEvents.onKillBrick,
      'kill boss': bossEvents.onKillBoss,
      shot: playerEvents.onShot,
    };
    Object.keys(self.roomEvents).forEach((event) => {
      self.socket.on(event, self.roomEvents[event].bind(self));
    });
    return self;
  }

  gamerById(id, silence = false) {
    const self = this;
    const gamer = self.gamers[utils.clientId(id)];
    if (gamer) {
      return gamer;
    }
    if (!silence) {
      console.log('Player not found: ', id);
    }
    return false;
  }
}
