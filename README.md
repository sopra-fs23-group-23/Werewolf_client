# Werewolves

The popular game werewolves now becomes digital. In this social deduction game, different fractions (werewolves, villagers etc.) try to seize control of the village through an interactive voting system. During the night the werewolves awake and kill one of the sleeping unknowing villagers. Furthermore hidden magical creatures like the witch, cupid or seer act in their secrative manner. During the day the villagers try to free their town by again voting who's the most suspicious and killing them.

An integrated voicechat allows the crucial discussions during the voting phases to take place.

## Technologies

Frontend:
- Node.js
- React as javascript framework
- HTML, SCSS

Backend:
- Gradle
- Java
- REST Interface
- SonarQube (rather used externally? delete if unnecessary)
- H2 in-memory db

Agora (Agora.io) is used for the voicechat

## High-level components and Illustrations

- In the [agora.js](src/helpers/agora.js) file, the voice chat functionality is handled. By joining a Lobby, the user joins the lobby's group call.To do this, the user's microphone is turned on after entering the Lobby, and the user's local audio stream is published to the Agora platform.The user also receives the external audio stream of the lobby mates to hear them.

- In the [Game.hook.js](src/hooks/Game.hooks.js) file, information about the current Game and Poll is fetched for use in the Game.js component.Since the planned SSE (Server Sent Events) approach did not work out, we rely on sending GET requests in an interval.The fetched JSON data from the backend is then translated into Game and Poll objects.

- In the [Game.js](src/components/views/Game.js) component, the game and poll data from the Game.hook.js is used to display the relevant view to the user, as well as providing controls for muting, etc.If the game has ended, an endscreen shows the winning party and allows the players to leave the game.If the game is still ongoing, the poll object is checked to see if the user takes part in the poll and therefore displays the Stage. If the player is not part of the Poll, a waiting screen is shown.

- In the [Stage.js](src/components/ui/game/Stage.js) component, the poll is displayed to the participating user. Depending on the active role, two different kinds of subcomponents are shown. In the MultiOption component users can be clicked on to vote for them. In Display Components (Hitlist.js, CupidMatch.js), the currently casted votes are displayed to indicate the likely outcome of the poll. 

- The [MultiOption.js](src/components/ui/game/selection/MultiOption.js) component is displayed to render the Profiles of the players that can be voted for. If only one player participates in the vote (Witch, Hunter, Seer, etc.), the player that is voted for is additionally highlighted. 

- The [Hitlist.js](src/components/ui/game/display/Hitlist.js) component renders above the selection component and displays the profile of the users that received the most votes. The player(s) that received the most votes (hitlist leader) is displayed larger and in the center since that player is likely to be killed when the poll ends.

## Launch & Deployment

Make sure you have Node.js installed on your machine before continuing. To install the needed dependencies (React, Agora etc.) run:

```npm install```

After installing the dependencies, the app can be started with

```npm run dev```

The application can now be viewed in the browser (http://localhost:3000). Port may be different, depending on already running applications.

The application can be build for production to the build folder by running:

`npm run build` 

## Roadmap

The application was built in a modular approach to easily allow extending it.
The following features are not yet implemented but could improve the Game play:

### 1. Additional roles

Implementing further roles could make the Game more interesting. E.g.

- Wolf cub
- Jester
- "Blinzelmädchen" /-"bübchen"
- Vampire
- Guard
- Prostitute ("Dirne")

Also see https://werwolf.fandom.com/de/wiki/Werwolf-Rollen-Sammlung for further roles.

### 2. User Statistics

Storing Game Statistics for every user would provide interesting insights into the abilities of each user. The following benchmarks could be interesting:

- How many Games has a user played / won ?
- How often has the user played which role ? How often did the user win in those roles?
- In which day-night cycle was the user usually killed 


### 3. Lobby Join System

Currently users are only able to play a game, if they have a group of friends that are currently online and exchange the join lobby code. To allow users to play the game with strangers it would make sense to develop an open lobby listing feature, where users can view and select from available lobbies. This can be implemented by providing a user interface that displays the open lobbies along with relevant details such as lobby name, number of players, and game settings. Players can then select a lobby from the list and join directly.

Additionally users that are in a lobby should be able to invite users (by their username or similar) to join the game.


## Authors and acknowledgment

The application was developed for the SOPRA 23 course by:

- Jan Lüthi ([@Dev-Lj](https://github.com/Dev-Lj))
- Michel Sabbatini ([@Atomis14](https://github.com/Atomis14))
- Marvin Wiedenkeller ([@ChlineSaurus](https://github.com/ChlineSaurus))
- Miro Vannini ([@mirovv](https://github.com/mirovv))
- David Scherrer ([@djscherrer](https://github.com/djscherrer))


We would like to thank the following people for their contributions during the project:
- Jerome Maier, for his support as our TA.
- Milo Ranft, for the many drawings of the roles and landscapes.

## Contributing

We welcome contributions to enhance and improve the Werewolves game. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit them.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository.

We appreciate your contributions and will review your pull request as soon as possible.

## License

This project is licensed under the GNU GPLv3 License - see the [LICENSE.md](License.md) file for details
