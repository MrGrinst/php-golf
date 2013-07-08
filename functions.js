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

var $compareCard;
var playerNumber;
var cardNumber;


function gameAlert(alertMessage) {
	$('.game_alerts').html('');
	$('.game_alerts').append(alertMessage);
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
		resetBinds();
		$('.game_alerts').addClass('red');
		return 'Sorry but it is '+playerNameTurn+"'s turn. Wait for your turn.";
	}
}

function resetBinds() {
	$('body').off('click', '.card') ;
	$('body').on('click', '.card', function() {
		cardSwitch($(this));
	});
}

function fadeError() {
	$('.game_alerts').fadeTo('slow', 0.1, function() {
		$(this).removeClass('red');
		$(this).css('opacity', '1');
		gameAlert('');
	});
}

function resetClickableClass() {
	$('html').find('.clickable').removeClass('.clickable');
}

function setClickableClass(status) {
	if (typeof status === 'undefined') {
		resetClickableClass();
		$('.player').eq(turn).find('.card.hidden').addClass('clickable');
		$('.draw_pile').children().children().addClass('clickable');
		$('.discard_pile').children().children().addClass('clickable');
	}
	switch (status) {
		case 'userCardsEnabled':
			$('.player').eq(turn).find('.card').addClass('clickable');
			break;
	}
}

function flipPlayerCard($card) {
	gameAlert('Click the card again if you would like to flip it.');
	$compareCard = $card;
	$('body').on('click', '.card', function() {
		if ($compareCard.attr('id') == $(this).attr('id')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAlert(gameAction('flipPlayerCard', playerNumber, cardNumber));
			fadeError();
		}
		else {
			gameAlert('');
			resetBinds();
		}
	});
}

function flipDrawPileCard() {
	gameAlert('Click the draw pile again to confirm you wish to use this card.');
	$('body').on('click', '.card', function() {
		if ($(this).parent().parent().hasClass('draw_pile')) {
			gameAction('flipDrawPileCard');
		}
		else {
			gameAlert('');
			resetBinds();
		}
	});
}

function takeActionWithDrawPileCard() {
	gameAlert('Click one of your cards to swap, or discard by clicking on the discard pile.');
	$('body').on('click', '.card', function() {
		if ($(this).parent().parent().hasClass('player')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAlert(gameAction('takeDrawPileCard', playerNumber, cardNumber));
			$('.game_alerts').fadeTo('slow', 0.1, function() {
				$(this).removeClass('red');
				$(this).css('opacity', '1');
				takeActionWithDrawPileCard();
			});
		}
		else if ($(this).parent().parent().hasClass('discard_pile')) {
			gameAction('discardDrawnCard');
		}
		else if ($(this).parent().parent().hasClass('draw_pile')) {
			$('body').off('click', '.card');
			takeActionWithDrawPileCard();
		}
		else {
			gameAlert('');
			resetBinds();
		}
	});
}

function takeDiscardPileCard() {
	gameAlert('Click the card you would like to swap out.');
	$('body').on('click', '.card', function() {
		if ($(this).parent().parent().hasClass('player')) {
			playerNumber = $(this).parent().parent().index();
			cardNumber = $(this).index();
			gameAlert(gameAction('takeDiscardPileCard', playerNumber, cardNumber));
			fadeError();
		}
		else {
			gameAlert('');
			resetBinds();
		}
	});
}

function cardSwitch($this) {
	$('body').off('click', '.card');
	var type = $this.parent().parent().attr('class');
	switch (type) {
		case 'player':
			flipPlayerCard($this);
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
		alert(gameError);
	}
	if (midAction) {
		takeActionWithDrawPileCard();
	}
	else {
		$('body').on('click', '.card', function() {
			cardSwitch($(this));
		});
	}
	setClickableClass();
});





