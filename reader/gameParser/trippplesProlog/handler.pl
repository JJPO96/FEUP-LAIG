:- include('trippples.pl').

% Runs application
parse_input(run, 'ok'):-
	run.

% Returna the board of the game
parse_input(board, X):- board(X).

parse_input(1, [Line, Col]):-
	player(1, Line, Col, _, _).

parse_input(2, [Line, Col]):-
	player(2, Line, Col, _, _).