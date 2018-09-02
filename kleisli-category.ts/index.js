"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeWithBooleansLogger = () => {
    const negate = (x) => [!x, `negate(${x}); `];
    const composeOverBoolean = (f, g) => {
        return (x) => {
            const p1 = f(x);
            const p2 = g(p1["0"]);
            return [p2["0"], p2["1"].concat(p1["1"])];
        };
    };
    const negateTwice = composeOverBoolean(negate, negate)(true);
    console.log(negateTwice);
};
exports.composeWithGenericsLogger_Negate = () => {
    const negate = (x) => [!x, `negate(${x}); `];
    const compose = (join) => (f) => (g) => {
        return (x) => {
            const p1 = f(x);
            const p2 = g(p1["0"]);
            return [p2["0"], join(p2["1"], (p1["1"]))];
        };
    };
    const appendLog = (a, b) => a.concat(b);
    const composeWithLogging = compose(appendLog);
    const negateV2 = composeWithLogging(negate)(negate)(true);
    console.log(negateV2);
};
exports.composeWithGenericsLogger_Add10Duplicate = () => {
    const compose = (join) => (f) => (g) => {
        return (x) => {
            const p1 = f(x);
            const p2 = g(p1["0"]);
            return [p2["0"], join(p2["1"], (p1["1"]))];
        };
    };
    const add10 = (x) => [x + 10, "add10(); "];
    const duplicate = (x) => [2 * x, " duplicate(); "];
    const appendLog = (a, b) => a.concat(b);
    const composeWithLogging = compose(appendLog);
    const add10AndDuplicate = composeWithLogging(add10)(duplicate);
    // 10 => [ 20, 'add10(); ' ] => [ 40, ' duplicate(); add10(); ' ]
    console.log(add10AndDuplicate(10));
};
exports.composeWithGenericsLogger_add10I_after_isOdd = () => {
    const compose = (join) => (f) => (g) => {
        return (x) => {
            const p1 = f(x);
            const p2 = g(p1["0"]);
            return [p2["0"], join(p2["1"], (p1["1"]))];
        };
    };
    const appendLog = (a, b) => b.concat(a);
    const add10 = (x) => [x + 10, "add10(); "];
    const isOdd = (x) => [(x % 2 == 0), " isOdd(); "];
    const composed = compose(appendLog)(add10)(isOdd);
    // 10 => [ 20, 'add10(); ' ] => [ true, ' add10(); isOdd(); ' ]
    console.log(composed(10));
};
