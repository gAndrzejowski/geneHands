const parseCard = cardNum => [Math.floor(cardNum/13), cardNum % 13 + 2];

const getRandomCard = () => Math.floor(Math.random() * 52);

const removeRandom = set => {
    const rest = Array.from(set.values());
    rest.splice(Math.floor(Math.random() * set.size), 1);
    return new Set(rest);
};

const parseHand = sets => sets.map(set => Array.from(set).sort((a, b) => b - a));

const unload = hand => {
    const numbered = hand.map((e, i) => e.map(card => i*13 + card - 2));
    return numbered.reduce((total, current) => total.concat(current), []);
};

const getHand = (cardGenerator, args = [new Set(), new Set(), new Set(), new Set()]) => {
    const length = args.map(set => set.size).reduce((sum, current) => sum + current);
    if (length === 13 ) return args;
    let nextCard = parseCard(cardGenerator());
    if (Number.isNaN(nextCard[0]) || Number.isNaN(nextCard[1])) nextCard = parseCard(getRandomCard());
    args[nextCard[0]].add(nextCard[1]);
    return getHand(cardGenerator, args);
};

const getRandomHand = () => {
    return parseHand(getHand(getRandomCard));
};

const mateHands = (hand1, hand2) => {
    const bag = new Set(unload(hand1).concat(unload(hand2)));
    const truncate = set => {
        if (set.size === 13) return set;
        return truncate(removeRandom(set));
    };
    let cards = Array.from(truncate(bag).values());
    return parseHand(getHand(() => cards.pop()));
};

const mutate = hand => {
    const bag = removeRandom(new Set(unload(hand)));
    const cards = Array.from(bag.values());
    return parseHand(getHand(() => cards.pop()));
};

module.exports = {
    getRandomHand,
    mateHands,
    mutate,
};
