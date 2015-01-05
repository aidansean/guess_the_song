from project_module import project_object, image_object, link_object, challenge_object

p = project_object('guess_the_song', 'Guess the song')
p.domain = 'http://www.aidansean.com/'
p.path = 'guess_the_song'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.github_repo_name = 'guess_the_song'
p.mathjax = False
p.links.append(link_object(p.domain, 'guess_the_song/', 'Live page'))
p.introduction = 'This project is a fun game where the user had to guess the song by guessing the lyrics, hangman style, with whole words instead of letters.'
p.overview = '''The script loads a song randomly and displays blank spaces for the lyrics on the screen.  The user then enters guesses and the script checks for matches, keeping track of which words have already been suggested by the user.  The score depends on the total number of guesses, the time, and whether the user chooses the hard or easy mode.'''

p.challenges.append(challenge_object('The lyrics must be hidden from the user.', 'Initally the lyrics were "whited out", but some users simply highlighted the lyrics to cheat.  To prevent this the lyrics were replaced with underlined monospaced blank characters. ', 'Resolved'))

p.challenges.append(challenge_object('The users should be able to collect achievements, to encourage subsequent visits.', 'I don\'t usually pester my users to come back a second time, but with this game it seemed natural to do so.  User\'s gain achievements for various actiosn which are then stored via AJAX to the MySQL backend, building on previous knowledge of these methods.  The achievements are then highlighted by changing the CSS of HTML elements.  The user id is store in a cookie, and can be recovered by copying and pasting a uri.', 'Resolved'))

p.challenges.append(challenge_object('The users interface should be as intuitive as possible.', 'As usual the user interface is a significant stumbling block, and what is obvious to the designer si not obvious to the user.  After some iterating with friends the user interface was adapted based on their feedback, and now the game starts with the correct element on focus so that the user can start guessing immediately.', 'Resolved'))

