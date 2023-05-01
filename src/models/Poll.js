import Player from './Player';

class Poll {
  constructor(data = {}) {
    this.role = "";
    this.question = "";
    this.participants = [];
    this.pollOptions = [];
    this.scheduledFinish = null;
    Object.assign(this, data);
    if (data.scheduledFinish) {
      this.scheduledFinish = new Date(data.scheduledFinish);
    }

  }

  setVoteArray(pollOptions) {
    const sortedPollOptions = pollOptions.filter(option => option.supporters.length > 0)
                                          .sort((a, b) => b.supporters.length - a.supporters.length);
    const voteArray = sortedPollOptions.map(option => {
      const supporterArray = option.supporters.map(supporter => supporter.id);
      return [new Player(option.player), supporterArray];
    });
    this.voteArray = voteArray;
  }

  setOwnVote(pollOptions, userId) {
    for (const option of pollOptions) {
      for (const supporter of option.supporters) {
        if (supporter.id === userId) {
          this.ownVote = new Player(option.player);
          return;
        }
      }
    }
    this.ownVote = null;
  }

  printPoll(){
    console.log("Poll: ", this);
  }
}

export default Poll;
