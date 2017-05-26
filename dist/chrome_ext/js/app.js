var listBoardgames = require('list-boardgames');
var $ = require("jquery");
var rivets = require("rivets");

var dataModel = {
    form: {},
    games: {},
    goToGame: (ev, view) => chrome.tabs.create({ url: getGameUrl(view.game) })
};
dataModel.fetchGames = 
    () => listBoardgames(dataModel.form.username, parseInt(dataModel.form.nrOfPlayers))
        .then(result => dataModel.games = result);

rivets.bind($('body'), dataModel);
rivets.formatters.gameTitle = 
    game => game.name + (game.requiresExp ? ` + ${game.expansions.filter(exp => exp.required).map(exp => exp.name)}` : '');

function getGameUrl(game) {
    return `https://boardgamegeek.com/boardgame/${game.$.id}`;
}
