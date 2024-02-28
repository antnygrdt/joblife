import React from 'react';

const Game = ({ match, game, index }) => {

    const winnerId = game.winner_id;
    const key = game.status === "running" ? "En cours" : game.status === "finished" ? "Gagnant" : "À venir";
    const value = match.team1.id === winnerId ? match.team1.name : match.team2.id === winnerId ? match.team2.name : "-";

    const length = Object.entries(match.games).length;
    const headerRadius = length !== 1 && index !== 0 ? 0 : 12;
    const gameRadius = (length !== 1 && index === length - 1) || length === 1 ? 10 : 0;

    function getFormattedTime(timeInSeconds) {
        var sec = timeInSeconds % 60;
        var min = Math.floor(timeInSeconds / 60) % 60;
        var hour = Math.floor(timeInSeconds / 3600);

        var hourStr = hour > 0 ? hour + "h" : "";
        var minuteStr = min.toString().length <= 1 ? "0" + min : "" + min;
        var secondStr = sec.toString().length <= 1 ? "0" + sec : "" + sec;

        return hourStr + minuteStr + "m" + secondStr + "s";
    }

    return (
        <div className='game-card'>
            <div className='game-header' style={{ 'borderRadius': `${headerRadius}px ${headerRadius}px 0px 0px` }}>
                <p>{'Partie n°' + (index + 1)}</p>
                <p>{game.status === "finished" ? getFormattedTime(game.length) : ""}</p>
            </div>
            <div className='game' style={{ 'borderRadius': `0px 0px ${gameRadius}px ${gameRadius}px` }}>
                <p>{key}</p>
                <p>{value.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default Game;