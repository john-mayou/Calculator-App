# Project Name

Server Side Calculator

## Description

Looking at the instruction for this project, I ended up expanding on the stretch mode. I wanted to end up solving for the order of operations including parentheses and exponents. Also having nice UX was a priority to give the user a seamless experience.

The way I went about solving for order of operations was first validating the input. The way I went about that was testing the string against numerous regex's (there are comments next to the regex). I also used a stack structure to validate that there were matching parentheses.

After validating, I used a recursive function that first checked for parentheses and keeped calling inself until there were no parentheses left. The base case for the function would then solve using a while loop to keep finding the highest order of operations, then cutting the adjacent numbers out and evaluating.

There are some limitations to the regex's that I used including: -- Doesnt allow mutiplication through parens 2(3) -- Doesnt allow decimals without 0 before them .1234 -- Cant evaluate negative numbers as the input is invalid if two operators are next to each other 3\*-1

<img width="994" alt="ServerSideCalculator" src="https://user-images.githubusercontent.com/109235738/215362497-c6151a2a-e980-46ea-936b-abccf3683c9f.png">

screenshot located @ ServerSideCalculator.png
