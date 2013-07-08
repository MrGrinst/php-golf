var $compareCard;

function gameAlert(alertMessage) {
	$('.game_alerts').html('');
	$('.game_alerts').append(alertMessage);
}

function gameAction(action, playerNumber, cardNumber) {
	$.ajax({
		type: 'POST',
		url: 'index.php',
		data: { action: action, playerNum: playerNumber, cardNum: cardNumber },
		success: function() {
			location.reload();
		},
		error: function() {
			alert('There has been an internal error.');
		}
	});
}

function resetBinds() {
	$('body').off('click', '.card') ;
	$('body').on('click', '.card', function() {
		cardSwitch($(this));
	});
}

function setClickableClass() {
	$('html').find('.clickable').removeClass('.clickable');
	$('.hidden').addClass('clickable');
	$('.draw_pile').children().addClass('clickable');
	$('.discard_pile').children().addClass('clickable');
}

function flipPlayerCard($card) {
	gameAlert('Click the card again if you would like to flip it.');
	$compareCard = $card;
	id = $card.attr('id');
	$('body').on('click', '.card', function() {
		if ($compareCard.attr('id') == $(this).attr('id')) {
			var playerNumber = $(this).parent().index();
			var cardNumber = $(this).index();
			if (turn == playerNumber-1) {
				gameAction('flipPlayerCard', playerNumber, cardNumber);
			}
			else {
				gameAlert('Sorry but it is '+playerNameTurn+"'s turn. Wait for your turn.");
				resetBinds();
			}
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
		if ($(this).parent().hasClass('draw_pile')) {
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
		if ($(this).parent().hasClass('player')) {
			var playerNumber = $(this).parent().index();
			var cardNumber = $(this).index();
			gameAction('takeDrawPileCard', playerNumber, cardNumber);
		}
		else if ($(this).parent().hasClass('discard_pile')) {
			gameAction('discardDrawnCard');
		}
		else if ($(this).parent().hasClass('draw_pile')) {
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
		if ($(this).parent().hasClass('player')) {
			var playerNumber = $(this).parent().index();
			var cardNumber = $(this).index();
			gameAction('takeDiscardPileCard', playerNumber, cardNumber);
		}
		else {
			gameAlert('');
			resetBinds();
		}
	});
}

function cardSwitch($this) {
	$('body').off('click', '.card');
	var type = $this.parent().attr('class');
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
	if (typeof gameError !== 'undefined' && gameError != '') {
		alert(gameError);
	}
	if (typeof midAction !== 'undefined' && midAction) {
		takeActionWithDrawPileCard();
	}
	else {
		$('body').on('click', '.card', function() {
			cardSwitch($(this));
		});
	}
	setClickableClass();
});





