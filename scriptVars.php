<?php
	if (isset($_SESSION['game'])) {
		echo 'var midAction = "'.$_SESSION['game']->midAction.'";';
		echo 'var gameError = "'.$_SESSION['game']->error.'";';
		echo 'var turn = "'.$_SESSION['game']->turn.'";';
		$playerNameTurn = $_SESSION['game']->playerNameTurn();
		echo 'var playerNameTurn = "'.$playerNameTurn.'";';
	}
?>