# 4.602 Reviewer

Site to help me grind image identifications for MIT
[4.602](https://ocw.mit.edu/courses/4-602-modern-art-and-mass-culture-spring-2012/)
exams. Currently, there are three different types of questions I have
implemented:

1. Free response identifying the artist and painting name.
2. Multiple choice selection from various paintings.
3. Identifying the year in which a painting was created (multiple choice)

To incentivize doing the free response questions, all such questions are worth 2
points.

# Contribution

## Setup

This is a standard vite project, so the following installation instructions
should work:

1. Install nodejs and yarn on your system.
2. Clone this repository.
3. `cd <repository path> && yarn`
4. `yarn dev` should spin up the dev server.

## Paintings

1. Add a new picture under `./public/paintings`
2. Add a new entry to `./allpaintings.json` with the form as follows:
  ```json
  {
    "src": "/paintings/execution.jpg",
    "artist": "Edouard Manet",
    "names": ["The Execution of Emperor Maximilian"],
    "years": [1867,1868,1869]
  },
  ```
