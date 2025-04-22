# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Echoes of Greybridge

An interactive mystery experience where you play as a digital archivist investigating the mysterious disappearance of an entire town's population.

## Project Description

*Echoes of Greybridge* is an interactive narrative game set in a deserted town where all residents vanished overnight. You play as a digital archivist tasked with piecing together what happened by examining various documents, images, and recordings left behind. The deeper you dig, the stranger things become...

## Features

- **Interactive Book Interface**: Navigate through the mystery with a realistic book-style interface featuring page-turning animations
- **Evidence Collection**: Discover and document clues throughout the abandoned town
- **Branching Narrative**: Your choices affect the path of investigation
- **Dynamic Notes System**: Keep track of your discoveries with an in-game note-taking feature
- **Atmospheric Effects**: Experience eerie glitches and static as you uncover supernatural elements

## File Structure

```
ECHOES_OF_GREYBRIDGE/
├── images/         # Game imagery and visual assets
├── sounds/         # Audio effects and ambient sounds
└── src/
    ├── html/       # HTML files
    │   └── index.html
    ├── js/         # JavaScript files
    │   ├── game-data.js
    │   └── game.js
    └── styles/     # CSS stylesheets
        └── styles.css
```

## Required Assets

### Images
The game requires the following images to function properly:
- town-overview.jpg
- police-station.jpg
- newspaper-office.jpg
- town-hall.jpg
- computer-screen.jpg
- cover-texture.jpg
- dust.png
- stains.png
- static.png
- magnify.svg
- notes.svg
- evidence.svg

### Sounds
The following sound effects are needed:
- page-turn.mp3
- static.mp3
- ambient.mp3
- click.mp3

## Setup and Usage

1. Clone or download this repository
2. Open `src/html/index.html` in a modern web browser
3. Click on the book cover to begin the experience
4. Navigate through the story by making choices and turning pages

## Controls

- **Click** on evidence markers to collect clues
- Use the **magnifying glass** to examine images more closely
- **Highlight** text by clicking on certain phrases
- Access your **notes** using the notepad icon
- Use the **Previous/Next** buttons to navigate between previously visited pages

## Debug Mode

The game includes a debug panel accessible by clicking "Debug" in the bottom left corner. This can be helpful for development and testing but should be removed in a production version.

## Credits

Created as a generative AI project combining:
- Interactive narrative design
- Web development
- UI/UX design
- AI-generated content

## License

This project is released under the MIT license.

---

*The town is gone. The silence is speaking. You just have to listen.*

