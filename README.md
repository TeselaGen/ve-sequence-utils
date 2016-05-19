This is a collection of dna sequence utility functions.

All sequences (unless otherwise specified) are assumed to have 0-based inclusive indices. 
```
  Example:
  0123456
  ATGAGAG
  --fff--  (the feature covers GAG)
  0-based inclusive start:
  feature.start = 2
  1-based inclusive start:
  feature.start = 3
  0-based inclusive end:
  feature.end = 4
  1-based inclusive end:
  feature.end = 5
  ```
