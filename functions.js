/*
The variables passed by PHP are as follows
midAction 		<- used to determine if the user is midway through the action of flipping a draw pile card and deciding what to do with it
gameError 		<- used to determine if any PHP-determined errors in-game have occured i.e. If the user tries to cheat by writing their own javascript
turn 	  		<- the number of the user whose turn it currently is
playerNameTurn  <- the name of the user whose turn it currently is

The code immediately below stops errors when the variables haven't been created yet
*/

if (typeof midAction === 'undefined') {
	var midAction = null;
}
if (typeof gameError === 'undefined') {
	var gameError = null;
}
if (typeof turn === 'undefined') {
	var turn = null;
}
if (typeof playerNameTurn === 'undefined') {
	var playerNameTurn = null;
}

var compareCard;
var playerNumber;
var cardNumber;


function gameAlert(alertMessage, color) {
	$('.game_alerts').html('');
	$('.game_alerts').append(alertMessage);
	$('.game_alerts').addClass(color);
}

function gameAction(action, playerNum, cardNum) {
	if (typeof playerNum === 'undefined' || turn == playerNum) {
		$.ajax({
			type: 'POST',
			url: 'index.php',
			data: { action: action, playerNum: playerNum, cardNum: cardNum },
			success: function() {
				location.reload();
				return;
			},
			error: function() {
				alert('There has been an internal error.');
			}
		});
	}
	else {
		setClickable('reset');
		$('.game_alerts').addClass('red');
		return 'Sorry but it is '+playerNameTurn+"'s turn. Wait for your turn.";
	}
}

function fadeError() {
	$('.game_alerts').fadeTo('slow', 0.01, function() {
		$(this).removeClass('red');
		$(this).css('opacity', '1');
		gameAlert('');
	});
}

function cardIsClicked(card) {
	noCardsClicked();
	card.addClass('clicked');
}

function noCardsClicked() {
	$('.card').removeClass('clicked');
}

function setClickable(status) {
	$('html').find('.clickable').removeClass('.clickable');
	
	var $playerDrawDiscard = $('.card').not('.player .card').add('.player:eq('+turn+') .card');
	var $clickableCards = $('.card').off('click');

	switch (status) {
		case 'reset':
			$clickableCards = $playerDrawDiscard.not('.player .showing').addClass('clickable');
			$clickableCards.click(function() {
				cardSwitch($(this));
			});
			break;
		case 'flipPlayerCard':
			$clickableCards = $playerDrawDiscard.not('.player .showing');
			$clickableCards.addClass('clickable');
			return $clickableCards;
			break;
		case 'discardPile':
			$clickableCards = $playerDrawDiscard;
			$clickableCards.addClass('clickable');
			return $clickableCards;
			break;
		case 'drawPile':
			$clickableCards = $playerDrawDiscard.not('.draw_pile .card');
			$clickableCards.addClass('clickable');
			return $clickableCards;
			break;
	}
}

function flipPlayerCard(card) {
	gameAlert('Click the card again if you would like to flip it.');
	cardIsClicked(card);
	$clickableCards = setClickable('flipPlayerCard');
	$clickableCards.click(function() {
		if ($(this).hasClass('clicked')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAction('flipPlayerCard', playerNumber, cardNumber);
		}
		else {
			gameAlert('');
			noCardsClicked();
			setClickable('reset');
		}
	});
}

function flipDrawPileCard() {
	gameAction('flipDrawPileCard');
}

function takeActionWithDrawPileCard() {
	gameAlert('Click one of your cards to swap, or discard by clicking on the discard pile.');
	$('.draw_pile .card').addClass('clicked');
	$clickable = setClickable('drawPile');
	$clickable.click(function() {
		if ($(this).parent().parent().hasClass('player')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAction('takeDrawPileCard', playerNumber, cardNumber);
		}
		else if ($(this).parent().parent().hasClass('discard_pile')) {
			gameAction('discardDrawnCard');
		}
	});
}

function takeDiscardPileCard() {
	gameAlert('Click the card you would like to swap out.');
	$('.discard_pile .card').addClass('clicked');
	$clickable = setClickable('discardPile');
	$clickable.click(function() {
		if ($(this).parent().parent().hasClass('player')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAction('takeDiscardPileCard', playerNumber, cardNumber);
		}
		else {
			gameAlert('');
			noCardsClicked();
			setClickable('reset');
		}
	});
}

function cardSwitch(clickedCard) {
	var type = clickedCard.parent().parent().attr('class');
	switch (type) {
		case 'player':
			flipPlayerCard(clickedCard);
			break;
		case 'discard_pile':
			takeDiscardPileCard();
			break;
		case 'draw_pile':
			flipDrawPileCard();
			break;
	}
}

$(document).ready(function() {
	if (gameError != '' && gameError != null) {
		gameAlert(gameError, 'red');
		fadeError();
	}
	if (midAction) {
		takeActionWithDrawPileCard();
	}
	else {
		setClickable('reset');
	}
});





