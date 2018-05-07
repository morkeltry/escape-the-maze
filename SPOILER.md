## Solution:

Any maze of size *m* x *n* can be broken down into concentric rings, except where *m=1* or *n=1*.
```
1111111111 
1222222221 
1233333321
1234444321
1234554321
1234554321
1234444321
1233333321
1222222221
1111111111

```
#### Where *m=1* or *n=1* :
The puzzle is trivial, since any arrow which points inside the maze will, once followed and then rotated 90 degrees, will then point out of the maze.

#### Where *m>1* and *n>1* :
Any position will have a depth, which we will define as its distance from the edge. *d=1* means the player is on the edge of the maze and will win if their player points outwards. *d=0* means the player has escaped.
In following any arrow, *d* will either increase, decrease or remain the same.
For a given location, two possible arrow directions will maintain *d* the same. The other two arrows will decrease *d* with probabiliy *P>=0.5* since, on corners, 2 possible arrow directions decrease *d* and none increase *d*.
Given that we have inifite steps in which to win, and assuming that arrow directions are random, we have a gambler's ruin problem where probability *P* of the gambler winning is *P>0.5*, ie the gambler is a bookie.

However, the arrows may be arranged non-randomly to keep the player in the maze. Is there any configuration which acheives this?

#### Where *m=2* or *n=2* :
Similarly to the trivial case, an *m=2* or *n=2* grid cannot contain the player indefinitely, since each arrow, and therefore all the arrows which must be traversed indefinitely, will eventually reach a state which points out of the grid.

#### Generally :
Any ring which is to be indefinitely traversed also is made entirely of arrows which, in some possible state which must be reached if the grid is traversed indefinitely, will decrease *d*.
It may be the case that the outer ring then reached is fiendishly designed to send the player back in (eventually increase *d*), however this inner ring (and any further inner rings) must eventually spit the player back out. If any fiendish design for the outer ring exists, it cannot persist past its first traversal.
Could there exist some reciprocal system so that the traversal of the fiendish design triggers a new fiendish design? No, since landing on an arrow modifies only that arrow. Therefore, as *P>0.5* (ie there are more routes out than in of a given ring) any fiendish designs will tend to degrade, as they are destroyed by being traversed once and cannot be renewed except by chance*. The arrow directions will tend, as any design is destroyed, to randomness, and with the odds in the player's favour, it is only a matter of time before *d* decreases enough times for the player to win.


. *since if they were renewable by design, then that design would also tend to degrade.
