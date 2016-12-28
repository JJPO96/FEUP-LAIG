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
parse_input(updatePlayer(Player, Line, Col), Success):-
	updatePlayer(Player, Line, Col),
	Success is 1.

% Resets board and players position
parse_input(resetgame, Success):-
	resetPlayersPosition,
	defaultBoard(NewBoard),
	retract(startingBoard(_)),
	assert(startingBoard(NewBoard)),
	Success is 1.
