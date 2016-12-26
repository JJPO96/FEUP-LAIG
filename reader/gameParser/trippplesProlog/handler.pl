:- include('trippples.pl').

% testing
parse_input(ola, 'ok').


parse_input(board, X):- board(X).

parse_input(run, 'ok'):-
	run.
