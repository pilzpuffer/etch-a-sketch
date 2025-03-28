# etch-a-sketch
Current Roadmap to project finalization - as note to myself:
1) <s>Complete the page navigation for when there are more than 6 options available</s> - ALL DONE!
1.5) Minor bug - if page navigation already exists for the ACT menu, it will show up on the main page of the items menu as well (and it will lead to the second page of ACT items). If go into marker box - page navigation updates properly, and applies for item navigation. I need to figure out how to hide that second page button when items are just opened. I've tried to create separte divs for items (like, dedicate Page 1 div to just act, and set up a separate div for items, and tied all events to it) - but that didn't resolve this issue. 
2) Work on "rate" endgame logic -> biggest task at the moment
3) Add text for flirt/perform routes
4) Add death screen for the end of the insult route
5) Add flavor/Mett text for disabling animations
6) Work on "fight" action to allow changing the size of the canvas - another big task
7) <s>Convert all animations to use RequestAnimationFrame() method for better efficiency, as the amount of setIntervals is a bit heavy on game's functionality</s> - Done!
8) <s>Add title to the load screen</s> - DONE!
9) Work on scaling for lower screen resolutions
10) Work on the intro sequence for this game - Mett text, some flavor text, maybe more sounds might be needed

Project notes:

Initially, I've planned to add keyboard navigation as an option as well to better imitate Undertale's style of gameplay, but decided that logic required to implement that is a bit beyond me for the moment. This project got a out of scope of the initial task requirements - and while things I've learned during its completion were really informative, I wanted to complete it for now to be able to proceed with the course.

But in the future I plan to revisit this project and add that functionality. 


Acknowledgements/Thank-Yous:

I'm greatly thankful to my girlfriend for giving me feedback/valuable hints on how the visuals/functionality of this project could be improved. 

@https://undertale-resources.tumblr.com - this Tumblr blog was a wonderful resource for the necessary Undertale-related trivia - I wouldn't be able to locate some of the needed sounds effects without them. 

Determination/MonsterFriend2 fonts in this project come from @UkiyoMoji Fonts - https://www.behance.net/JapanYoshi
Mercy font comes from MaxiGamer - https://twitter.com/MaxiGamerART
Pixelated font comes from Auntie Pixelante (? I couldn't locate author's current nickname/active profiles anywhere)
DotumChe Pixel is made by William Costello - https://fontstruct.com/fontstructors/1389119/fab-william1729


all music/sound effects used within this project are made by Toby Fox and come from his game "Undertale" - if you haven't played it before, I highly recommend checking it out - https://store.steampowered.com/app/391540/Undertale/