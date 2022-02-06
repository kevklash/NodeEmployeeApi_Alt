'use strict';

const express = require('express');
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

// Our data object
const candidates = [];

// Our helper functions

// finder -helper function
const finder = (candidate, languages, matches) => {
  // We'll make sure there is at least one match
  let counter = 0;
  for (let language of languages) {
    if (candidate.skills.find((lang) => lang === language)) {
      // If a match is found, increase the counter by one
      counter += 1;
    }
  }
  candidate.counter = counter;

  // Found at least one match and candidates data is empty
  if (counter > 0 && matches.length === 0) {
    matches.push(candidate); // Simply push the candidate 
  } else if ( // Found at least one match and candidates data is not empty
    counter > 0 &&
    matches.length !== 0 &&
    candidate.counter > matches[0].counter // Aaaand the currently stored candidate has less skills
  ) {
    // Since other non requested skills don't matter
    // clear the matches and add the new one
    matches.splice(0,matches.length);

    // Add the current candidate to the matches list
    matches.push(candidate);
  } else if ( // Found at least one match and candidates data is not empty
    counter > 0 &&
    matches.length !== 0 &&
    candidate.counter === matches[0].counter // Buuut the currently stored candidate has the same amount of skills
  ) {
    // Since other non requested skills don't matter
    // clear the matches and add the new one
    matches.splice(0,matches.length);
    matches.push(candidate);
  }
  };

app.post('/candidates', function(req, res) {
  // ...
  // Define the body fields
  const {id, name, skills} = req.body;

  // Check that there is data in the request
  if(id.length === 0 || name.length === 0 || skills.length === 0){
    return res.status(400).json('Data must not be empty');
  }

  // Fill out the new object
  const createdCandidate = {
    id, 
    name,
    skills,
  };

  // Append to the candidates
  candidates.push(createdCandidate);
  res.status(201).json(createdCandidate);
});

app.get('/candidates/search', function(req, res) {
  // ...
  const skills = req.query.skills; // Get our query string param
  // Check that it is not empty
  if(!skills){
    return res.status(400).json('Data must not be empty');
  }
  // Create our array of requested languages
  const languages = skills.split(",");

  // Check if there is data in candidates
  if(candidates.length === 0){
    return res.status(404).json('There are no candidates');
  }

  // Initialize the matches
  const matches = [];

  // Start searching
  for (let candidate of candidates) {
    // Call our helper functions
    finder(candidate, languages, matches);
  }

  // check if there are no matches
  if(matches.length === 0){
    return res.status(404).json('No results match the search criteria');
  }

  // If there are matches, return them
  res.status(200).json(matches[0]);
});

app.listen(process.env.HTTP_PORT || 3000);
