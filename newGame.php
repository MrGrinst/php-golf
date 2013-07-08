<?php

include_once 'game.php';

if (!isset($_POST['numOfPlayers'])) {
	include_once 'welcome.php';
}

else {

	session_start();

	$_SESSION['game'] = new Game($_POST['numOfPlayers']);

	$_SESSION['game'] -> newDeck();
	$_SESSION['game'] -> deal();

	header('Location: index.php');

	exit();

}

?>