<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/guess_the_song" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=guess_the_song" ;
$project = new project_object("guess_the_song", "Guess the song", "https://github.com/aidansean/guess_the_song", "http://aidansean.com/projects/?tag=guess_the_song", "guess_the_song/images/project.jpg", "guess_the_song/images/project_bw.jpg", "This project is a fun game where the user had to guess the song by guessing the lyrics, hangman style, with whole words instead of letters.", "Games", "AJAX,cookies,HTML,JavaScript,MySQL,PHP") ;
?>