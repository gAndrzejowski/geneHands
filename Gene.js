class Gene {

    constructor([spades, hearts, diams, clubs]) {
        this.spades = spades.map(card => card % 15 || 2);
        this.hearts = hearts.map(card => card % 15 || 2);
        this.diams = diams.map(card => card % 15 || 2);
        this.clubs = clubs.map(card => card % 15 || 2);
    }

    toString() {
        const parseSuit = suit => suit.length ? suit.map( card => {
            switch(card) {
                case 14:
                    return 'A';
                case 13:
                    return 'K';
                case 12:
                    return 'D';
                case 11:
                    return 'W';
                default:
                    return card;
            }
        }).join('') : '-';
        return `${parseSuit(this.spades)} ${parseSuit(this.hearts)} ${parseSuit(this.diams)} ${parseSuit(this.clubs)}`
    }

    toArray() {
        return [this.spades, this.hearts, this.diams, this.clubs];
    }

    getPointCount() {
        const countSuit = suit => suit.reduce((cum, current) => Math.max(cum, cum + current - 10), 0);
        return [this.spades, this.hearts, this.diams, this.clubs].reduce((cum, current) => cum + countSuit(current) , 0);
    }
}
module.exports = Gene;