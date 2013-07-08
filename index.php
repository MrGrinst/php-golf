<?php 

include_once 'game.php';
session_start();

?>
<!DOCTYPE html>
<html>
<head>
	<title>Golf</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="functions.js"></script>
	<script type="text/javascript" src="welcome.js"></script>
	<script type="text/javascript"><?php include_once 'scriptVars.php'; ?></script>
</head>
<body>
<div class="game_alerts"></div>
<div class="container">
	<?php 
		if (isset($_SESSION['game'])) {
			include_once 'ongoingGame.php';
		}
		else {
			include_once 'newGame.php';
		}
	?>
</div>
</body>
</html>