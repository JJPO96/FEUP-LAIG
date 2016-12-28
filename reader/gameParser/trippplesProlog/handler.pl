:- include('trippples.pl').

% Runs application
parse_input(run, 'ok'):-
	run.

% Creates a new board
parse_input(newboard, FinalBoard):-
	resetPlayersPosition,
	defaultBoard(T),
	generateBoard(1, T, 5, Board),
	setBlankCells(-1, Board, FinalBoard),
	retract(startingBoard(_)),
  	assert(startingBoard(FinalBoard)).

% Return the board of the game
parse_input(board, X):- startingBoard(X).

% Returns players position
parse_input(Player, [Line, Col]):-
	player(Player, Line, Col, _, _).

% Updates player position
parse_input(updatePlayer(Player, Line, Col), [Line, Col]):-
	updatePlayer(Player, Line, Col).

% Generates computer first move in game. Computer is always player 1
parse_input(compFirstMove(Player, Mode), [Line, Col]):-
	startingBoard(T),
	computerFirstMove(Mode, T, Player),
	player(Player, Line, Col, _, _).


% Moves computer
parse_input(moveComp(2, 1, 2), [Line, Col]):-
	startingBoard(T),
	movePlayer(T, 2, 1, 2),
	player(2, Line, Col, _, _).

parse_input(moveComp(2, 1, 3), [Line, Col]):-
	startingBoard(T),
	movePlayer(T, 2, 1, 3),
	player(2, Line, Col, _, _).

parse_input(moveComp(P1, P2, 4), [Line, Col]):-
	startingBoard(T),
	movePlayer(T, P1, P2, 4),
	player(P1, Line, Col, _, _).

% Verifies is the game can to an end
% 0 - Not finished
% 1 - Player 1 wins
% 2 - Player 2 wins
% 3 - Tie
parse_input(gameover(_, _), Success):-
	gameOver(Winner), !,
	Success is Winner.

parse_input(gameover(P1, P2), Success):-
	startingBoard(T),
	isGameTied(T, P1, P2), !,
	Success is 3.

parse_input(gameover(_, _), Success):-
	Success is 0.

% Verifies if a player can move
parse_input(canmove(player1, player2), Success):-
	startingBoard(T),
	canMove(T, player1, player2), !,
	Success is 1.

parse_input(canmove(_, _), Success):-
	Success is 0.


