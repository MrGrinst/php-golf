<?php


$_SESSION['game']->error = "";


if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'flipPlayerCard':
			$_SESSION['game']->flipPlayerCard($_POST['playerNum'], $_POST['cardNum']);
			break;
		case 'takeDiscardPileCard':
			$_SESSION['game']->takeDiscardPileCard($_POST['playerNum'], $_POST['cardNum']);
			break;
		case 'flipDrawPileCard':
			$_SESSION['game']->flipDrawPileCard();
			break;
		case 'takeDrawPileCard':
			$_SESSION['game']->takeDrawPileCard($_POST['playerNum'], $_POST['cardNum']);
			break;
		case 'discardDrawnCard':
			$_SESSION['game']->discardDrawnCard();
			break;
	}
}
$_SESSION['game']->printGameState();

echo "Draw Pile: ".count($_SESSION['game']->draw)."<br />";
echo "Discard Pile: ".count($_SESSION['game']->discard);

?>