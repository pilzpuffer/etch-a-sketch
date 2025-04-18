# etch-a-sketch
Current Roadmap to project finalization - as note to myself:
1) <s>Complete the page navigation for when there are more than 6 options available</s> - ALL DONE!
2) Work on "rate" endgame logic -> biggest task at the moment
     1) Create rate function
     2) Compose relevant text
     3) Make animation for mini-Metts/logic for how their scores show up
     4) Create ending
3) Add text for flirt/perform routes
4) Add death screen for the end of the insult route
5) Add flavor/Mett text for disabling animations
6) <s>Work on "fight" action to allow changing the size of the canvas - another big task</s> - DONE!
     1) - add some flavor/mett text for "fight" action as well 
7) <s>Convert all animations to use RequestAnimationFrame() method for better efficiency, as the amount of setIntervals is a bit heavy on game's functionality</s> - Done!
8) <s>Add title to the load screen</s> - DONE!
9) Work on scaling for different/smaller screen resolutions
10) Work on the intro sequence for this game - Mett text, some flavor text, maybe more sounds might be needed

Project notes:
This concept really inspired me to try to make a cohesive mini-game - and while this REALLY goes beyond the initial task requirements, I'm glad that I've decided to undertake this in the end. This taught me a few valuable things on how to work on "bigger" projects. The biggest mistake of this project was how much time initially I've spent working on CSS, it was basically the first thing I've started to work on in this project. While yes, I did need to search for specific fonts and such to get the needed "aesthetic", I had to considerably rework a lot of styling down the way as the project grew. So now I'll know not to do that in the future x)

There were a few ideas I've scrapped down the way:
1) I wanted to add keyboard controls, just like in the Undertale itself - but I wasn't sure how to properly implement this. In the end, I've decided that it'll be best to make all controls pointer-based - as the main focus here should be drawing. IF this project also had "bullet hell" fight sequences, then yes, it would make sense to add keyboard controls - but there's little sense in adding that for a purely drawing/talking game
2) I wanted to create a heart shattering animation for the end of the Insult route - but I've already used external help for figuring out the petal logic in the Flirt route, so adding another animation like that didn't seem quite fair - so I've decided against that (and I'm not proficient enough in JS animations to truly work on that by myself)
3) I thought about adding an option for player to reply (similiar to how occasionally player in Undertale can select one of the 2 replies in certain battle sequences), but decided against that - as that would only additionally complicate the "rate" logic, and replying mechanic wouldn't be used anywhere else in this game - all interaction is done by player ACTing instead.


Acknowledgements/Thank-Yous:

I'm greatly thankful to my girlfriend for giving me feedback/valuable hints on how the visuals/functionality of this project could be improved. 

@https://undertale-resources.tumblr.com - this Tumblr blog was a wonderful resource for the necessary Undertale-related trivia - I wouldn't be able to locate some of the needed sounds effects without them. 

Determination/MonsterFriend2 fonts in this project come from @UkiyoMoji Fonts - https://www.behance.net/JapanYoshi
Mercy font comes from MaxiGamer - https://twitter.com/MaxiGamerART
Pixelated font comes from Auntie Pixelante (? I couldn't locate author's current nickname/active profiles anywhere)
DotumChe Pixel is made by William Costello - https://fontstruct.com/fontstructors/1389119/fab-william1729


all music/sound effects used within this project are made by Toby Fox and come from his game "Undertale" - if you haven't played it before, I highly recommend checking it out - https://store.steampowered.com/app/391540/Undertale/

The Fight menu slider was made by Clar @Clar1nettist (https://www.pixilart.com/art/undertale-fight-slider-fa94b6712500d0c)