# etch-a-sketch
Roadmap to project finalization - as note to myself:
1) <s>Complete the page navigation for when there are more than 6 options available</s> - ALL DONE!
2) Work on "rate" endgame logic -> biggest task at the moment
     1) Create rate function
          1) <s>Make up the 'skeleton' of function</s>
               1) <s>Logic for color rating</s>
               2) <s>Logic for density rating</s>
               3) <s>Logic for manners rating - addition/deduction of points needs to be set within route progression/item interactions and etc - and then it should all be summarized within the rate function. so need to work on route progression first</s>
               4) <s>Need to add an interaction for a rose item (with changes to mannersScore)</s>
               5) <s>Add an interaction for requesting a rating with an empty canvas (if menu was opened while drawing was present, drawing was erased, and rate function was called)</s>
          2) Compose the 'final' rate function
               1) Logic for how Mett's rating phrases show up
               2) Logic/structure for how "mini-judges'" ratings show up and disappear
               3) Logic for final score declaration and endgame
     2) Compose relevant text for rating
     3) Make animation for mini-Metts
     4) Create ending sequence
3) Add text for flirt/perform routes
     1) Add text for the flirt route
     2) <s>Add alt text/block progression if the insult route went too far (stage 4 - mett will disregard player's attempts to flirt/perform, and both functions will be removed after that - so need just one set of phrases for that, if insult is at stage 3 or less - alt phrases need to be utilized for both perform and flirt routes (without separate sets for drawn/empty state))</s>
     3) <s>Add alt text to insult route if flirt route was in the "too much" phase - point deductions will be bigger in this case so that user will lose what was gained for those routes</s>
     4) Add alternative ending sequence if user "lost" the flirt route (if they go through it while earning negative points (either for submitting blanks or endlessly throwing sticks - so if they're being annoying) or if they don't draw at least something first) - in this case, the user will see a tv static screen with credits rolling down - with various TV-related jobs and Mettaton's name next to them - and some sitcom-like music should play then
          1) <s>Add flavor/mett lines</s>
          2) <s>Add logic for flirt ending</s>
          3) Set up a screen with "static" effect (will be used for the end of the Insult route as well)
          4) Add music + scrolling effect for ending text for this route
4) Add death screen for the end of the insult route - use a TV static effect for this, like the TV show was cut short (as it happens in that route)
5) <s>Add flavor/Mett text for disabling animations</s> - DONE! 
6) <s>Work on "fight" action to allow changing the size of the canvas - another big task</s> - DONE!
     1) add some flavor/mett text for "fight" action as well 
     2) on canvas-related actions - also add text for "mercy" action when used to erase the entire canvas (endgame will be handled through rate so that i won't have to make post-rating text for other actions)
7) <s>Convert all animations to use RequestAnimationFrame() method for better efficiency, as the amount of setIntervals is a bit heavy on game's functionality</s> - Done!
8) <s>Add title to the load screen</s> - DONE!
9) Work on scaling for different/smaller screen resolutions - another intensive task
10) Work on the intro sequence for this game - Mett text, some flavor text, maybe more sounds might be needed
11) <s>Rework the "stick" function, add text</s> - DONE!

Debugging Roadmap:
1) check why hideAndShow doesn't work for properly for motion actions now.
2) check line 1601\2395, insult progression - the lines don't show up as they should (in case if Mettaton was already flirted with). basically, currently there's an issue with insult progression and its interaction with other functions - it works fine by itself, start to finish

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