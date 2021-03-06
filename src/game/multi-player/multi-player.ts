import { TextChannel, User } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { getPlayerFingersDM } from '../../util/get-player-fingers';
import { Match, Players } from '../match/match';

import { selectOpponent } from './select-opponent';
import { startMatch } from './start-match';

export class MultiPlayerMatch extends Match {
  private selectOpponent = selectOpponent;
  protected startMatch = startMatch;

  constructor(
    client: DiscordClient,
    stadium: TextChannel,
    challenger: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);

    this.selectOpponent();
  }

  inningsOver() {
    this.opponent.send(`Innings over, see score board in <#${this.stadium.id}>`);
    this.challenger.send(`Innings over, see score board in <#${this.stadium.id}>`);

    super.inningsOver();
  }

  /**
   * @param batsman Which player is the batsman
   * @param batsmanPlayed Number of fingers
   * @param bowlerPlayed Number of fingers
   */
  calculateRoundResult(
    batsmanPlayed: number,
    bowlerPlayed: number
  ) {
    const batsman = (
      this.opener === Players.CHALLENGER && this.numInnings === 0 ||
      this.opener === Players.OPPONENT && this.numInnings === 1
    ) ? this.challenger : this.opponent;

    const bowler = batsman === this.challenger ? this.opponent : this.challenger;

    batsman.send(`${bowlerPlayed}!`); // randomize
    bowler.send(`${batsmanPlayed}!`); // randomize

    if (batsmanPlayed !== bowlerPlayed) {
      if (batsmanPlayed === 6) {
        const randomSixComment = this.getRandomComment(this.COMMENT_CATEGORIES.SIX);
        bowler.send(randomSixComment);
        batsman.send(randomSixComment);
      }
      else if (batsmanPlayed === 4) {
        const randomBoundaryComment = this.getRandomComment(this.COMMENT_CATEGORIES.BOUNDARY);
        bowler.send(randomBoundaryComment);
        batsman.send(randomBoundaryComment);
      }
    }
    else {
      const outComment = this.getRandomComment(this.COMMENT_CATEGORIES.OUT);
      batsman.send(outComment);
      bowler.send(outComment);
    }

    super.calculateRoundResult(batsmanPlayed, bowlerPlayed);
  }

  async getChallengerFingers() {
    return getPlayerFingersDM(this.client, this.challenger, (handlerName) => this.associatedListeners.push(handlerName));
  }

  async getOpponentFingers() {
    return getPlayerFingersDM(this.client, this.opponent, (handlerName) => this.associatedListeners.push(handlerName));
  }
}
