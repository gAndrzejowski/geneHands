const Gene = require('./Gene');
const {getRandomHand, mutate, mateHands} = require('./util');

class Population {

    constructor({
                    requestedHCP = null,
                    requestedPattern = '',
                    count = 1,
                    survivability = 0.5,
                    mutationRate = 0.1,
                    size = 100,
                    maxGenerations = 10000,
                }) {
        this.genePool = [];
        this.generation = 0;
        this.winners = [];
        this.mutationRate = mutationRate;
        this.survivability = survivability;
        this.requestedHCP = requestedHCP;
        this.maxGenerations = maxGenerations;
        this.requestedPattern = requestedPattern.split('-');
        this.requestedCount = count;
        while (this.genePool.length < size) this.genePool.push(new Gene(getRandomHand()));
    }

    getScore(gene){
        const HCPCost = Math.abs(gene.getPointCount() - this.requestedHCP) || 0;
        const patternCost = (() => {
            if (!this.requestedPattern.length) return 0;
            const {spades, hearts, diams, clubs} = gene;
            const pattern = [spades, hearts, diams, clubs].map(e => e.length);
            const indCosts = this.requestedPattern.map((e, i) => (e - pattern[i]) ** 2);
            return indCosts.reduce((el, cum) => el + cum);
        })();
        return 100 - HCPCost - patternCost;
    };

    getFittest(){
        return this.genePool.slice().sort((a, b) => this.getScore(b) - this.getScore(a)).slice(0, Math.ceil(this.survivability * this.genePool.length));
    };

    mate(pool){
        const matable = pool.slice();
        const nextPool = pool.slice();
        const matees = matable.length;
        while (nextPool.length < this.genePool.length) {
            const mateeA = Math.floor(Math.random() * matees);
            const mateeB = Math.floor(Math.random() * matees);
            nextPool.push(new Gene(mateHands(matable[mateeA].toArray(), matable[mateeB].toArray())));
        }
        return nextPool;
    };

    mutate(pool) { return pool.map((e) => Math.random() < this.mutationRate ? new Gene(mutate(e.toArray())) : e);}

    checkDeadline() {return this.generation >= this.maxGenerations;}

    checkFinished() {return this.winners.length >= this.requestedCount;}

    nextGeneration() {
        this.generation += 1;
        const cutoff = this.getFittest();
        while (this.getScore(cutoff[0]) === 100 && !this.checkFinished() && cutoff.length > this.genePool.length * this.survivability * 0.5) {
            const winner = cutoff.shift();
            this.winners.push(winner);
        }
        if (this.checkFinished() || this.checkDeadline()) {
            console.log(`Evolution finished in generation ${this.generation}`);
            return this.winners;
        }
        this.genePool = this.mutate(this.mate(cutoff));
        return this.nextGeneration();
    }
}
module.exports = Population;
