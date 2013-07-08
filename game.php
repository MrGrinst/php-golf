<?php

class Game {
	var $draw = array();
	var $cards = array('A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K');
	var	$suits = array(array('hearts', '&#9829;'), array('spades', '&#9824;'), array('clubs', '&#9827;'), array('diamonds', '&#9830;'));
	var $players = array();
	var $discard = array();
	var $turn;
	var $error;
	
	function __construct($numOfPlayers) {
		for ($i = 0; $i < $numOfPlayers; $i++) {
			$this->players[] = array('name' => $_POST['name'][$i], 'hand' => array());
		}
	}

	function showing($card) {
		$card[1] = "showing";
		return $card;
	}

	function newDeck() {
		foreach ($this->suits as $suit) {
			foreach ($this->cards as $card) {
				$this->draw[] = array($card.",".$suit[0], 'hidden');
			} 
		}
		shuffle($this->draw);
	}

	function nextTurn() {
		if (isset($this->turn)) {
			if ($this->turn < count($this->players)-1) {
				$this->turn++;
			}
			else {
				$this->turn = 0;
			}
		}
		else {
			$this->turn = 0;
		}
	}

	function playerNameTurn() {
		return $this->players[$this->turn]['name'];
	}

	function deal() {
		for ($i = 0; $i < 6; $i++) {
			for ($z = 0; $z < count($this->players); $z++) {
				$card = array_pop($this->draw);
				$this->players[$z]['hand'][] = $card;
				//$this->players[$z]['hand'][] = array($card, 'showing');
			}
		}
		$firstDiscard = array_pop($this->draw);
		$firstDiscard = $this->showing($firstDiscard);
		$this->discard[] = $firstDiscard;
		$this->nextTurn();
	}

	function matchSuitSymbol($suitName) {
		foreach ($this->suits as $suit) {
			if ($suit[0] == $suitName) {
				return $suit[1];
			}
		}
	}

	function printCard($card) {
		$value = '';
		$suit = '';
		$symbol = '';
		$randomNum = md5(rand(1,1000)*rand(1,1000));

		if ($card[1] != 'hidden') {
			list($value, $suit) = preg_split('/,/', $card[0]);
			$symbol = $this->matchSuitSymbol($suit);
		}
		echo "<div id='".$randomNum."' class='card ".$card[1]." ".$suit."'>".$value."&nbsp;".$symbol."</div>";
	}

	function printDrawPile() {
		$count = count($this->draw);
		if ($count > 0) {
			$this->printCard($this->draw[$count-1]);
		}
		else {
			?>
				<div class="card showing draw_empty">Draw pile is empty</div>
			<?php
		}
	}

	function printDiscardPile() {
		$count = count($this->discard) - 1;
		$this->printCard($this->discard[$count]);
	}

	function flipPlayerCard($playerNum, $cardNum) {
		if ($playerNum == $this->turn) {
			$this->players[$playerNum]['hand'][$cardNum][1] = 'showing';
			$_SESSION['game']->nextTurn();
		}
		else {
			$this->error = "It's not your turn! It is ".$this->playerNameTurn()."'s turn.";
		}
	}

	function flipDrawPileCard() {
		$count = count($this->draw);
		$this->draw[$count-1][1] = "showing";
		$this->midAction = true;
	}

	function takeDrawPileCard($playerNum, $cardNum) {
		if ($playerNum == $this->turn) {
			$drawPileCard = array_pop($this->draw);
			$drawPileCard = $this->showing($drawPileCard);

			$cardFromHand = $this->players[$playerNum]['hand'][$cardNum];
			$cardFromHand = $this->showing($cardFromHand);

			$this->players[$playerNum]['hand'][$cardNum] = $drawPileCard;

			$this->discard[] = $cardFromHand;
			$this->nextTurn();
			$this->midAction = false;
		}
		else {
			$this->error = "It's not your turn! It is ".$this->playerNameTurn()."'s turn.";
		}
	}

	function takeDiscardPileCard($playerNum, $cardNum) {
		if ($playerNum == $this->turn) {
			$discardPileCard = array_pop($this->discard);

			$cardFromHand = $this->players[$playerNum]['hand'][$cardNum];
			$cardFromHand = $this->showing($cardFromHand);

			$this->players[$playerNum]['hand'][$cardNum] = $discardPileCard;

			$this->discard[] = $cardFromHand;
			$this->nextTurn();
		}
		else {
			$this->error = "It's not your turn! It is ".$this->playerNameTurn()."'s turn.";
		}
	}

	function discardDrawnCard() {
		$drawnCard = array_pop($this->draw);
		$this->discard[] = $drawnCard;
		$this->nextTurn();
		$this->midAction = false;
	}

	function printGameState() {
		?>
		<div class="turn"><?php echo "It is ".$_SESSION['game']->playerNameTurn()."'s turn."; ?></div>
		<div class="allPlayers">
			<?php
			foreach ($this->players as $player) {
				?>
				<div class="player">
					<div class="player_name"><?php echo $player['name']; ?></div>
					<div class="allCards">
						<?php 
							foreach ($player['hand'] as $card) {
								$this->printCard($card);
							}
						 ?>
					 </div>
				</div>
				<?php
			}
			?>
		</div>
		<div class="draw_pile">
			<div class="allCards">
				<?php 
					$this->printDrawPile();
				?>
			</div>
		</div>
		<div class="discard_pile">
			<div class="allCards">
				<?php 
					$this->printDiscardPile();
				?>
			</div>
		</div>
		<?php
	}
}

?>