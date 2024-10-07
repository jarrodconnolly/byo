# Build Your Own wc Tool

## Step One
wc -c test.txt
342190 test.txt

./ccwc.js -c test.txt
342190 test.txt

## Step Two
wc -l test.txt
7145 test.txt

./ccwc.js -l test.txt
7145 test.txt

## Step Three
wc -w test.txt
58164 test.txt

./ccwc.js -w test.txt
58164 test.txt

## Step Four
wc -m test.txt
339292 test.txt

./ccwc.js -m test.txt
339292 test.txt

## Step Five
wc test.txt
  7145  58164 342190 test.txt

./ccwc.js test.txt
7145 58164 342190 test.txt

## Final Step
cat test.txt | wc -l
7145

cat test.txt | ./ccwc.js -l
7145