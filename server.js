// create a bridge hand with given point count and distribution
const Population = require('./Population');
const fs = require('fs');

const [requestedHCP, requestedPattern, count, survivability, mutationRate, size, maxGenerations] = process.argv.slice(2);

const pop = new Population({
    requestedHCP,
    requestedPattern,
    count,
    maxGenerations,
    size,
    survivability,
    mutationRate
});
const results = pop.nextGeneration().map(e => e.toString());
if (!count || count < 5) console.log(results.join('\n'));
else {
    const filename = `results.${Date.now()}.json`;
    fs.writeFile(filename, JSON.stringify(results), () => console.log(`${results.length} results written to ${filename}`));
}

