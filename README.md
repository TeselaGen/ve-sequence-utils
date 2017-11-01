
## About this Repo
This is a collection of dna sequence utility functions.

All sequences and annotations (unless otherwise specified) are assumed to have 0-based inclusive indices. 
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

## Editing This Repo:
### All collaborators: 
Edit/create a new file and update/add any relevant tests.
Make sure they pass by running `npm test`

## Updating this repo: 
Commit and push all changes first (make sure tests are passing!)

### Teselagen collaborators: 
Commit and push all changes
Sign into npm using the teselagen npm account (npm whoami)

```
npm version patch|minor|major
npm publish
```

### Outside collaborators: 
fork and pull request please :)