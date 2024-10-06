# SOFTWARE PRODUCT REQUIREMENTS: ----------------------------
The product should be able to generate probabilistic nomograms. 
This is extending on traditional nomograms that rely on fixed value inputs to proide fixed outputs. 

## Input
N input variables, each of either single values or distributions.


## Output
Distribution of the output variable.

## Mathematical representation
Let a variable K representing single values, and the respective variable K* representing a distribution of values.

Traditional monograms are transformed from:
f(K1...KN) = C

to:
to f( K1*...KN*, K1 ... KM) = C*.

## Constrains
1 <= N< inf. 
0 <= M < inf
N+M >=2.

The statistical distributions of the input should be easily adjustable by the Nurse (User 2) by graphical means (clicking, sliding etc), and not, for example, by explicitly typing in the standard deviation or the mean of input distributions.
Method should be simple and intuitive, to be evaluated with usability tests.

# USER STORIES -----------------------------

## User story 1 (e.g. vendor):
As a vendor I want to be able to provide an equation to the software and a qualitative input range, and the appropriate nomogram to be output graphically.

## User story 2(e.g. nurse):
As a nurse, I want to be able to view a generated nomogram, and GRAPHICALLY (clicking, sliding etc) adjust the distribution of the input variables to view a distribution of outputs. 

## User story3 (e.g. patient):
As a patient, I want to be able to view the nomogram the nurse adjusted.

### Minimum Viable Product requirements:
Above functonality but for a fixed monogram equation/ simple 2 variable equations (e.g. A = B+C). 
Support adjusting the distribution of one variable.