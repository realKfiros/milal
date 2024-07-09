#!/bin/bash

# Import CSV files
mongoimport --host mongo:27017 --db milal --collection="words" --type csv --headerline --file="/data/words.csv"
mongoimport --host mongo:27017 --db milal --collection="beautiful_words" --type csv --headerline --file="/data/beautiful_words.csv"

echo "Data import completed."
