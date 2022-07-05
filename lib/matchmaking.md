# Balanced Number Partitioning

## Anytime CKK algorithm

## Initial KK Heuristic. Set differencing method
- sort elements decreasing order
- at each step, place 2 largest in each of the sets
- consider this as placing the difference into one subset
- insert difference into list (sorted order)
- continue until one number remains, the subset difference


Take initial set of numbers, with the largest being the root node of the tree in its own subset

- Left child, the next largest number is placed into subset with largest
- Right child, next largest placed opposite

To do the above: 
- in the left branch, replace largest by their sum. 
- in the right branch, replace by their difference

If the largest element is greater than the sum of remaining elements, prune the branch. 

Keep track of the subset differences at each leaf node. 

Partition by backtracking reconstruction.