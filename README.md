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

## High-level components

- Game

- Poll

- Lobby

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

- Jan Lüthy
- Michel Sabbatini
- Marvin Wiedenkeller
- Miro Vannini
- David Scherrer

A special thank you to our TA Jerome Maier for supporting us during the project.

## Contributing

We welcome contributions to enhance and improve the Werewolves game. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit them.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository.

We appreciate your contributions and will review your pull request as soon as possible.

## License

The application is free-to-use for private usage and open for contribution.
Selling the application or using it for commercial purposes without proper authorization is prohibited.
