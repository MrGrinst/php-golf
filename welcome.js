function playerNames(num) {
	$('.playerNames').html('');
	for (i = 1; i <= num; i++) {
		$('.playerNames').append('Player '+i+' name: <input type="text" name="name[]" />\n');
	}
}

$(document).ready(function() {
	playerNames(2);
	
	$('#setup select').change(function() {
		numOfPlayers = $(this).val();
		playerNames(numOfPlayers);
	});
});