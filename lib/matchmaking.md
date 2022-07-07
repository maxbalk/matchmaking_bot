# Balanced Number Partitioning

## Anytime CKK algorithm

## Initial KK Heuristic. Set differencing method
- sort elements decreasing order
- at each step, place 2 largest in each of the sets
- consider this as placing the difference into one subset
- insert difference into list (sorted order)
- continue until one number remains, the subset difference

## CKK tree construction
Take initial set of numbers, with the largest being the root node of the tree in its own subset

- Left child, the next largest number is placed into subset with largest
- Right child, next largest placed opposite

To do the above: 
- in the left branch, replace largest by their sum. 
- in the right branch, replace by their difference

If the largest element is greater than the sum of remaining elements, prune the branch. 

Keep track of the subset differences at each leaf node. 

Partition by backtracking reconstruction.

## Complete Balanced CKK

1. Sort players by decreasing elo
2. create pairs of players that include neighbors above and below
3. sort this subset of pairs by decreasing diff
4. find subset of non intersecting pairs with the least diff
5. build CKK tree with above pair subset
