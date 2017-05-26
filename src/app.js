var listBoardgames = require('./list-boardgames');

function getRequiredExpansionsText(game) {
    return game.requiresExp ? `+ ${game.expansions.filter(exp => exp.required).map(exp => exp.name)}` : '';
}

listBoardgames('kkowalski', 8)
    .then((games) => games.forEach(game => console.log(`${game.name}${getRequiredExpansionsText(game)}`)));