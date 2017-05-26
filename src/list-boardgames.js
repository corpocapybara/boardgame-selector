var request = require('request-promise');
var parseString = require('xml2js').parseString;

const apiHost = 'https://www.boardgamegeek.com/xmlapi2/';
const collectionResource = 'collection';
const thingsResource = 'thing';
const expansionType = 'boardgameexpansion';

function checkResponse(username, resolve, reject) {
    return response => 
        (response.statusCode === 202 && fetchCollection(username, resolve, reject)) ||
        (response.statusCode === 200 && response.body);
}

function mapResponseError(response, username) {
    throw `Fetching collection for ${username} failed`;
}

function parseXml(bodyXml) {
    return new Promise((resolve, reject) => 
        parseString(bodyXml, (err, json) => resolve(json))
    );
}

function fetchCollection(username, resolve, reject) {
    return request
        .get(`${apiHost}${collectionResource}?username=${username}`, { resolveWithFullResponse: true })
        .then(checkResponse(username, resolve, reject), response => mapResponseError(response, username))
        .then(parseXml);
}

function fetchGameDetails(games) {
    return request
        .get(`${apiHost}${thingsResource}?id=${Object.keys(games).join(',')}`)
        .then(parseXml)
        .then(result => result.items.item)
        .then(result => result.forEach(game => game.name = games[game.$.id]) || result);
}

function fetchCollectionGameDetails(collection) {
    var gameNameById = {};
    collection.items.item.forEach(item => gameNameById[item.$.objectid] = item.name[0]._);
    return fetchGameDetails(gameNameById);
}

function getExpansionCoreGamesIds(expansionItem) {
    return expansionItem.link
        .filter(link => link.$.type === expansionType && link.$.inbound === 'true')
        .map(link => link.$.id);
}

function findGameById(games, id) {
    return games.find(game => game.$.id === id);
}

function linkExpansions(items) {
    let games = items.filter(game => game.$.type === 'boardgame');

    items
        .filter(game => game.$.type === expansionType)
        .forEach(expansion => 
            getExpansionCoreGamesIds(expansion)
                .forEach(gameId =>
                    (game = findGameById(games, gameId)) && (game.expansions = (game.expansions || []).concat([expansion]))
                )
        );

    return games;
}

function filterByNrOfPlayers(nrOfPlayers) {
    let checkGame = game => game.minplayers.some(entry => entry.$.value <= nrOfPlayers) 
            && game.maxplayers.some(entry => entry.$.value >= nrOfPlayers);
    let filterExpansions = exp => checkGame(exp) && (exp.required = true)

    return (game) => checkGame(game) ||
        (game.expansions && game.expansions.filter(filterExpansions).length > 0 && (game.requiresExp = true));
}

function getGamesInCollection(username, nrOfPlayers, time) {
    return fetchCollection(username)
        .then(fetchCollectionGameDetails)
        .then(linkExpansions)
        .then((games) => games.filter(filterByNrOfPlayers(nrOfPlayers)))
        .catch(console.error);
}

module.exports = getGamesInCollection;
